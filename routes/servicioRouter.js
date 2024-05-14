const servicioController = require('../controllers/servicioController.js')

const router = require('express').Router()

router.post('/', servicioController.agregarServicio)
router.put('/', servicioController.actualizarServicio)
router.get('/', servicioController.obtenerServicios)
router.post('/buscar', servicioController.buscarServicios)

module.exports = router