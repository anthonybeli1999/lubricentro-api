module.exports = (sequelize, DataTypes) => {
    const Vehiculo = sequelize.define('vehiculo', {
        Placa: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Marca: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Modelo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Anio: {
            type: DataTypes.STRING,
        },
        clienteId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    return Vehiculo
}