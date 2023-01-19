module.exports = class PurchasesGoodsDto {
    id;
    name;
    count;
    price;
    unitMeasurements;

    constructor(model = null) {
        this.id = model.id;
        this.name = model.name;
        this.price = model.price;
        this.count = model.count;
        this.unitMeasurements = model.unitMeasurements
    }
}