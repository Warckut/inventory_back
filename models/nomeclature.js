const sequelize = require('../db')
const {DataTypes} = require('sequelize')
const {UnitMeasurementModel} = required('./unitMeasurement.js')

const NomenclatureModel = sequelize.define("nomenclature", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id1c: {type: DataTypes.STRING, required: true, unique: true},
    name: {type: DataTypes.STRING, required: true},
    nameGroup: {type: DataTypes.STRING, required: true }
})

UnitMeasurementModel.hasMany(NomenclatureModel);
NomenclatureModel.belongsTo(UnitMeasurementModel);