import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // STAGE: Joi.string().required(),
  DB_CONNECTION: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
