import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dynamic Personal Content Management System API",
      version: "1.0.0",
      description: `
        A comprehensive REST API for managing personal content including users, notes, tags, and categories.
        Built with TypeScript, Express.js, PostgreSQL, and Prisma ORM.
      `,
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: process.env["FRONTEND_URL"] || "http://localhost:3001",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["id", "name", "email", "createdAt", "updatedAt"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the user",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            avatar: {
              type: "string",
              format: "uri",
              nullable: true,
              description: "URL to user's avatar image",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when user was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when user was last updated",
            },
          },
        },
        Note: {
          type: "object",
          required: [
            "id",
            "title",
            "content",
            "tags",
            "category",
            "userId",
            "isFavorite",
            "createdAt",
            "updatedAt",
          ],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the note",
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 500,
              description: "Note title",
            },
            content: {
              type: "string",
              description: "Note content",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of tag names associated with the note",
            },
            category: {
              type: "string",
              description: "Category name for the note",
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID of the user who owns the note",
            },
            isFavorite: {
              type: "boolean",
              description: "Whether the note is marked as favorite",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when note was created",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Timestamp when note was last updated",
            },
          },
        },
        Tag: {
          type: "object",
          required: ["id", "name", "color", "count"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the tag",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Tag name",
            },
            color: {
              type: "string",
              pattern: "^#[0-9A-Fa-f]{6}$",
              description: "Hex color code for the tag",
            },
            count: {
              type: "integer",
              minimum: 0,
              description: "Number of times this tag is used",
            },
          },
        },
        Category: {
          type: "object",
          required: ["id", "name", "color", "icon"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the category",
            },
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Category name",
            },
            color: {
              type: "string",
              pattern: "^#[0-9A-Fa-f]{6}$",
              description: "Hex color code for the category",
            },
            icon: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              description: "Icon identifier for the category",
            },
          },
        },
        CreateUserInput: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "User's full name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            avatar: {
              type: "string",
              format: "uri",
              description: "URL to user's avatar image",
            },
          },
        },
        CreateNoteInput: {
          type: "object",
          required: ["title", "content", "tags", "category", "userId"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 500,
              description: "Note title",
            },
            content: {
              type: "string",
              description: "Note content",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of tag names",
            },
            category: {
              type: "string",
              description: "Category name",
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID of the user who owns the note",
            },
            isFavorite: {
              type: "boolean",
              default: false,
              description: "Whether the note is marked as favorite",
            },
          },
        },
        CreateTagInput: {
          type: "object",
          required: ["name", "color"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Tag name",
            },
            color: {
              type: "string",
              pattern: "^#[0-9A-Fa-f]{6}$",
              description: "Hex color code for the tag",
            },
            count: {
              type: "integer",
              minimum: 0,
              default: 0,
              description: "Initial count for the tag",
            },
          },
        },
        CreateCategoryInput: {
          type: "object",
          required: ["name", "color", "icon"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Category name",
            },
            color: {
              type: "string",
              pattern: "^#[0-9A-Fa-f]{6}$",
              description: "Hex color code for the category",
            },
            icon: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              description: "Icon identifier for the category",
            },
          },
        },
        ApiResponse: {
          type: "object",
          required: ["success"],
          properties: {
            success: {
              type: "boolean",
              description: "Indicates if the request was successful",
            },
            data: {
              description: "Response data (varies by endpoint)",
            },
            error: {
              type: "string",
              description: "Error message if request failed",
            },
            message: {
              type: "string",
              description: "Additional message about the operation",
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "string",
              example: "Validation failed",
            },
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  value: { type: "string" },
                  msg: { type: "string" },
                  path: { type: "string" },
                  location: { type: "string" },
                },
              },
            },
          },
        },
      },
      responses: {
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationError",
              },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Resource not found",
                  },
                },
              },
            },
          },
        },
        Conflict: {
          description: "Resource already exists",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Resource already exists",
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  error: {
                    type: "string",
                    example: "Internal Server Error",
                  },
                },
              },
            },
          },
        },
      },
      parameters: {
        IdParam: {
          name: "id",
          in: "path",
          required: true,
          description: "Resource ID",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        UserIdParam: {
          name: "userId",
          in: "path",
          required: true,
          description: "User ID",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
      },
    },
    tags: [
      {
        name: "Health",
        description: "Health check endpoints",
      },
      {
        name: "Users",
        description: "User management operations",
      },
      {
        name: "Notes",
        description: "Note management operations",
      },
      {
        name: "Tags",
        description: "Tag management operations",
      },
      {
        name: "Categories",
        description: "Category management operations",
      },
    ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/server.ts",
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
    customSiteTitle: "DPCMS API Documentation",
  }));

  // JSON endpoint for the swagger spec
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });
};

export default specs;
