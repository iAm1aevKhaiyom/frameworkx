import { parse } from "@microframework/parser"

describe("parse queries and mutations > intersection query type app", () => {
  test("query type defined as intersection type", () => {
    const result = parse(__dirname + "/intersection-query-type-app.ts")
    expect(result).toEqual({
      "@type": "ApplicationTypeMetadata",
      actions: [],
      description: "",
      inputs: [],
      models: [],
      mutations: [],
      name: "App",
      queries: [
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "post",
          propertyPath: "post",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "object",
            nullable: false,
            properties: [
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "post.Return.id",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "string",
                nullable: false,
                properties: [],
                propertyName: "title",
                propertyPath: "post.Return.title",
              },
            ],
            propertyPath: "post.Return",
          },
        },
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "post2",
          propertyPath: "post2",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "object",
            nullable: false,
            properties: [
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "post2.Return.id",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "string",
                nullable: false,
                properties: [],
                propertyName: "name",
                propertyPath: "post2.Return.name",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "string",
                nullable: false,
                properties: [],
                propertyName: "title",
                propertyPath: "post2.Return.title",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "string",
                nullable: false,
                properties: [],
                propertyName: "text",
                propertyPath: "post2.Return.text",
              },
            ],
            propertyPath: "post2.Return",
          },
        },
        {
          "@type": "TypeMetadata",
          args: [],
          array: false,
          canBeUndefined: false,
          deprecated: false,
          description: "",
          kind: "function",
          nullable: false,
          properties: [],
          propertyName: "post3",
          propertyPath: "post3",
          returnType: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description: "",
            kind: "object",
            nullable: false,
            properties: [
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "post3.Return.id",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "string",
                nullable: false,
                properties: [],
                propertyName: "name",
                propertyPath: "post3.Return.name",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "",
                kind: "string",
                nullable: false,
                properties: [],
                propertyName: "title",
                propertyPath: "post3.Return.title",
              },
            ],
            propertyPath: "post3.Return",
          },
        },
      ],
      subscriptions: [],
    })
  })
})
