const Router = require('express')
const router = new Router()
const IssuesController = require('../controllers/IssuesController')

router.get('/issues/all', IssuesController.getPurchases);
router.post('/issues/create', IssuesController.createPurchase);

module.exports = router