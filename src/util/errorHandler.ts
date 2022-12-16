export class CatError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends CatError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class BadRequestError extends CatError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class MissingEnvError extends CatError {
  constructor() {
    super("Missing environment variable.", 500);
  }
}

export class DbError extends CatError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class HelperError extends CatError {
  constructor(message: string) {
    super(message, 500);
  }
}

export class RouteError extends CatError {
  constructor(message: string) {
    super(message, 500);
  }
}
