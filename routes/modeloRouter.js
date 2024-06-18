const modeloController = require('../controllers/modeloController.js')

const router = require('express').Router()

router.post('/', modeloController.agregarModelo)
router.put('/', modeloController.actualizarModelo)
router.get('/', modeloController.obtenerModelos)
router.post('/obtener-por-marca', modeloController.obtenerModelosPorMarca)
router.post('/buscar', modeloController.buscarModelo)
router.put('/eliminar', modeloController.actualizarModelo)

module.exports = router