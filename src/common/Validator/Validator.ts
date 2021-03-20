import Joi from '@hapi/joi';
import { ServerError } from '../Error';

export const checkValidation = (content: any, validationSchema: Joi.ObjectSchema) => {
  const { error } = validationSchema.validate(content);

  if (error) {
    throw new ServerError(error.details[0].message, 400);
  }
};
