const Router = require('express')
const nomenclatureController = require('../controllers/nomenclatureController')
const router = new Router()


router.get('/nomenclatures/all', nomenclatureController.getNomenclature);

module.exports = router