module.exports = (sequelize, DataTypes) => {
    const Servicio = sequelize.define('servicio', {
        Tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Servicio: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Detalle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        KmA: {
            type: DataTypes.STRING,
            allowNull: false
        },
        KmPC: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        Monto: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        EstadoPago: {
            type: DataTypes.STRING,
            allowNull: false
        },
        MontoPago: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        Personal: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vehiculoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Estado: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    
    return Servicio
}