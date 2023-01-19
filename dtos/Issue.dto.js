const IssueGoodsDto = require("./IssueGoods.dto");

module.exports = class IssueDto {
    id;
    counterparty;
    date;
    totalPrice;
    status;
    issueGoods;

    constructor(model = null) {
        this.id = model.id;
        this.totalPrice = model.totalPrice
        this.counterparty = model.counterparty
        this.date = model.date
        this.status = model.status
        this.issueGoods = Array.isArray(model?.goods) ? 
        model.goods.map( (one) => (one instanceof IssueGoodsDto) ? one : new IssueGoodsDto(one)) : []
    }
}