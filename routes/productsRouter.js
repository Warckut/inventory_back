const Router = require('express')
const ProductsController = require('../controllers/ProductsController')
const router = new Router()

router.get('/products/all', ProductsController.getProducts);

module.exports = router