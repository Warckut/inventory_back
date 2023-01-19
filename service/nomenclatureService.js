const {
    NomenclatureModel,
    UnitMeasurementModel
} = require('../models/commodityAssets')

class NomenclatureService {

    async getNomenclature() {
        const nomenclatures = await NomenclatureModel.findAll()
        const nomenclaturesDto = []
        for(const nomenclature of nomenclatures) {
            const unitMeasurements = await UnitMeasurementModel.findOne({where: {id: nomenclature.unitMeasurementId}})
            nomenclaturesDto.push({
                id: nomenclature.id,
                name: nomenclature.name,
                unitMeasurement: unitMeasurements.name
            })
        }
        return nomenclaturesDto
    }

}

module.exports =  new NomenclatureService()