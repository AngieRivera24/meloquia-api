// src/validators/user.validator.js
const { body, param } = require('express-validator');

// Validaciones para crear/actualizar usuario
exports.createUserValidator = [
  body('Usuario')
    .trim()
    .notEmpty().withMessage('El campo Usuario es requerido')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),

  body('Correo')
    .trim()
    .notEmpty().withMessage('El campo Correo es requerido')
    .isEmail().withMessage('El formato de correo es inválido'),

  body('contraseña')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres'),

  body('Edad')
    .optional()
    .isInt({ min: 0 }).withMessage('La edad debe ser un número entero positivo'),

  body('Descripcion')
    .optional()
    .isLength({ max: 255 }).withMessage('La descripción no debe exceder 255 caracteres')
];

// Validación para parámetros de ID
exports.idParamValidator = [
  param('id')
    .isInt().withMessage('El id debe ser un número entero')
];
