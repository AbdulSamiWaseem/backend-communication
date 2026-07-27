import Joi from "joi";

export function validateLogin(body: any) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validateAsync(body);
}
