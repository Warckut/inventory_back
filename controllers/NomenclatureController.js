const nomenclatureService = require('../service/nomenclatureService')

class NomenclatureController {
    async getNomenclature(req, res, next) {
        try {
            return res.json(await  nomenclatureService.getNomenclature())
        } catch (e) {
            next(e)
        }
    }
}

module.exports =  new NomenclatureController()