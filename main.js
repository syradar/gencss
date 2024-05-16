import { writeFileSync } from "node:fs"
import { EOL } from "node:os"
import { styleText } from "node:util"
import { getArgs } from "./utils/cli/arrrgs.js"
import { readConfig } from "./utils/cli/config.js"
import CSSUtils from "./utils/css/css.js"
import { GenCSSLogger, LOG_LEVEL } from "./utils/cli/logger.js"
import Numbers from "./utils/type/numbers.js"
import Result from "./utils/type/result.js"
import TypeCheck from "./utils/type/typeCheck.js"

const args = getArgs()
if (args.err) {
  console.error(styleText("red", String(args.val.message)))
  process.exit(1)
}

const validArgs = args.safeUnwrap()

const useColor = validArgs.color
const configPath = validArgs.config
const outputPath = validArgs.output
const logLevel = validArgs.logLevel

const logger = new GenCSSLogger({ logger: console.log, useColor, logLevel })
const config = readConfig({ configPath, logger })

const ALLOWED_UNITS = ["rem", "px", "em"]
const spacing = config.spacing
const spacing_validated = Object.entries(spacing).reduce(
  (acc, [key, value]) => {
    const num_and_unit = validateNumberAndUnit(value)

    if (num_and_unit.ok) {
      acc[key] = num_and_unit.unwrap()
    }

    return acc
  },
  {}
)

const breakpoints = config.breakpoints
const breakpoints_validated = Object.entries(breakpoints).reduce(
  (acc, [key, value]) => {
    const num_and_unit = validateNumberAndUnit(value)

    if (num_and_unit.ok) {
      acc[key] = num_and_unit.unwrap()
    }

    return acc
  },
  {}
)

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

// Validate spacing values
const result = SPACING_PROPERTIES.map((spacing_property) =>
  Object.entries(spacing_validated).map(([spacer, { value, unit }]) => {
    const generated_spacings = generate(
      spacing_property,
      breakpoints_validated,
      spacer,
      value,
      unit
    )
    return generated_spacings
  })
)
  .flat(3)
  .join(EOL)

try {
  writeFileSync(outputPath, result + EOL, { encoding: "utf-8" })
  logger.info(`Generated CSS written to: ${outputPath}`)
} catch (err) {
  logger.error(`${err}`)
}

/**
 * Validates a number and its CSS unit.
 * @param {string} spacer_value - The CSS value to validate.
 */
function validateNumberAndUnit(spacer_value) {
  return CSSUtils.splitUnit(spacer_value)
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

function generate(property_family, breakPoints, spacer, num, unit) {
  return Object.entries(property_family).map(([prefix, property]) => {
    return Object.entries(breakPoints).map(([bp_prefix, bp_value]) => {
      if (bp_value.value === 0) {
        return `.${prefix}-${spacer} {${EOL}\t${property}: ${num}${unit};${EOL}}${EOL}`
      }

      const top = `@media screen and (min-width: ${bp_value.value}${bp_value.unit}) {${EOL}\t`
      const rule = `.${prefix}-${bp_prefix}-${spacer} {${EOL}\t\t${property}: ${num}${unit};${EOL}\t}`
      const bottom = `${EOL}}`

      return top + rule + bottom
    })
  })
}
