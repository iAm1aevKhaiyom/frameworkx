import { app } from "../app";

export const CategoryEntity = app
  .model("CategoryType")
  .entity()
  .resolvable(true)
  .schema({
    id: {
      type: "int",
      primary: true,
      generated: "increment"
    },
    name: {
      type: "varchar"
    },
    posts: {
      relation: "many-to-many" as const,
      joinTable: false,
      inverseSide: "categories"
    }
  })
