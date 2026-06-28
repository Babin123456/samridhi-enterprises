import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    const dataToValidate = {};
    if (schema.shape.body) dataToValidate.body = req.body;
    if (schema.shape.query) dataToValidate.query = req.query;
    if (schema.shape.params) dataToValidate.params = req.params;

    const parsed = schema.parse(dataToValidate);

    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.query = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;

    next();
  } catch (error) {
    next(error);
  }
};
