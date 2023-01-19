const ApiError = require('../error/ApiError')
const PurchasesService = require('../service/purchasesService')

class PurchasesController {
    async import(req, res, next) {
        try {
            const file = req.files['file']
            const type = file.name.split('.').pop()
            if ( type !== 'xml') {
                throw new ApiError(505, "Формат файла должен быть xml")
            }
            await PurchasesService.import(file.data)
            await PurchasesService.unloadingFromPurchases()
            return res.json({status:"succes"})
        } catch (e) {
            next(e);
        }
    }

    async createPurchase(req, res, next) {
        try {
            const {purchase} = req.body
            await PurchasesService.createPurchase(purchase)
            return res.json({status: 'succes'})
        } catch (e) {
            next(e)
        }
    }

    async getPurchases(req, res, next) {
        try {
            const purchases = await PurchasesService.getPurchases()
            return res.json(purchases)
        } catch (e) {
            next(e)
        }
    }

    async removePurchase(req, res, next) {
        try {
            const {id} = req.params;
            await PurchasesService.removePurchase(id)
            return res.json({status:"succes"})
        } catch (e) {
            next(e)
        }
    }
    
}

module.exports =  new PurchasesController()