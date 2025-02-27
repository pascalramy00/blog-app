export class PostNotFoundError extends Error {
  constructor(message: string = "Post not found.") {
    super(message);
    this.name = "PostNotFoundError";
  }
}

export class InvalidCategoryIdsError extends Error {
  constructor(message: string = "Invalid category IDs.") {
    super(message);
    this.name = "InvalidCategoryIdsError";
  }
}
