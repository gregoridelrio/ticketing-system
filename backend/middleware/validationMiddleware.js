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
    .required()
    .custom((value, helpers) => {
      const errors = [];
      if (value.length < 8) errors.push('La contraseña debe tener al menos 8 caracteres.');
      if (!/[A-Z]/.test(value)) errors.push('La contraseña debe incluir al menos una letra mayúscula.');
      if (!/[a-z]/.test(value)) errors.push('La contraseña debe incluir al menos una letra minúscula.');
      if (!/[0-9]/.test(value)) errors.push('La contraseña debe incluir al menos un número.');

      if (errors.length > 0) {
        return helpers.message(errors.join('||'));
      }
      return value;
    })
    .messages({
      'string.empty': 'La contraseña es obligatoria.'
    }),
  role: Joi.string().valid('USER', 'ADMIN').optional()
});

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      let errorDetails = [];
      
      error.details.forEach((detail) => {
        if (detail.message.includes('||')) {
          errorDetails.push(...detail.message.split('||'));
        } else {
          errorDetails.push(detail.message);
        }
      });

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