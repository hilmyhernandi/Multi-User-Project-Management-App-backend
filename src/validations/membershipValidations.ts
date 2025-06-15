import Joi from "joi";

const schemaMembership = Joi.object({
  userId: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "User ID contains invalid characters.",
      "string.empty": "User ID is required.",
      "any.required": "User ID is required.",
    }),

  projectId: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "Project ID contains invalid characters.",
      "string.empty": "Project ID is required.",
      "any.required": "Project ID is required.",
    }),
});

export default { schemaMembership };
