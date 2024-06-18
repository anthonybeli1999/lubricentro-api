module.exports = (sequelize, DataTypes) => {
  const Modelo = sequelize.define('modelo', {
      Nombre: {
          type: DataTypes.STRING,
          allowNull: false
      },
      Estado: {
          type: DataTypes.STRING,
          allowNull: false
      },
      marcaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  })
  
  return Modelo
}