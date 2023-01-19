const PurchasesGoodsDto = require("./PurchaseGoods.dto");

module.exports = class PurchaseDto {
    id;
    counterparty;
    date;
    totalPrice;
    status;
    purchasesGoods;

    constructor(model = null) {
        this.id = model.id;
        this.totalPrice = model.totalPrice
        this.counterparty = model.counterparty
        this.date = model.date
        this.status = model.status
        this.purchasesGoods = Array.isArray(model?.goods) ? 
        model.goods.map( (one) => (one instanceof PurchasesGoodsDto) ? one : new PurchasesGoodsDto(one)) : []
    }
}