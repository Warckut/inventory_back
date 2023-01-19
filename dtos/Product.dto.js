module.exports = class ProductDto {
    id;
    name;
    count;
    unitMeasurements;

    constructor(model) {
        this.id = model.id;
        this.name = model.name;
        this.count = model.count;
        this.unitMeasurements = model.unitMeasurements
    }
}