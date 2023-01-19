const { 
    NomenclatureModel,
    UnitMeasurementModel,
    PurchasesGoodsModel,
    IssuesGoodsModel,
} = require('../models/commodityAssets')
const ProductDto = require('../dtos/product.dto');
const NomenclatureDto = require('../dtos/Nomenclature.dto');

class ProductsService {
    async getStockbalances() {
        const purchasesGoods = await PurchasesGoodsModel.findAll();
        const issuesGoods = await IssuesGoodsModel.findAll();
        const goods = []

        purchasesGoods.forEach((el) => {
            let existGoodsItemId = goods.findIndex(
                (goodsItem) => goodsItem.nomenclatureId === el.nomenclatureId
            );
            if (existGoodsItemId >= 0)
                goods[existGoodsItemId].count += el.count;
            else {
                goods.push(el.dataValues);
            }
        })
        issuesGoods.forEach((el) => {
            let existGoodsItemId = goods.findIndex(
                (goodsItem) => goodsItem.nomenclatureId === el.nomenclatureId
            );
            if (existGoodsItemId && goods[existGoodsItemId].count > el.count)
                goods[existGoodsItemId].count -= el.count
            if (goods[existGoodsItemId].count === el.count) {
                delete goods[existGoodsItemId];
            }
        })
        

        return goods
    }

    async getProducts() {
        const goods = await this.getStockbalances();
        let products = []
        for(const element of goods) {
            const nomenclature = await NomenclatureModel.findOne({where: {id: element.nomenclatureId}})
            const unitMeasurements = await UnitMeasurementModel.findOne({where: {id: nomenclature.unitMeasurementId}})
            products.push(new ProductDto({
                id: element.id, 
                name: new NomenclatureDto(nomenclature),
                count: element.count,
                unitMeasurements: unitMeasurements.name
            }))
        }
        return products 
            
    }
}

module.exports = new ProductsService()