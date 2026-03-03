const { z } = require("zod");
const { emailField, passwordField, userNameField } = require("./common");

// Register schema
const registerSchema = z.object({
    username: userNameField,
    email: emailField,
    password: passwordField,
  }).refine((data) => !data.password.includes(data.username), {
    message: "Password cannot contain your username",
    path: ["password"],
  })
  .refine((data) => !data.password.includes(data.email), {
    message: "Password cannot contain your email",
    path: ["password"],
  });

// Login schema
const loginSchema = z.object({
  username: userNameField,
  password: passwordField,
});

// Forgot password
const forgotPasswordSchema = z.object({
  email: emailField,
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
};