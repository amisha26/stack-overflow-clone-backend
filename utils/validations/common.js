const { z } = require("zod");

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email format");

const passwordField = z
  .string()
  .min(4, "Password must be at least 4 characters")
  .max(100)
  .regex(/[a-z]/, "Password must contain one lowercase letter")
  .regex(/[0-9]/, "Password must contain one number");

const userNameField = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(50);


const textField = z
  .string()
  .trim()
  .min(2, "Field must contain at least 2 characters")
  .max(50);


module.exports = {
  emailField,
  passwordField,
  userNameField,
  textField
};