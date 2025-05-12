const Joi = require('joi');

const verifyPasswordSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.empty': 'Email is required',
            'any.required': 'Email is required'
        })
});

module.exports = verifyPasswordSchema; 