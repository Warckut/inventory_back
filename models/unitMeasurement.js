const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const UnitMeasurementModel = sequelize.define('unit_measurement', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    Id1c: {type: DataTypes.STRING, required: true, unique: true},
    name: {type: DataTypes.STRING, required: true},
    code: {type: DataTypes.INTEGER, required: true }
})

module.exports = {
    UnitMeasurementModel
}