module.exports = class NomenclatureDto {
    id;
    name;
    unitMeasurement;

    constructor(model = null) {
        this.id = model.id;
        this.name = model.name;
        this.unitMeasurement = model.unitMeasurement
    }
}