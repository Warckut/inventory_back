const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const CounterpartyModel = sequelize.define('counterparty', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id1c: {type: DataTypes.STRING, required: true, unique: true},
    name: {type: DataTypes.STRING, required: true },
    ITN: {type: DataTypes.STRING, required: true }
})

const UnitMeasurementModel = sequelize.define('unit_measurement', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id1c: {type: DataTypes.STRING, required: true, unique: true},
    name: {type: DataTypes.STRING, required: true},
    code: {type: DataTypes.INTEGER, required: true }
})

const NomenclatureModel = sequelize.define("nomenclature", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id1c: {type: DataTypes.STRING, required: true, unique: true},
    name: {type: DataTypes.STRING, required: true},
    nameGroup: {type: DataTypes.STRING, required: true }
})

UnitMeasurementModel.hasMany(NomenclatureModel);
NomenclatureModel.belongsTo(UnitMeasurementModel);

const WarenhouseModel = sequelize.define('warenhouse', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, required: true}
})

// default warenhouses: Основной и Склад готовой продукции

const PurchaseModel = sequelize.define("purchase", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id1c: {type: DataTypes.STRING, required: false, unique: true},
    date: {type: DataTypes.DATE, required: true},
    purchaseAmount: {type: DataTypes.DECIMAL, required: true },
    status: { type: DataTypes.STRING, required: true },
})

CounterpartyModel.hasMany(PurchaseModel);
PurchaseModel.belongsTo(CounterpartyModel);

WarenhouseModel.hasMany(PurchaseModel);
PurchaseModel.belongsTo(WarenhouseModel);

const PurchasesGoodsModel = sequelize.define("purchases_goods", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.FLOAT, required: true},
    price: {type: DataTypes.DECIMAL, required: true}
})

PurchaseModel.hasMany(PurchasesGoodsModel);
PurchasesGoodsModel.belongsTo(PurchaseModel);

NomenclatureModel.hasMany(PurchasesGoodsModel);
PurchasesGoodsModel.belongsTo(NomenclatureModel);

const IssuesModel = sequelize.define('issues', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id1c: {type: DataTypes.STRING, required: false, unique: true},
    date: {type: DataTypes.DATE, required: true},
    issuesAmount: {type: DataTypes.DECIMAL, required: true },
    status: { type: DataTypes.STRING, required: true },
})

CounterpartyModel.hasMany(IssuesModel);
IssuesModel.belongsTo(CounterpartyModel);

const IssuesGoodsModel = sequelize.define('issues_goods', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.FLOAT, required: true},
    price: {type: DataTypes.DECIMAL, required: true}
})

IssuesModel.hasMany(IssuesGoodsModel);
IssuesGoodsModel.belongsTo(IssuesModel);
 
NomenclatureModel.hasMany(IssuesGoodsModel);
IssuesGoodsModel.belongsTo(NomenclatureModel);

module.exports = {
    WarenhouseModel,
    CounterpartyModel,
    UnitMeasurementModel,
    NomenclatureModel,
    PurchaseModel,
    PurchasesGoodsModel,
    IssuesModel,
    IssuesGoodsModel
}