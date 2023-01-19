const { 
    GoodsModel,
    NomenclatureModel,
    UnitMeasurementModel,
    PurchaseModel,
    CounterpartyModel,
    WarenhouseModel,
    PurchasesGoodsModel
} = require('../models/commodityAssets')

const PurchaseDto = require('../dtos/Purchase.dto');
const xml2js = require('xml2js')
const moment = require('moment');
const PurchasesGoodsDto = require('../dtos/PurchaseGoods.dto');
const CounterpartyDto = require('../dtos/Counterparty.dto');
const NomenclatureDto = require('../dtos/Nomenclature.dto')

class PurchasesService {

    async getJSONFromXML(data) {
        const parser = new xml2js.Parser();
        // const data = fs.readFileSync(__dirname + '/dataXML.xml')
        return await parser.parseStringPromise(data)
    }

    async import(data) {
        const result = await this.getJSONFromXML(data)
        // КОНТРАГЕНТЫ
        for (const counterparty of result.root["CatalogObject.Контрагенты"]){
            if ( counterparty.IsFolder[0] === 'false'){
                const exist = await CounterpartyModel.findOne({ where: { Id1c: counterparty.Ref[0] } })
                if (!exist)
                await CounterpartyModel.create({
                    Id1c: counterparty.Ref[0], 
                    name: counterparty["НаименованиеСокращенное"] ? counterparty["НаименованиеСокращенное"][0] : counterparty.Description[0],
                    ITN: counterparty["ИНН"] ? counterparty["ИНН"][0] : null, 
                })
            } else if (counterparty.IsFolder[0] === 'true') {
                // typeNomen.set(element.Ref, {
                //     name: element.Description // Добавление группы для контрагентов
                // })
            }
        }

        // ЕДИНИЦЫ ИЗМЕРЕНИЯ
        for (const unitMeasurement of result.root["CatalogObject.КлассификаторЕдиницИзмерения"]) {
            const exist = await UnitMeasurementModel.findOne({ where: { Id1c: unitMeasurement.Ref[0] } })
            
            if (!exist)
                await UnitMeasurementModel.create({
                    Id1c: unitMeasurement.Ref[0],
                    name: unitMeasurement.Description[0],
                    code: unitMeasurement.Code[0]
                })
        }

        // НОМЕНКЛАТУРА
        for (const nomenclatue of result.root["CatalogObject.Номенклатура"]) {
            if ( nomenclatue.IsFolder[0] === 'false'){
                const exist = await NomenclatureModel.findOne({ where: { Id1c: nomenclatue.Ref[0] } })
                if ( !exist ) {
                    const unitMeasurement = await UnitMeasurementModel.findOne({where: {Id1c: nomenclatue["ЕдиницаИзмерения"][0]}})
                    // console.log(unitMeasurementId)
                    await NomenclatureModel.create({
                        Id1c: nomenclatue.Ref[0],
                        name: nomenclatue["НаименованиеПолное"][0],
                        nameGroup: nomenclatue["ТипНоменклатуры"][0],
                        unitMeasurementId: unitMeasurement.id // обработать ошибку если нет такого id или нет
                    })
                }
            } else if (nomenclatue.IsFolder[0] === 'true') {
                // typeNomen.set(element.Ref, {
                //     name: element.Description // Добавление группы для номенклатуры
                // })
            }
        }

        // ЗАКУПКИ
        for(const element of result.root["DocumentObject.МЗ_Покупка"]) {
            const exist = await PurchaseModel.findOne({ 
                where: { 
                    Id1c: element.Ref[0] 
                } 
            })
            const сounterparty = await CounterpartyModel.findOne({where: {Id1c: element["Грузоотправитель"][0]}})
            const amount = element["СуммаДокумента"][0]
            if (!exist) {
                let warenhouseBase = await WarenhouseModel.findOne({where: {name: 'Основной склад'}}) 
                if (!warenhouseBase) {
                    warenhouseBase = await WarenhouseModel.create({
                        name: 'Основной склад'
                    })
                }
                const purchase = await PurchaseModel.create({
                    Id1c: element.Ref[0],
                    date: new Date(element.Date[0] + "Z"),
                    counterpartyId: сounterparty.id,
                    purchaseAmount: amount,
                    status: "Отгружено",
                    warenhouseId: warenhouseBase.id
                })

                for (const material of element["Материалы"][0].Row) {
                    const nomenclature = await NomenclatureModel.findOne({where: {Id1c: material["Номенклатура"][0]}})
                    await PurchasesGoodsModel.create({
                        count: material["Количество"][0],
                        price: material["Сумма"][0],
                        purchaseId: purchase.id,
                        nomenclatureId: nomenclature.id
                    })
                }
            }
        }
    }

    async getPurchases() {
        let purchases = []
        const purchasesModel = await PurchaseModel.findAll()
        for (const purchase of purchasesModel){
            const counterparty = await CounterpartyModel.findOne({where: {id: purchase.counterpartyId}})
            const purchasesGoods = await this.getPurchasesGoodsByPurchaseId(purchase.id)
            
            purchases.push(new PurchaseDto({
                id: purchase.id,
                counterparty: new CounterpartyDto({id: counterparty.id, name: counterparty.name}),
                date: purchase.date,
                totalPrice: purchase.purchaseAmount,
                status: purchase.status,
                goods: purchasesGoods
            }))
        }
        return purchases    
    }

    async getPurchasesGoodsByPurchaseId(purchaseId) {
        const purchasesGoods = await PurchasesGoodsModel.findAll({where: { purchaseId: purchaseId}})
        const purchasesGoodsDTO = []
        for(const element of purchasesGoods) {
            const nomenclature = await NomenclatureModel.findOne({where: {id: element.nomenclatureId}})
            const unitMeasurements = await UnitMeasurementModel.findOne({where: {id: nomenclature.unitMeasurementId}})
            const nomenclatureDto = new NomenclatureDto({
                id: nomenclature.id,
                name: nomenclature.name,
                unitMeasurement: unitMeasurements.name
            })
            purchasesGoodsDTO.push( new PurchasesGoodsDto({
                id: element.id, 
                name: nomenclatureDto,
                price: element.price,
                count: element.count,
                purchaseId: element.purchaseId,
                unitMeasurements: unitMeasurements.name
            }))
        }
        return purchasesGoodsDTO
    }

    async createPurchase(purchase) {
        const counterparty = purchase.counterparty
        const purchaseModel = await PurchaseModel.create({
            date: purchase.date,
            counterpartyId: counterparty.id,
            purchaseAmount: purchase.totalPrice,
            status: purchase.status,
            warenhouseId: 1
        })
        console.log(purchaseModel)
        for(let purchasesGoodsItem of purchase.purchasesGoods ) {
            const nomenclature = purchasesGoodsItem.name
            await PurchasesGoodsModel.create({
                count: purchasesGoodsItem.count,
                price: purchasesGoodsItem.price,
                purchaseId: purchaseModel.id,
                nomenclatureId: nomenclature.id
            })
        }
    }

    async removePurchase(purchaseId) {
        PurchasesGoodsModel.destroy({
            where: { purchaseId: purchaseId }
        }).then(function(){})
        PurchaseModel.destroy({
            where: { id: purchaseId }
        }).then(function(){})
    }
}

module.exports = new PurchasesService()