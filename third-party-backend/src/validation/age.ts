import Joi from "joi";

export function validateAgeQuery(query: any) {
  const schema = Joi.object({
    dob: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    mode: Joi.string().valid("callback", "polling", "webhook", "mqtt").optional(),
    callbackUrl: Joi.string().uri().optional(),
  });
  return schema.validateAsync(query);
}
