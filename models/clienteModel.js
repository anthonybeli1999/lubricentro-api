module.exports = (sequelize, DataTypes) => {
    const Cliente = sequelize.define('cliente', {
        Documento: {
            type: DataTypes.STRING,
            unique: true
        },
        Nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Celular: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Correo: {
            type: DataTypes.STRING
        }
    })

    return Cliente
}