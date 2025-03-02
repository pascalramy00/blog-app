import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password: string, hash: string) => {
  console.log("Comparing passwords...");
  return await bcrypt.compare(password, hash);
};
