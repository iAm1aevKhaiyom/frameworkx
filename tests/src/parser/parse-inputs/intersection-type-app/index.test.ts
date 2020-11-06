import { parse } from "@microframework/parser"

describe("parse inputs > intersection type app", () => {
  test("input defined as a intersection type", () => {
    const result = parse(__dirname + "/intersection-type-app.ts")
    // console.log(JSON.stringify(result, undefined, 2))
    expect(result).toEqual({
      "@type": "ApplicationTypeMetadata",
      name: "App",
      description: "",
      actions: [],
      models: [
        {
          "@type": "TypeMetadata",
          kind: "object",
          array: false,
          nullable: false,
          canBeUndefined: false,
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "id",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "name",
            },
          ],
          modelName: "PostModel",
          description: "Type for a PostModel.",
        },
      ],
      inputs: [
        {
          "@type": "TypeMetadata",
          kind: "object",
          array: false,
          nullable: false,
          canBeUndefined: false,
          properties: [
            {
              "@type": "TypeMetadata",
              kind: "number",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "id",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "name",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "aboutMe",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "photoUrl",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "degree",
            },
            {
              "@type": "TypeMetadata",
              kind: "boolean",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "graduated",
            },
            {
              "@type": "TypeMetadata",
              kind: "string",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "workingPlace",
            },
            {
              "@type": "TypeMetadata",
              kind: "boolean",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "seekingForJob",
            },
            {
              "@type": "TypeMetadata",
              kind: "boolean",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "english",
            },
            {
              "@type": "TypeMetadata",
              kind: "boolean",
              array: false,
              nullable: false,
              canBeUndefined: false,
              properties: [],
              propertyName: "tajik",
            },
          ],
          typeName: "PersonIntersectionInputType",
          description: "This way we are testing intersection type.",
        },
      ],
      queries: [],
      mutations: [],
      subscriptions: [],
    })
  })
})