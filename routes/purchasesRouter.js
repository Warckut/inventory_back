const Router = require('express')
const PurchasesController = require('../controllers/PurchasesController')
const router = new Router()

router.post('/purchases/import', PurchasesController.import);
router.get('/purchases/all', PurchasesController.getPurchases);
router.post('/purchases/create', PurchasesController.createPurchase);
router.post('/purchases/remove/:id', PurchasesController.removePurchase);

module.exports = router