const { check } = require('express-validator');

const addProductValidationRules = [
    check('title').notEmpty().withMessage('El título es requerido'),
    check('price').isFloat().withMessage('El precio debe ser un número válido'),
    check('description').notEmpty().withMessage('La descripción es requerida'),
];

module.exports = {
    addProductValidationRules,
};
