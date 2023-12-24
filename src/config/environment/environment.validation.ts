import * as Joi from 'joi'

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production'),
  PORT: Joi.number().default(8000),
  HOST_NAME: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
})
