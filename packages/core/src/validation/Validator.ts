import {
  NumberValidationConstraints,
  StringValidationConstraints,
} from "./index"

/**
 * Validator implementation should implement this type for framework to execute a validation.
 */
export type Validator = (options: {
  key: string
  value: any
  options: StringValidationConstraints | NumberValidationConstraints
}) => void | Promise<void>
