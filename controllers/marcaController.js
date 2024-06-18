const { Op } = require('sequelize')
const db = require('../models')
const { validationResult } = require('express-validator')

const Marca = db.marcas
const sequelize = db.sequelize

const agregarMarca = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
  }
  let t;
  try {
      t = await sequelize.transaction();
      const ultimaMarca = await Marca.findOne({
          order: [['id', 'DESC']],
          transaction: t
      });
      const siguienteID = ultimaMarca ? ultimaMarca.id + 1 : 1;
      let info = {
          id: siguienteID,
          Nombre: req.body.Nombre,
          Estado: 'A'
      }
      const marca = await Marca.create(info, { transaction: t });
      await t.commit();
      return res.status(200).send(marca);
  } catch (error) {
      if (t) await t.rollback();
      return res.status(500).send({ message: "Error al crear la marca", error: error.message });
  }
}

const actualizarMarca = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();
        let id = req.body.id
        const marca = await Marca.update(req.body, {where: { id: id }})
        await t.commit()
        res.status(200).send(marca)
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al modificar la marca", error: error.message });
    }
}

const obtenerMarcas =async (req, res) => {
    try {
        let marcas = await Marca.findAll({
            attributes: [
                'id',
                'Nombre'
            ],
            order: [
                ['Nombre', 'ASC']
            ],
            where: {
                Estado: 'A'
            }
        })
        res.status(200).send(marcas)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener las marcas", error: error.message }
        )
    }
}

const buscarMarca =async (req, res) => {
    let parametro = req.body.Parametro
    try {
        let marcas = await Marca.findAll({
            where: {
                Nombre: {
                    [Op.like]: `%${parametro}%`
                },
                Estado: 'A'
            },
            order: [
                ['Nombre', 'ASC']
            ],
            attributes: [
                'id',
                'Nombre'
            ],
        })
        res.status(200).send(marcas)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener las marcas", error: error.message }
        )
    }
}

const eliminarMarca = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();
        let id = req.body.id
        const marca = await Marca.update({Estado: 'I'}, {where: { id: id }})
        await t.commit()
        res.status(200).send(marca)
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al modificar la marca", error: error.message });
    }
};

module.exports = {
  agregarMarca,
  actualizarMarca,
  obtenerMarcas,
  buscarMarca,
  eliminarMarca
}