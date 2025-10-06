import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import { ApiResponse } from "../types";

export const handleValidationErrors = (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: "Falha na validação",
      data: errors.array(),
    });
    return;
  }
  next();
};

// Regras de validação de usuário
export const validateCreateUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 1, max: 255 })
    .withMessage("Nome deve ter entre 1 e 255 caracteres"),
  body("email")
    .isEmail()
    .withMessage("Email válido é obrigatório")
    .normalizeEmail(),
  body("avatar").optional().isURL().withMessage("Avatar deve ser uma URL válida"),
  handleValidationErrors,
];

export const validateUpdateUser = [
  param("id").isUUID().withMessage("ID de usuário válido é obrigatório"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Nome não pode estar vazio")
    .isLength({ min: 1, max: 255 })
    .withMessage("Nome deve ter entre 1 e 255 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email válido é obrigatório")
    .normalizeEmail(),
  body("avatar")
    .optional()
    .custom((value) => {
      if (value === "" || value === null || value === undefined) {
        return true; // Permitir valores vazios
      }
      if (!/^https?:\/\/.+/.test(value)) {
        throw new Error("Avatar deve ser uma URL válida");
      }
      return true;
    }),
  handleValidationErrors,
];

// Regras de validação de nota
export const validateCreateNote = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Título é obrigatório")
    .isLength({ min: 1, max: 500 })
    .withMessage("Título deve ter entre 1 e 500 caracteres"),
  body("content").optional().trim(),
  body("tags").isArray().withMessage("Tags devem ser um array"),
  body("tags.*").isString().withMessage("Cada tag deve ser uma string"),
  body("categoryId").custom((value) => {
    if (value === "" || value === null || value === undefined) {
      return true; // Permitir valores vazios
    }
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value
      )
    ) {
      throw new Error("ID de categoria válido é obrigatório");
    }
    return true;
  }),
  body("userId").isUUID().withMessage("ID de usuário válido é obrigatório"),
  body("isFavorite")
    .optional()
    .isBoolean()
    .withMessage("isFavorite deve ser um booleano"),
  handleValidationErrors,
];

export const validateUpdateNote = [
  param("id").isUUID().withMessage("ID de nota válido é obrigatório"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Título não pode estar vazio")
    .isLength({ min: 1, max: 500 })
    .withMessage("Título deve ter entre 1 e 500 caracteres"),
  body("content").optional().trim(),
  body("tags").optional().isArray().withMessage("Tags devem ser um array"),
  body("tags.*").isString().withMessage("Cada tag deve ser uma string"),
  body("categoryId")
    .optional()
    .isUUID()
    .withMessage("ID de categoria válido é obrigatório"),
  body("isFavorite")
    .optional()
    .isBoolean()
    .withMessage("isFavorite deve ser um booleano"),
  handleValidationErrors,
];

// Regras de validação de categoria
export const validateCreateCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Nome é obrigatório")
    .isLength({ min: 1, max: 255 })
    .withMessage("Nome deve ter entre 1 e 255 caracteres"),
  body("color")
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Cor deve ser um código hexadecimal válido"),
  body("userId").isUUID().withMessage("ID de usuário válido é obrigatório"),
  handleValidationErrors,
];

// Regras de validação comuns
export const validateId = [
  param("id").isUUID().withMessage("ID válido é obrigatório"),
  handleValidationErrors,
];

export const validateUserId = [
  param("userId").isUUID().withMessage("ID de usuário válido é obrigatório"),
  handleValidationErrors,
];
