import { hasKey } from "./typeNarrower";

export class HttpError extends Error {
  statusCode!: number;

  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
  }

  public override toString() {
    return `Error ${this.statusCode}: ${this.name} --- ${this.message}`;
  }
}

export const generateHttpError = (type: HttpErrorType, message?: string) => {
  let msg: string, statusCode: number;

  switch (type) {
    case "Bad Request":
      msg = "Request data is invalid!";
      statusCode = 400;
      break;
    case "Unauthorized":
      msg = "User is unauthenticated!";
      statusCode = 401;
      break;
    case "Forbidden":
      msg = "User access is forbidden!";
      statusCode = 403;
      break;
    case "Not Found":
      msg = "Requested resource not found!";
      statusCode = 404;
      break;
    case "Conflict":
      msg = "Request conflicts with current database state!";
      statusCode = 409;
      break;
    case "Internal":
      msg = "Something Broke!";
      statusCode = 500;
      break;
  }

  return new HttpError(type, message ?? msg, statusCode);
};

export const isHttpError = (err: any): err is HttpError =>
  hasKey(err, "statusCode") && typeof err.statusCode === "number";
