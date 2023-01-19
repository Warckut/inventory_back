const { 
    CounterpartyModel
} = require('../models/commodityAssets')

class CounterpartyService {
    
    async getCounterparties() {
        const counterparties = await CounterpartyModel.findAll()
        return counterparties.map((counterparty) => {
            return {
                id: counterparty.id,
                name: counterparty.name
            }
        })
    }
}

module.exports =  new CounterpartyService()