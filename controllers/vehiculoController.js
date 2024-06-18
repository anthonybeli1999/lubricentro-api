const { Op, where } = require('sequelize')
const db = require('../models')
const { validationResult } = require('express-validator')

const Vehiculo = db.vehiculos
const Modelo = db.modelos
const Marca = db.marcas
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
            modeloId: req.body.modeloId,
            Anio: req.body.Anio,
            Tipo: req.body.Tipo,
            Cliente: req.body.Cliente,
            Celular: req.body.Celular,
            Fecha: req.body.Fecha,
            Estado: 'A'
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

const eliminarVehiculo = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();
        let id = req.body.id
        const vehiculo = await Vehiculo.update({Estado: 'I'}, {where: { id: id }})
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
                'Anio',
                'Tipo',
                'Cliente',
                'Celular',
                [sequelize.literal('DATE_FORMAT(Vehiculo.Fecha, "%Y-%m-%d")'), 'Fecha'],
                [sequelize.literal('DATE_FORMAT(Vehiculo.Fecha, "%d/%m/%Y")'), 'FechaFormateada'],
                [
                    sequelize.literal(`IF(
                        EXISTS (
                            SELECT 1 FROM Servicios s
                            WHERE s.VehiculoId = Vehiculo.id
                            AND s.EstadoPago = 'D'
                            AND s.Estado = 'A'
                        ),
                        'Si',
                        'No'
                    )`),
                    'TieneDeudas'
                ]
            ],
            include: [{
                model: Modelo,
                as: 'modelo',
                attributes: ['id', 'Nombre'],
                include: {
                    model: Marca,
                    as: 'marca',
                    attributes: ['id', 'Nombre']
                }
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
            }
            ],
            where: {
                Estado: 'A'
            }
        })
        res.status(200).send(vehiculos)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los vehiculos", error: error.message }
        )
    }
}

const buscarVehiculo = async (req, res) => {
    let parametro = req.body.Parametro
    try {
        let vehiculos = await Vehiculo.findAll({
            attributes: [
                'id',
                'Placa',
                'Anio',
                'Tipo',
                'Cliente',
                'Celular',
                [sequelize.literal('DATE_FORMAT(Fecha, "%Y-%m-%d")'), 'Fecha'],
                [sequelize.literal('DATE_FORMAT(Fecha, "%d/%m/%Y")'), 'FechaFormateada'],
                [
                    sequelize.literal(`IF(
                        EXISTS (
                            SELECT 1 FROM Servicios s
                            WHERE s.VehiculoId = Vehiculo.id
                            AND s.EstadoPago = 'D'
                            AND s.Estado = 'A'
                        ),
                        'Si',
                        'No'
                    )`),
                    'TieneDeudas'
                ]
            ],
            include: [{
                model: Modelo,
                as: 'modelo',
                attributes: ['id', 'Nombre'],
                include: {
                    model: Marca,
                    as: 'marca',
                    attributes: ['id', 'Nombre']
                }
            }],
            where: {
                Estado: 'A',
                [Op.or]: [
                    {
                        Placa: {
                            [Op.like]: `%${parametro}%`
                        }
                    },
                    sequelize.where(
                        sequelize.fn('DATE', sequelize.col('Fecha')),
                        'LIKE',
                        `%${parametro}%`
                    ),
                    {
                        '$modelo.marca.Nombre$': {
                            [Op.like]: `%${parametro}%`
                        }
                    },
                    {
                        Cliente: {
                            [Op.like]: `%${parametro}%`
                        }
                    },
                ]
            }
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
                'Anio',
                'Tipo',
                'Cliente',
                'Celular',
                [sequelize.literal('DATE_FORMAT(Vehiculo.Fecha, "%Y-%m-%d")'), 'FechaEditable'],
                [sequelize.literal('DATE_FORMAT(Vehiculo.Fecha, "%d/%m/%Y")'), 'FechaFormateada'],
            ],
            include: [{
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
                    EstadoPago: 'D',
                    Estado: 'A',
                    '$servicios.Estado$': 'A'
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
    obtenerVehiculosConPagosPendientes,
    eliminarVehiculo
};