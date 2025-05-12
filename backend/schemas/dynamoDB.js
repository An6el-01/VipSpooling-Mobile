const Joi = require('joi');

const InvoiceFormSchema = Joi.object({
    WorkTicketID: Joi.string().required(),
    CableCompanyLocation: Joi.string().optional(),
    CableCompany: Joi.string().optional(),
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
        type: Joi.string().required(),
    })).optional(),
    OilCompany: Joi.string().optional(),
    ReelNumber: Joi.string().optional(),
    Spooler: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    WellNumberName: Joi.string().optional(),    
    WellNumber:Joi.number().optional(),
    Notes: Joi.string().optional(),
    CableLength: Joi.number().optional(),
    CableType: Joi.string().optional(),
    ExtraCharges: Joi.number().optional(),
    WorkType: Joi.string().optional(),
    _lastChangedAt: Joi.string().optional(),
    _version: Joi.number().optional(),
    _typename: Joi.string().optional(),
});

const JSAFormSchema = Joi.object({
    WorkTicketID: Joi.string().required(),
    CustomerName: Joi.string().required(),
    createdAt: Joi.string().optional(),
    EffectiveDate: Joi.string().optional(),
    FormDate: Joi.string().optional(),
    Location: Joi.string().optional(),
    Steps: Joi.array().items(Joi.object({
        step: Joi.string().required(),
        safetyEnvironmental: Joi.string().required(),
        controls: Joi.string().required(), 
        ppe: Joi.string().required(),
        risk: Joi.string().required(), 
        notes: Joi.string().required(),
    })).optional(),
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


const CapillaryFormSchema = Joi.object({
    WorkTicketID: Joi.string().required(),
    Date: Joi.string().required(),
    Customer: Joi.string().required(),
    WellName: Joi.string().optional(),
    TypeOfJob: Joi.string().optional(),
    VisualConfirmation: Joi.string().optional(),
    IntervalPumping: Joi.string().optional(),
    PressureWhilePumping: Joi.string().optional(),
    PressureBleed: Joi.string().optional(),
    CapillaryFlush: Joi.string().optional(),
    ManifoldStatus: Joi.string().optional(),
    LineTest: Joi.string().optional(),
    CapillarySize: Joi.string().optional(),
    Metallurgy: Joi.string().optional(),
    Length: Joi.string().optional(),
    FluidPumped: Joi.string().optional(),
    TotalGallons: Joi.string().optional(),
    Notes: Joi.string().optional(),
    Files: Joi.array().items(Joi.string()).optional(),
    FinalProductFile: Joi.string().optional(),
    TechnicianName: Joi.string().optional(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    _lastChangedAt: Joi.number().optional(),
    _ttl: Joi.number().optional(),
    _version: Joi.number().optional(),
    __typename: Joi.string().optional(),
    _deleted: Joi.boolean().optional(),
});

module.exports = {
    InvoiceFormSchema,
    JSAFormSchema,
    CapillaryFormSchema
};