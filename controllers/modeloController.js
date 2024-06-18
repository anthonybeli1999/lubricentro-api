const { Op } = require('sequelize')
const db = require('../models')
const { validationResult } = require('express-validator')

const Modelo = db.modelos
const sequelize = db.sequelize

const agregarModelo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
  }
  let t;
  try {
      t = await sequelize.transaction();
      const ultimoModelo = await Modelo.findOne({
          order: [['id', 'DESC']],
          transaction: t
      });
      const siguienteID = ultimoModelo ? ultimoModelo.id + 1 : 1;
      let info = {
          id: siguienteID,
          Nombre: req.body.Nombre,
          Estado: 'A',
          marcaId: req.body.marcaId
      }
      const modelo = await Modelo.create(info, { transaction: t });
      await t.commit();
      return res.status(200).send(modelo);
  } catch (error) {
      if (t) await t.rollback();
      return res.status(500).send({ message: "Error al crear el modelo", error: error.message });
  }
}

const actualizarModelo = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();
        let id = req.body.id
        const modelo = await Modelo.update(req.body, {where: { id: id }})
        await t.commit()
        res.status(200).send(modelo)
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al modificar el modelo", error: error.message });
    }
}

const obtenerModelos =async (req, res) => {
    try {
        let modelos = await Modelo.findAll({
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
        res.status(200).send(modelos)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los modelos", error: error.message }
        )
    }
}

const obtenerModelosPorMarca = async (req, res) => {
    try {
        let marcas = await Modelo.findAll({
            where: {
                marcaId: req.body.marcaId,
                Estado: 'A'
            },
            attributes: [
                'id',
                'Nombre'
            ],
            order: [
                ['Nombre', 'ASC']
            ],
        })
        res.status(200).send(marcas)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener las marcas", error: error.message }
        )
    }
}

const buscarModelo =async (req, res) => {
    try {
        let marcas = await Modelo.findAll({
            where: {
                marcaId: req.body.marcaId,
                Nombre: {
                    [Op.like]: `%${req.body.Nombre}%`
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

const eliminarModelo = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();
        let id = req.body.id
        const modelo = await Modelo.update({Estado: 'I'}, {where: { id: id }})
        await t.commit()
        res.status(200).send(modelo)
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al modificar el modelo", error: error.message });
    }
};

module.exports = {
  agregarModelo,
  actualizarModelo,
  obtenerModelos,
  obtenerModelosPorMarca,
  buscarModelo,
  eliminarModelo
}