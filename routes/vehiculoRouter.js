const vehiculoController = require('../controllers/vehiculoController.js')

const router = require('express').Router()

router.post('/', vehiculoController.agregarVehiculo)
router.put('/', vehiculoController.actualizarVehiculo)
router.get('/', vehiculoController.obtenerVehiculos)
router.post('/buscar', vehiculoController.buscarVehiculo)
router.get('/pagos-pendientes', vehiculoController.obtenerVehiculosConPagosPendientes)

module.exports = router