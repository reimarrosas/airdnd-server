import type { ErrorRequestHandler, RequestHandler } from "express";

import { generateHttpError, isHttpError } from "../utilities/httpErrors";

export const notFound: RequestHandler = (req, _res, next) => {
  next(generateHttpError("Not Found", `${req.originalUrl} Not Found!`));
};

export const error: ErrorRequestHandler = (err, _req, res, _next) => {
  // const logContents = {err};
  const error = isHttpError(err) ? err : generateHttpError("Internal");

  console.log(err);

  const response: HttpResponseMessage = {
    message: error.message,
    success: false,
  };

  res.status(error.statusCode).send(response);
};
