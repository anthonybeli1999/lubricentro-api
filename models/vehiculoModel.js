module.exports = (sequelize, DataTypes) => {
    const Vehiculo = sequelize.define('vehiculo', {
        Placa: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        modeloId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Anio: {
            type: DataTypes.STRING,
        },
        Tipo: {
            type: DataTypes.STRING,
        },
        Cliente: {
            type: DataTypes.STRING,
        },
        Celular: {
            type: DataTypes.STRING,
        },
        Fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Estado: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Vehiculo
}