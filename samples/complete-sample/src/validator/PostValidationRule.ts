import { App } from "../app/App"

/**
 * Validates Post model.
 */
export const PostValidationRule = App.validationRule(App.model("Post"), {
  projection: {
    text: {
      minLength: 10,
      maxLength: 10000,
    },
  },
  // validate: post => {
  // }
})
