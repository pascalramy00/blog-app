export class AuthorNotFoundError extends Error {
  constructor(message: string = "Author not found.") {
    super(message);
    this.name = "AuthorNotFoundError";
  }
}
