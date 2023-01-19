const {
    IssuesGoodsModel, 
    IssuesModel,
    CounterpartyModel,
    NomenclatureModel,
    UnitMeasurementModel
} = require('../models/commodityAssets')

const IssueDto = require('../dtos/Issue.dto')
const IssueGoodsDto = require('../dtos/IssueGoods.dto')
const NomenclatureDto = require('../dtos/Nomenclature.dto')
const CounterpartyDto = require('../dtos/Counterparty.dto')
const productsService = require('./productsService')
const ApiError = require('../error/ApiError')

class IssuesService {
    async getIssues() {
        let issues = [] 
        const issuesModel = await IssuesModel.findAll()
        for (const issue of issuesModel){
            const counterparty = await CounterpartyModel.findOne({where: {id: issue.counterpartyId}})
            const issueGoods = await this.getIssueGoodsByIssueId(issue.id)
            
            issues.push(new IssueDto({
                id: issue.id,
                counterparty: new CounterpartyDto({id: counterparty.id, name: counterparty.name}),
                date: issue.date,
                totalPrice: issue.purchaseAmount,
                status: issue.status,
                goods: issueGoods
            }))
        }
        return issues   
    }

    async getIssueGoodsByIssueId(issueId) {
        const issuesGoods = await IssuesGoodsModel.findAll({where: { issueId: issueId}})
        const issuesGoodsDTO = []
        for(const element of issuesGoods) {
            const nomenclature = await NomenclatureModel.findOne({where: {id: element.nomenclatureId}})
            const unitMeasurements = await UnitMeasurementModel.findOne({where: {id: nomenclature.unitMeasurementId}})
            const nomenclatureDto = new NomenclatureDto({
                id: nomenclature.id,
                name: nomenclature.name,
                unitMeasurement: unitMeasurements.name
            })
            issuesGoodsDTO.push( new IssueGoodsDto({
                id: element.id, 
                name: nomenclatureDto,
                price: element.price,
                count: element.count,
                unitMeasurements: unitMeasurements.name
            }))
        }
        return issuesGoodsDTO
    }

    async checkIssue(issueGoods) {
        const products = await productsService.getProducts()
        issueGoods.forEach((issueGoodsItem) => {
            const findproduct = products.find((product) => (product.name.id === issueGoodsItem.name.id))
            // console.log(findproduct === undefined || findproduct.count < issueGoodsItem.count)
            if (findproduct === undefined || findproduct.count < issueGoodsItem.count)
                throw ApiError.BadRequest('Не хватает товара на складе.')               
        })
    }

    async createIssue(issue) {
        const counterparty = issue.counterparty
        // console.log(issue.issueGoods)
        await this.checkIssue(issue.issueGoods)
        // if (await this.checkIssue(issue.issueGoods)){
        console.log(issue)
        const issueModel = await IssuesModel.create({
            date: issue.date,
            counterpartyId: counterparty.id,
            purchaseAmount: issue.totalPrice,
            status: issue.status })
            
            for(let issueGoodsItem of issue.issueGoods ) {
                const nomenclature = issueGoodsItem.name
                await IssuesGoodsModel.create({
                    count: issueGoodsItem.count,
                    price: issueGoodsItem.price,
                    issueId: issueModel.id,
                    nomenclatureId: nomenclature.id })
            }        
    }
}

module.exports = new IssuesService()