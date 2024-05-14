const dbConfig = require('../config/dbConfig.js');

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize (
    dbConfig.DATABASE,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        }
    }
)

sequelize.authenticate()
    .then(() => {
        console.log('connected..')
    })
    .catch(error => {
        console.log('Error' + error)
    })

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.clientes = require('./clienteModel.js')(sequelize, DataTypes)
db.vehiculos = require('./vehiculoModel.js')(sequelize, DataTypes)
db.servicios = require('./servicioModel.js')(sequelize, DataTypes)

db.clientes.hasMany(db.vehiculos, {
    foreignKey: 'clienteId',
    as: 'vehiculos'
})

db.vehiculos.belongsTo(db.clientes, {
    foreignKey: 'clienteId',
    as: 'cliente'
})

db.vehiculos.hasMany(db.servicios, {
    foreignKey: 'vehiculoId',
    as: 'servicios'
})

db.servicios.belongsTo(db.vehiculos, {
    foreignKey: 'vehiculoId',
    as: 'vehiculo'
})

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })

module.exports = db