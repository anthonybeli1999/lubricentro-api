const { where } = require('sequelize')
const db = require('../models')
const { validationResult } = require('express-validator')

const Servicio = db.servicios
const Vehiculo = db.vehiculos
const sequelize = db.sequelize

const agregarServicio = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    let t;
    try {
        t = await sequelize.transaction();
        const ultimoServicio = await Servicio.findOne({
            order: [['id', 'DESC']],
            transaction: t
        });
        const siguienteID = ultimoServicio ? ultimoServicio.id + 1 : 1;
        let info = {
            id: siguienteID,
            Tipo: req.body.Tipo,
            Servicio: req.body.Servicio,
            Detalle: req.body.Detalle,
            KmA: req.body.KmA,
            KmPC: req.body.KmPC,
            Fecha: req.body.Fecha,
            Monto: req.body.Monto,
            EstadoPago: req.body.EstadoPago,
            MontoPago: req.body.MontoPago,
            Personal: req.body.Personal,
            vehiculoId: req.body.vehiculoId
        }
        const servicio = await Servicio.create(info, { transaction: t });
        await t.commit();
        return res.status(200).send(servicio);
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al crear el servicio", error: error.message });
    }
};

const actualizarServicio = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();
        let id = req.body.id
        const servicio = await Servicio.update(req.body, {where: { id: id }})
        await t.commit()
        res.status(200).send(servicio)
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al modificar el servicio", error: error.message });
    }
};

const obtenerServicios = async (req, res) => {
    try {
        let servicios = await Servicio.findAll({
            attributes: [
                'id',
                'Tipo',
                'Servicio',
                'Detalle',
                'KmA',
                'KmPC',
                'Fecha',
                'Monto',
                'EstadoPago',
                'Personal',
            ],
            include: [{
                model: Vehiculo,
                as: 'vehiculo',
                attributes: ['Placa', 'Tipo', 'Marca', 'Modelo', 'Anio']
                
            }]
        })
        res.status(200).send(servicios)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los servicios", error: error.message }
        )
    }
};

const buscarServicios = async (req, res) => {
    let id = req.body.vehiculoId
    try {
        let servicios = await Servicio.findAll({
            where: {
                vehiculoId: id
            },
            attributes: [
                'id',
                'Tipo',
                'Servicio',
                'Detalle',
                'KmA',
                'KmPC',
                [sequelize.literal('DATE_FORMAT(Fecha, "%d/%m/%Y")'), 'FechaFormateada'],
                [sequelize.literal('DATE_FORMAT(Fecha, "%Y-%m-%d")'), 'FechaIngreso'],
                'Monto',
                'EstadoPago',
                'MontoPago',
                'Personal',
                'vehiculoId'
            ],
            include: [{
                model: Vehiculo,
                as: 'vehiculo',
                attributes: ['Placa', 'Tipo', 'Marca', 'Modelo', 'Anio']
            }]
        })
        res.status(200).send(servicios)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los servicios", error: error.message }
        )
    }
};

module.exports = {
    agregarServicio,
    actualizarServicio,
    obtenerServicios,
    buscarServicios
}