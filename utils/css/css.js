import { EOL } from "node:os"
import Result from "../type/result.js"
import Strings from "../type/strings.js"
import TypeCheck from "../type/typeCheck.js"
import Numbers from "../type/numbers.js"

const NUMBER_WITH_UNIT_REGEXP = /^([-.\d]+(?:\.\d+)?)(.*)$/
const ALLOWED_UNITS = ["rem", "px", "em"]
const PADDING = {
  p: "padding",
  pt: "padding-top",
  pb: "padding-bottom",
  pl: "padding-left",
  pr: "padding-right",
  pin: "padding-inline",
  pbl: "padding-block",
}
const MARGIN = {
  m: "margin",
  mt: "margin-top",
  mb: "margin-bottom",
  ml: "margin-left",
  mr: "margin-right",
  min: "margin-inline",
  mbl: "margin-block",
}
const SPACING_PROPERTIES = [PADDING, MARGIN]

export function generateCssClasses({ spacing, breakPoints }) {
  const validSpacing = validateSpacing(spacing)
  const validBreakpoints = validateBreakpoints(breakPoints)
  // Validate spacing values
  const result = SPACING_PROPERTIES.map((spacingProperty) =>
    Object.entries(validSpacing).map(([spacer, { value, unit }]) => {
      const generatedSpacings = generate(
        spacingProperty,
        validBreakpoints,
        spacer,
        value,
        unit
      )
      return generatedSpacings
    })
  )
    .flat(3)
    .join(EOL)

  return result
}

/**
 * Validates a number and its CSS unit.
 * @param {string} spacerValue - The CSS value to validate.
 */
function validateNumberAndUnit(spacerValue) {
  return splitUnit(spacerValue)
    .andThen((splat) => {
      const result = Numbers.safeParseFloat(splat.value).map((num) => ({
        value: num,
        unit: splat.unit,
      }))

      return result
    })
    .andThen((numUnit) => {
      const isUnitlessZero =
        numUnit.value === 0 && TypeCheck.isEmpty(numUnit.unit)
      const isValidUnit = ALLOWED_UNITS.includes(numUnit.unit)

      if (!isValidUnit && !isUnitlessZero) {
        return Result.Err(`Invalid CSS unit: "${numUnit.unit}"`)
      }

      return Result.Ok(numUnit)
    })
}

function generate(propertyFamily, breakPoints, spacer, num, unit) {
  return Object.entries(propertyFamily).map(([prefix, property]) => {
    return Object.entries(breakPoints).map(([bpPrefix, bpValue]) => {
      if (bpValue.value === 0) {
        return `.${prefix}-${spacer} {${EOL}\t${property}: ${num}${unit};${EOL}}${EOL}`
      }

      const top = `@media screen and (min-width: ${bpValue.value}${bpValue.unit}) {${EOL}\t`
      const rule = `.${prefix}-${bpPrefix}-${spacer} {${EOL}\t\t${property}: ${num}${unit};${EOL}\t}`
      const bottom = `${EOL}}`

      return top + rule + bottom
    })
  })
}

/**
 * Splits a string into a numerical value and a unit.
 * @param {string} v - The string to split.
 */
function splitUnit(v) {
  if (Strings.isNullishOrEmptyOrWhitespace(v)) {
    return Result.Ok({ value: v, unit: "" })
  }

  const split = v.match(NUMBER_WITH_UNIT_REGEXP)

  if (!split) {
    return Result.Err(new RangeError("No number found"))
  }

  return Result.Ok({ value: split[1].trim(), unit: split[2].trim() })
}

function validateSpacing(spacing) {
  const result = Object.entries(spacing).reduce((acc, [key, value]) => {
    const numUnit = validateNumberAndUnit(value)

    if (numUnit.ok) {
      acc[key] = numUnit.unwrap()
    }

    return acc
  }, {})

  return result
}

function validateBreakpoints(breakPoints) {
  const result = Object.entries(breakPoints).reduce((acc, [key, value]) => {
    const numUnit = validateNumberAndUnit(value)

    if (numUnit.ok) {
      acc[key] = numUnit.unwrap()
    }

    return acc
  }, {})

  return result
}
