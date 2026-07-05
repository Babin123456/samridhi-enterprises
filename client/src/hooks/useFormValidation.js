import { useState, useCallback } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validationRules = {
  required: (msg) => (v) => (v && String(v).trim() ? "" : msg || "This field is required"),
  email: () => (v) => (!v || EMAIL_REGEX.test(v) ? "" : "Please enter a valid email address"),
  minLength: (min) => (v) => (!v || v.length >= min ? "" : `Minimum ${min} characters`),
  match: (otherLabel) => (v, values) => (v === values.confirmPassword ? "" : `Must match ${otherLabel}`),
  otp: () => (v) => (!v || /^\d{6}$/.test(v) ? "" : "OTP must be exactly 6 digits"),
};

export default function useFormValidation(fields) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value, allValues) => {
    const field = fields[name];
    if (!field) return "";
    for (const rule of field.rules) {
      const error = typeof rule === "function" ? rule(value, allValues) : "";
      if (error) return error;
    }
    return "";
  }, [fields]);

  const validate = useCallback((values) => {
    const newErrors = {};
    let isValid = true;
    for (const name of Object.keys(fields)) {
      const error = validateField(name, values[name], values);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    }
    setErrors(newErrors);
    setTouched(Object.keys(fields).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  }, [fields, validateField]);

  const handleBlur = useCallback((name, value, allValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, allValues) }));
  }, [validateField]);

  const handleChange = useCallback((name, value, allValues) => {
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value, allValues) }));
    }
  }, [touched, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return { errors, touched, validate, handleBlur, handleChange, clearErrors };
}
