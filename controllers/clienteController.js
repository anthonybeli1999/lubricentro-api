const { Op } = require('sequelize')
const db = require('../models')
const { validationResult } = require('express-validator')

const Cliente = db.clientes
const Vehiculo = db.vehiculos
const sequelize = db.sequelize

const agregarCliente = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    let t;
    try {
        t = await sequelize.transaction();
        const lastClient = await Cliente.findOne({
            order: [['id', 'DESC']],
            transaction: t
        });
        const nextClientId = lastClient ? lastClient.id + 1 : 1;
        let info = {
            id: nextClientId,
            Documento: req.body.Documento,
            Nombre: req.body.Nombre,
            Celular: req.body.Celular,
            Correo: req.body.Correo
        }
        const cliente = await Cliente.create(info, { transaction: t });
        await t.commit();
        return res.status(200).send(cliente);
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al crear el cliente", error: error.message });
    }
};

const actualizarCliente = async (req, res) => {
    let t;
    try {
        t = await sequelize.transaction();
        let id = req.body.id
        const cliente = await Cliente.update(req.body, {where: { id: id }})
        await t.commit()
        res.status(200).send(cliente)
    } catch (error) {
        if (t) await t.rollback();
        return res.status(500).send({ message: "Error al modificar el cliente", error: error.message });
    }
};

const obtenerClientes =async (req, res) => {
    try {
        let clientes = await Cliente.findAll({
            attributes: [
                'id',
                'Documento',
                'Nombre',
                'Celular',
                'Correo'
            ],
            include: [{
                model: Vehiculo,
                as: 'vehiculos',
                attributes: ['id', 'Placa', 'Tipo', 'Marca', 'Modelo', 'Anio',]
            }]
        })
        res.status(200).send(clientes)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los clientes", error: error.message }
        )
    }
};

const buscarCliente =async (req, res) => {
    let parametro = req.body.Parametro
    try {
        let clientes = await Cliente.findAll({
            where: {
                [Op.or]: [
                    {
                        Documento: {
                            [Op.like]: `%${parametro}%`
                        }
                    },
                    {
                        Nombre: {
                            [Op.like]: `%${parametro}%`
                        }
                    }
                ]
            },
            attributes: [
                'id',
                'Documento',
                'Nombre',
                'Celular',
                'Correo'
            ],
            include: [{
                model: Vehiculo,
                as: 'vehiculos',
                attributes: ['id', 'Placa', 'Tipo', 'Marca', 'Modelo', 'Anio',]
            }]
        })
        res.status(200).send(clientes)
    } catch (error) {
        return res.status(500).send(
            { message: "Error al obtener los clientes", error: error.message }
        )
    }
};

module.exports = {
    agregarCliente,
    actualizarCliente,
    obtenerClientes,
    buscarCliente
}