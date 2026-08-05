const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'El nombre es obligatorio.',
    'string.min': 'El nombre debe tener al menos 2 caracteres.',
    'string.max': 'El nombre no puede exceder los 50 caracteres.'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'El correo electrónico es obligatorio.',
    'string.email': 'El correo electrónico debe ser válido.'
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])'))
    .required()
    .messages({
      'string.empty': 'La contraseña es obligatoria.',
      'string.min': 'La contraseña debe tener al menos 8 caracteres.',
      'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.'
    }),
  role: Joi.string().valid('USER', 'ADMIN').optional()
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).json({ 
        message: 'Error de validación de datos', 
        errors: errorDetails 
      });
    }

    next();
  };
};

module.exports = {
  validateRegister: validate(registerSchema)
};