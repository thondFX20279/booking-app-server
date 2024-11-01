import createError from "../utils/createError";
export const notFound = (req, res, next) => {
  return next(createError(404, "Page Not Found"));
};

export const handleError = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).send({
    success: false,
    status: error.status,
    message: message,
    stack: error.stack,
  });
};
