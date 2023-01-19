const ApiError = require('../error/ApiError')
const productsService = require('../service/productsService')

class ProductsController {

    async getProducts(req, res, next) {
        try {
            // const page = parseInt(req.query.page)
            // const limit = parseInt(req.query.limit)
            // const products = await  purchasesService.getStockbalances()
            const products = await productsService.getProducts()
            return res.json(products)
        } catch (e) {
            next(e)
        }
    }
    
}

module.exports =  new ProductsController()