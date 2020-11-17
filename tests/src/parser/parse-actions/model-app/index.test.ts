import { parse } from "@microframework/parser"

describe("parser > parse actions", () => {
  test("actions defined with a referenced types", () => {
    const appMetadata = parse(__dirname + "/model-app.ts")
    expect(appMetadata).toStrictEqual({
      "@type": "ApplicationTypeMetadata",
      actions: [
        {
          "@type": "ActionTypeMetadata",
          body: undefined,
          cookies: undefined,
          description: "Loads a single category by its id.",
          headers: undefined,
          name: "GET /api/category/:id",
          params: {
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
                description: "Category id.",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "GET /api/category/:id.params.id",
              },
            ],
            propertyName: "params",
            propertyPath: "GET /api/category/:id.params",
          },
          query: undefined,
          return: {
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
                description: "Category id.",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "GET /api/category/:id.return.id",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "Category name.",
                kind: "string",
                nullable: true,
                properties: [],
                propertyName: "name",
                propertyPath: "GET /api/category/:id.return.name",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: true,
                canBeUndefined: true,
                deprecated: true,
                description: "Category posts.",
                kind: "object",
                nullable: false,
                properties: [
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Unique post id.",
                    kind: "number",
                    nullable: false,
                    properties: [],
                    propertyName: "id",
                    propertyPath: "GET /api/category/:id.return.posts.id",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Post title.",
                    kind: "string",
                    nullable: false,
                    properties: [],
                    propertyName: "title",
                    propertyPath: "GET /api/category/:id.return.posts.title",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: "Will be removed.",
                    description: "Post categories count.",
                    kind: "number",
                    nullable: false,
                    properties: [],
                    propertyName: "categoryCount",
                    propertyPath:
                      "GET /api/category/:id.return.posts.categoryCount",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Indicates if post is moderated or not.",
                    kind: "enum",
                    nullable: false,
                    properties: [
                      {
                        "@type": "TypeMetadata",
                        args: [],
                        array: false,
                        canBeUndefined: false,
                        deprecated: false,
                        description: "Indicates if post was moderated.",
                        kind: "object",
                        nullable: false,
                        properties: [],
                        propertyName: "moderated",
                        propertyPath:
                          "GET /api/category/:id.return.posts.status.moderated",
                      },
                      {
                        "@type": "TypeMetadata",
                        args: [],
                        array: false,
                        canBeUndefined: false,
                        deprecated: false,
                        description: "Indicates if post is under moderation.",
                        kind: "object",
                        nullable: false,
                        properties: [],
                        propertyName: "under_moderation",
                        propertyPath:
                          "GET /api/category/:id.return.posts.status.under_moderation",
                      },
                    ],
                    propertyName: "status",
                    propertyPath: "GET /api/category/:id.return.posts.status",
                    typeName: "PostStatus",
                  },
                ],
                propertyName: "posts",
                propertyPath: "GET /api/category/:id.return.posts",
                typeName: "Post",
              },
            ],
            propertyName: "",
            propertyPath: "GET /api/category/:id.return",
            typeName: "Category",
          },
        },
        {
          "@type": "ActionTypeMetadata",
          body: {
            "@type": "TypeMetadata",
            args: [],
            array: false,
            canBeUndefined: false,
            deprecated: false,
            description:
              "This input is used to create new category or change exist one.",
            kind: "object",
            nullable: false,
            properties: [
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: true,
                deprecated: false,
                description: "Category id.",
                kind: "number",
                nullable: true,
                properties: [],
                propertyName: "id",
                propertyPath: "POST /api/category.body.id",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: true,
                deprecated: false,
                description: "Category name.",
                kind: "string",
                nullable: false,
                properties: [],
                propertyName: "name",
                propertyPath: "POST /api/category.body.name",
              },
            ],
            propertyName: "body",
            propertyPath: "POST /api/category.body",
            typeName: "CategoryInput",
          },
          cookies: undefined,
          description: "Saves a category.",
          headers: undefined,
          name: "POST /api/category",
          params: undefined,
          query: undefined,
          return: {
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
                description: "Category id.",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "POST /api/category.return.id",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: false,
                canBeUndefined: false,
                deprecated: false,
                description: "Category name.",
                kind: "string",
                nullable: true,
                properties: [],
                propertyName: "name",
                propertyPath: "POST /api/category.return.name",
              },
              {
                "@type": "TypeMetadata",
                args: [],
                array: true,
                canBeUndefined: true,
                deprecated: true,
                description: "Category posts.",
                kind: "object",
                nullable: false,
                properties: [
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Unique post id.",
                    kind: "number",
                    nullable: false,
                    properties: [],
                    propertyName: "id",
                    propertyPath: "POST /api/category.return.posts.id",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Post title.",
                    kind: "string",
                    nullable: false,
                    properties: [],
                    propertyName: "title",
                    propertyPath: "POST /api/category.return.posts.title",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: "Will be removed.",
                    description: "Post categories count.",
                    kind: "number",
                    nullable: false,
                    properties: [],
                    propertyName: "categoryCount",
                    propertyPath:
                      "POST /api/category.return.posts.categoryCount",
                  },
                  {
                    "@type": "TypeMetadata",
                    args: [],
                    array: false,
                    canBeUndefined: false,
                    deprecated: false,
                    description: "Indicates if post is moderated or not.",
                    kind: "enum",
                    nullable: false,
                    properties: [
                      {
                        "@type": "TypeMetadata",
                        args: [],
                        array: false,
                        canBeUndefined: false,
                        deprecated: false,
                        description: "Indicates if post was moderated.",
                        kind: "object",
                        nullable: false,
                        properties: [],
                        propertyName: "moderated",
                        propertyPath:
                          "POST /api/category.return.posts.status.moderated",
                      },
                      {
                        "@type": "TypeMetadata",
                        args: [],
                        array: false,
                        canBeUndefined: false,
                        deprecated: false,
                        description: "Indicates if post is under moderation.",
                        kind: "object",
                        nullable: false,
                        properties: [],
                        propertyName: "under_moderation",
                        propertyPath:
                          "POST /api/category.return.posts.status.under_moderation",
                      },
                    ],
                    propertyName: "status",
                    propertyPath: "POST /api/category.return.posts.status",
                    typeName: "PostStatus",
                  },
                ],
                propertyName: "posts",
                propertyPath: "POST /api/category.return.posts",
                typeName: "Post",
              },
            ],
            propertyName: "",
            propertyPath: "POST /api/category.return",
            typeName: "Category",
          },
        },
        {
          "@type": "ActionTypeMetadata",
          body: undefined,
          cookies: undefined,
          description: "Removes a category.",
          headers: undefined,
          name: "DELETE /api/category/:id",
          params: {
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
                description: "Category id.",
                kind: "number",
                nullable: false,
                properties: [],
                propertyName: "id",
                propertyPath: "DELETE /api/category/:id.params.id",
              },
            ],
            propertyName: "params",
            propertyPath: "DELETE /api/category/:id.params",
          },
          query: undefined,
          return: {
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
                kind: "boolean",
                nullable: false,
                properties: [],
                propertyName: "success",
                propertyPath: "DELETE /api/category/:id.return.success",
              },
            ],
            propertyName: "",
            propertyPath: "DELETE /api/category/:id.return",
          },
        },
      ],
      description: "",
      inputs: [],
      models: [],
      mutations: [],
      name: "App",
      queries: [],
      subscriptions: [],
    })
  })
})
