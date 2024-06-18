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

db.vehiculos = require('./vehiculoModel.js')(sequelize, DataTypes)
db.servicios = require('./servicioModel.js')(sequelize, DataTypes)
db.marcas = require('./marcaModel.js')(sequelize, DataTypes)
db.modelos = require('./modeloModel.js')(sequelize, DataTypes)

db.vehiculos.belongsTo(db.modelos, {
    foreignKey: 'modeloId',
    as: 'modelo'
})

db.vehiculos.hasMany(db.servicios, {
    foreignKey: 'vehiculoId',
    as: 'servicios'
})

db.servicios.belongsTo(db.vehiculos, {
    foreignKey: 'vehiculoId',
    as: 'vehiculo'
})

db.marcas.hasMany(db.modelos, {
    foreignKey: 'marcaId',
    as: 'modelos'
})

db.modelos.belongsTo(db.marcas, {
    foreignKey: 'marcaId',
    as: 'marca'
})

db.sequelize.sync({ force: false })
    .then(() => {
        console.log('yes re-sync done!')
    })

module.exports = db