import { Request, Response } from "express";
import { InputValidationError } from "../errors";
import {
  createCategory,
  getAllCategories,
} from "../services/category.services";

export const createCategoryHandler = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, slug } = req.body;

  try {
    if (!name || !slug) {
      throw new InputValidationError("Name and slug are required.");
    }
    const newCategory = await createCategory(name, slug);
    res.status(201).json(newCategory);
  } catch (error) {
    throw error;
  }
};

export const getAllCategoriesHandler = async (req: Request, res: Response) => {
  try {
    const allCategories = await getAllCategories();
    res.status(200).json(allCategories);
  } catch (error) {
    throw error;
  }
};
