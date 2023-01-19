const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const purchasesRouter = require('./purchasesRouter')
const productsRouter = require('./productsRouter')
const counterpartyRouter = require('./counterpartyRouter')
const nomenclatureRouter = require('./nomenclatureRouter')
const issuesRouter = require('./issuesRouter')

router.use(userRouter)
router.use(purchasesRouter)
router.use(productsRouter)
router.use(counterpartyRouter)
router.use(nomenclatureRouter)
router.use(issuesRouter)

module.exports = router