import { Request, Response } from "express";
import {
  createNewCategory,
  fetchAllCategories,
} from "../services/category.services";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const newCategory = await createNewCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    throw error;
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const allCategories = await fetchAllCategories();
    res.status(200).json(allCategories);
  } catch (error) {
    throw error;
  }
};
