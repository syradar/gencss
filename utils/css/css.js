import Result from "../type/result.js"
import Strings from "../type/strings.js"

const NUMBER_WITH_UNIT_REGEXP = /^([-.\d]+(?:\.\d+)?)(.*)$/

/**
 * Splits a string into a numerical value and a unit.
 * @param {string} v - The string to split.
 */
export function splitUnit(v) {
  if (Strings.isNullishOrEmptyOrWhitespace(v)) {
    return Result.Ok({ value: v, unit: "" })
  }

  const split = v.match(NUMBER_WITH_UNIT_REGEXP)

  if (!split) {
    return Result.Err(new RangeError("No number found"))
  }

  return Result.Ok({ value: split[1].trim(), unit: split[2].trim() })
}

const CSSUtils = {
  splitUnit,
}

export default CSSUtils
