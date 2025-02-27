export class DuplicateCategoryError extends Error {
  constructor(message: string = "This category already exists.") {
    super(message);
    this.name = "DuplicateCategoryError";
  }
}
