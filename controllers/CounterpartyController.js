const ApiError = require('../error/ApiError')
const { NomenclatureModel } = require('../models/commodityAssets')
const CounterpartyService = require('../service/counterpartyService')

class CounterpartyController {

    async getCounterparties(req, res, next) {
        try {
            return res.json(await CounterpartyService.getCounterparties())
        } catch (e) {
            next(e)
        }
    }
}

module.exports =  new CounterpartyController()