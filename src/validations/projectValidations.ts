import Joi from "joi";

const schemaCreateProject = Joi.object({
  nameProject: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "Project name contains invalid characters.",
      "string.empty": "Project name is required.",
      "any.required": "Project name is required.",
    }),

  email: Joi.string().email().required(),
});

const schemaDeleteProject = Joi.object({
  id: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "Project ID contains invalid characters.",
      "string.empty": "Project ID is required.",
      "any.required": "Project ID is required.",
    }),
  email: Joi.string().email().required(),
});

const schemaAllProject = Joi.object({
  userId: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "User ID contains invalid characters.",
      "string.empty": "User ID is required.",
      "any.required": "User ID is required.",
    }),
});

const schemaDetailProject = Joi.object({
  id: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "ID contains invalid characters.",
      "string.empty": "ID is required.",
      "any.required": "ID is required.",
    }),
});

const schemaAllProjectByEmail = Joi.object({
  email: Joi.string().email().required(),
});

export default {
  schemaCreateProject,
  schemaDeleteProject,
  schemaAllProject,
  schemaDetailProject,
  schemaAllProjectByEmail,
};
