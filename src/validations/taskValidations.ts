import Joi from "joi";

const schemaCreateTask = Joi.object({
  title: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "Title can only contain letters and spaces.",
      "string.empty": "Title is required.",
      "any.required": "Title is required.",
    }),

  description: Joi.string()
    .pattern(/^[A-Za-z\s]+$/)
    .required()
    .messages({
      "string.pattern.base": "Description can only contain letters and spaces.",
      "string.empty": "Description is required.",
      "any.required": "Description is required.",
    }),

  projectId: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "Project ID contains invalid characters.",
      "string.empty": "Project ID is required.",
      "any.required": "Project ID is required.",
    }),

  assigneeId: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "Assignee ID contains invalid characters.",
      "string.empty": "Assignee ID is required.",
      "any.required": "Assignee ID is required.",
    }),
});

const schemaUpdateTask = Joi.object({
  id: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "Task ID contains invalid characters.",
      "string.empty": "Task ID is required.",
      "any.required": "Task ID is required.",
    }),

  status: Joi.string()
    .pattern(/^[A-Za-z-]+$/)
    .required()
    .messages({
      "string.pattern.base": "Status can only contain letters and dashes (-).",
      "string.empty": "Status is required.",
      "any.required": "Status is required.",
    }),

  projectId: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "Project ID contains invalid characters.",
      "string.empty": "Project ID is required.",
      "any.required": "Project ID is required.",
    }),

  assigneeId: Joi.string()
    .pattern(/^[A-Za-z0-9\-.,]+$/)
    .required()
    .messages({
      "string.pattern.base": "Assignee ID contains invalid characters.",
      "string.empty": "Assignee ID is required.",
      "any.required": "Assignee ID is required.",
    }),
});

export default { schemaCreateTask, schemaUpdateTask };
