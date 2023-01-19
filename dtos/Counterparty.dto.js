module.exports = class CounterpartyDto {
    id;
    name;

    constructor(model = null) {
        this.id = model.id;
        this.name = model.name;
    }
}