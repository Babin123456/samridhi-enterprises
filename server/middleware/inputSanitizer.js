import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

/**
 * XSS and HTML Input Sanitizer Middleware.
 * Recursively strips dangerous HTML tags and script injection characters
 * from user input in req.body, req.query, and req.params.
 */
const sanitizeInput = (val) => {
  if (typeof val === "string") {
    // Strip script tags, html tags, and potentially harmful event handlers
    return val
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/on\w+="[^"]*"/g, "")
      .trim();
  }
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeInput(item));
  }
  if (typeof val === "object" && val !== null) {
    const sanitized = {};
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        sanitized[key] = sanitizeInput(val[key]);
      }
    }
    return sanitized;
  }
  return val;
};

export const inputSanitizer = catchAsyncErrors(async (req, res, next) => {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    req.query = sanitizeInput(req.query);
  }
  if (req.params) {
    req.params = sanitizeInput(req.params);
  }
  next();
});
