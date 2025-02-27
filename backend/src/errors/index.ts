export * from "./authorErrors";
export * from "./databaseErrors";
export * from "./postErrors";

export class InputValidationError extends Error {
  constructor(message: string = "Invalid input provided.") {
    super(message);
    this.name = "InputValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Resource not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string = "Database error.") {
    super(message);
    this.name = "DatabaseError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized access.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Forbidden access.") {
    super(message);
    this.name = "ForbiddenError";
  }
}
