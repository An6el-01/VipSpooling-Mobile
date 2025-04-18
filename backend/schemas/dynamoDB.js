const Joi = require('joi');

const InvoiceFormSchema = Joi.object({
    WorkTicketID: Joi.string().required(),
    CableCompanyLocation: Joi.string().optional(),
    Consumables: Joi.array().items(Joi.object({
        amount: Joi.number().required(),
        item: Joi.string().required(),
        qty: Joi.number().required(), 
        rate: Joi.number().required()
    })).optional(),
    createdAt: Joi.string().optional(),
    CustomerSignature: Joi.string().optional(),
    InvoiceDate: Joi.string().optional(),
    InvoiceTotal: Joi.number().optional(),
    JobType: Joi.array().items(Joi.string()).optional(),
    LaborCosts: Joi.array().items(Joi.object({
        amount: Joi.number().required(),
        qty: Joi.number().required(),
        rate: Joi.number().required(),
    })).optional(),
    OilCompany: Joi.string().optional(),
    ReelNumber: Joi.string().optional(),
    Spooler: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    WellNumberName: Joi.string().optional(),
    WorkType: Joi.string().optional(),
    _lastChangedAt: Joi.string().optional(),
    _version: Joi.number().optional(),
    _typename: Joi.string().optional(),
});

const JSAFormSchema = Joi.object({
    CustomerName: Joi.string().required(),
    createdAt: Joi.string().optional(),
    EffectiveDate: Joi.string().optional(),
    FormDate: Joi.string().optional(),
    Location: Joi.string().optional(),
    Personnel: Joi.array().items(Joi.object({
        PersonName: Joi.string().required(),
        Role: Joi.string().required(),
        Signature: Joi.string().optional()
    })).optional(),
    updatedAt: Joi.string().optional(),
    _lastChangedAt: Joi.number().optional(),
    _version: Joi.number().optional(),
    _typename: Joi.string().optional(),
});

module.exports = {
    InvoiceFormSchema,
    JSAFormSchema,
};