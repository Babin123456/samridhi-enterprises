import ErrorHandler from "../utils/errorHandler.js";
export const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions || !req.user.permissions.includes(requiredPermission)) {
      return next(new ErrorHandler(`Access denied. Missing permission: ${requiredPermission}`, 403));
    }
    next();
  };
};
