import { Logger } from "../logger"
import { AnyValidationRule, Validator } from "../validation"

/**
 * Application properties.
 */
export type ApplicationProperties = {

  /**
   * Validation to be used for model and inputs validation.
   */
  validator?: Validator

  /**
   * Logger to be used for logging events.
   */
  logger: Logger

  /**
   * List of registered validation rules.
   */
  validationRules: AnyValidationRule[]

}