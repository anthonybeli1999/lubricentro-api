module.exports = (sequelize, DataTypes) => {
  const Marca = sequelize.define('marca', {
      Nombre: {
          type: DataTypes.STRING,
          allowNull: false
      },
      Estado: {
          type: DataTypes.STRING,
          allowNull: false
      }
  })
  
  return Marca
}