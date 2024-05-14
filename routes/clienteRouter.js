const clienteController = require('../controllers/clienteController.js')

const router = require('express').Router()

router.post('/', clienteController.agregarCliente)
router.put('/', clienteController.actualizarCliente)
router.get('/', clienteController.obtenerClientes)
router.post('/buscar', clienteController.buscarCliente)

module.exports = router