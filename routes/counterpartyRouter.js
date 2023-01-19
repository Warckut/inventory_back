const Router = require('express')
const CounterpartyController = require('../controllers/counterpartyController')
const router = new Router()

router.get('/counterparties/all', CounterpartyController.getCounterparties)

module.exports = router