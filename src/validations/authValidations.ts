import Joi from "joi";
const schemaRegister = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(30).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).max(30).required(),
});

export default { schemaRegister, schemaLogin };
