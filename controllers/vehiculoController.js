const { Op } = require('sequelize')
const db = require('../models')
const { validationResult } = require('express-validator')

const Vehiculo = db.vehiculos
const Cliente = db.clientes
const Servicio = db.servicios

const sequelize = db.sequelize

const agregarVehiculo = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    let t;
    try {
        t = await sequelize.transaction();
        const ultimoVehiculo = await Vehiculo.findOne({
            order: [['id', 'DESC']],
            transaction: t
        });
        const siguienteID = ultimoVehiculo ? ultimoVehiculo.id + 1 : 1;
        let info = {
            id: siguienteID,
            Placa: req.body.Placa,
            Tipo: req.body.Tipo,
            Marca: req.body.Marca,
            Modelo: req.body.Modelo,
            Anio: req.body.Anio,
            clienteId: req.body.clienteId
        }
        const vehiculo = await Vehiculo.create(info, { transaction: t });
        await t.commit();
        return res.status(200).send(vehiculo);
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al crear el vehiculo", error: error.message });
    }
};

const actualizarVehiculo = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();
        let id = req.body.id
        const vehiculo = await Vehiculo.update(req.body, {where: { id: id }})
        await t.commit()
        res.status(200).send(vehiculo)
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al modificar el vehiculo", error: error.message });
    }
};

const obtenerVehiculos = async (req, res) => {
    try {
        let vehiculos = await Vehiculo.findAll({
            attributes: [
                'id',
                'Placa',
                'Tipo',
                'Marca',
                'Modelo',
                'Anio',
                'clienteId'
            ],
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: ['Documento', 'Nombre', 'Celular', 'Correo']               
            }, {
                model: Servicio,
                as: 'servicios',
                attributes: [
                    'id',
                    'Tipo',
                    'Servicio',
                    'Detalle',
                    'KmA',
                    'KmPC',
                    [sequelize.literal("DATE_FORMAT(`servicios`.`Fecha`, '%d/%m/%Y')"), 'Fecha'],
                    [sequelize.literal("DATE_FORMAT(`servicios`.`Fecha`, '%Y-%m-%d')"), 'FechaFormateada'],
                    'Monto',
                    'EstadoPago',
                    'MontoPago',
                    'Personal',
                    'vehiculoId'
                ]
            }]
        })
        res.status(200).send(vehiculos)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los vehiculos", error: error.message }
        )
    }
};



const buscarVehiculo = async (req, res) => {
    let parametro = req.body.Parametro
    try {
        let vehiculos = await Vehiculo.findAll({
            where: {
                [Op.or]: [
                    {
                        Placa: {
                            [Op.like]: `%${parametro}%`
                        }
                    },
                    {
                        '$cliente.Documento$': {
                            [Op.like]: `%${parametro}%`
                        }
                    },
                    {
                        '$cliente.Nombre$': {
                            [Op.like]: `%${parametro}%`
                        }
                    }
                ]
            },
            attributes: [
                'id',
                'Placa',
                'Tipo',
                'Marca',
                'Modelo',
                'Anio',
                'clienteId'
            ],
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: ['Documento', 'Nombre', 'Celular', 'Correo']               
            }, {
                model: Servicio,
                as: 'servicios',
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
                    'Personal'
                ]
            }]
        })
        res.status(200).send(vehiculos)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los vehiculos", error: error.message }
        )
    }
};


const obtenerVehiculosConPagosPendientes = async (req, res) => {
    try {
        let vehiculos = await Vehiculo.findAll({
            attributes: [
                'id',
                'Placa',
                'Tipo',
                'Marca',
                'Modelo',
                'Anio',
            ],
            include: [{
                model: Cliente,
                as: 'cliente',
                attributes: ['Documento', 'Nombre', 'Celular', 'Correo']               
            }, {
                model: Servicio,
                as: 'servicios',
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
                    'Personal'
                ],
                where: {
                    EstadoPago: 'D'
                }
            }]
        })
        res.status(200).send(vehiculos)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los vehiculos", error: error.message }
        )
    }
};

module.exports = {
    agregarVehiculo,
    actualizarVehiculo,
    obtenerVehiculos,
    buscarVehiculo,
    obtenerVehiculosConPagosPendientes
};