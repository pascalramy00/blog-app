export class InvalidCredentialsError extends Error {
  constructor(message: string = "Invalid credentials.") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class InvalidTokenError extends Error {
  constructor(message: string = "Invalid token.") {
    super(message);
    this.name = "InvalidTokenError";
  }
}

export class MissingTokenError extends Error {
  constructor(message: string = "Missing token.") {
    super(message);
    this.name = "MissingTokenError";
  }
}
