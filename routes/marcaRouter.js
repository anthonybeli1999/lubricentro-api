const marcaController = require('../controllers/marcaController.js')

const router = require('express').Router()

router.post('/', marcaController.agregarMarca)
router.put('/', marcaController.actualizarMarca)
router.get('/', marcaController.obtenerMarcas)
router.post('/buscar', marcaController.buscarMarca)
router.put('/eliminar', marcaController.eliminarMarca)

module.exports = router