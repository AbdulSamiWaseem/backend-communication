import Joi from "joi";

export function validateAgeQuery(query: any) {
  const schema = Joi.object({
    dob: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    mode: Joi.string().valid("callback", "polling", "webhook", "mqtt").optional(),
  });
  return schema.validateAsync(query);
}

export function validateAgeCallback(data: any) {
  const schema = Joi.object({
    jobId: Joi.string().required(),
    dob: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    age: Joi.number().integer().min(0).required(),
  });
  return schema.validateAsync(data);
}
