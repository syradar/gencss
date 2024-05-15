import Result from "./result.js"
import { isNullish, isNumber } from "./typeCheck.js"

export function validateNumber(value) {
  if (isNullish(value)) {
    return Result.Err(new TypeError(`${value} is nullish`))
  }

  if (!isNumber(value)) {
    return Result.Err(new TypeError(`${value} is not a number`))
  }

  if (!isFinite(value)) {
    return Result.Err(new TypeError(`${value} is infenite`))
  }

  return Result.Ok(value)
}

export function safeParseFloat(str) {
  const parsed = Number.parseFloat(str)

  return validateNumber(parsed)
}

const Numbers = {
  safeParseFloat,
  validateNumber,
}

export default Numbers
