import { parse } from "@microframework/parser"
import { generateSwaggerDocumentation } from "@microframework/node/_/swagger-generator"

describe("swagger > generate documentation", () => {
  test("actions defined with a referenced types", () => {
    const appMetadata = parse(__dirname + "/model-app.ts")
    const swaggerOutput = generateSwaggerDocumentation(appMetadata)
    // console.log(JSON.stringify(swaggerOutput.definitions, undefined, 2))
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
                  $ref: "#/definitions/Category",
                },
              },
            },
            summary: "Saves a category.",
          },
        },
        "/api/category/:id": {
          delete: {
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
                    success: {
                      type: "boolean",
                    },
                  },
                  required: ["success"],
                  type: "object",
                },
              },
            },
            summary: "Removes a category.",
          },
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
                  $ref: "#/definitions/Category",
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