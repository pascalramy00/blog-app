export class InputValidationError extends Error {
  constructor(message: string = "Invalid input provided.") {
    super(message);
    this.name = "InputValidationError";
  }
}
