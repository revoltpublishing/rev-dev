import * as Joi from "joi";

export const createUserReqSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  mobileRegion: Joi.string().required(),
  role: Joi.string().required(),
  bookId: Joi.string(),
});
