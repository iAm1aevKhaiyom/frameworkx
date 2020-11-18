import { parse } from "@microframework/parser"
import { generateSwaggerDocumentation } from "@microframework/node/_/swagger-generator"

describe("swagger > generate documentation", () => {
  test("actions defined with a literal types", () => {
    const appMetadata = parse(__dirname + "/literal-app.ts")
    const swaggerOutput = generateSwaggerDocumentation(appMetadata)
    expect(swaggerOutput).toStrictEqual({
      consumes: ["application/json"],
      definitions: {},
      info: {
        description: "",
        title: "App",
      },
      paths: {
        "/api/category": {
          post: {
            parameters: [
              {
                description: "Category id.",
                in: "body",
                name: "id",
                required: false,
                type: "number",
              },
              {
                description: "Category name.",
                in: "body",
                name: "name",
                required: false,
                type: "string",
              },
            ],
            responses: {
              "200": {
                description: "",
                schema: {
                  properties: {
                    id: {
                      type: "integer",
                    },
                    title: {
                      type: "string",
                    },
                  },
                  required: ["id", "title"],
                  type: "object",
                },
              },
            },
            summary: "Saves a category.",
          },
        },
        "/api/category/:id": {
          get: {
            parameters: [
              {
                description: "Category id.",
                in: "path",
                name: "id",
                required: true,
                type: "number",
              },
            ],
            responses: {
              "200": {
                description: "",
                schema: {
                  properties: {
                    id: {
                      type: "integer",
                    },
                    name: {
                      type: "string",
                    },
                    posts: {
                      items: {
                        properties: {
                          categoryCount: {
                            type: "integer",
                          },
                          id: {
                            type: "integer",
                          },
                          status: {
                            type: "object",
                          },
                          title: {
                            type: "string",
                          },
                        },
                        required: ["id", "title", "categoryCount", "status"],
                        type: "object",
                      },
                      type: "array",
                    },
                  },
                  required: ["id"],
                  type: "object",
                },
              },
            },
            summary: "Loads a single category by its id.",
          },
        },
      },
      produces: ["application/json"],
      swagger: "2.0",
    })
  })
})