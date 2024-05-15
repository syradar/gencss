import { globSync, readFileSync, writeFileSync } from "node:fs"
import { parseArgs, styleText } from "node:util"
import { EOL } from "node:os"
import CSSUtils from "./css.js"
import Numbers from "./numbers.js"
import TypeCheck from "./typeCheck.js"
import Result from "./result.js"

const options = {
  color: { type: "boolean" },
  config: { type: "string" },
  output: { type: "string" },
}

function get_loggers({ useColor, logger }) {
  const error = (msg) =>
    logger(useColor ? styleText("red", String(msg)) : String(msg))
  const info = (msg) =>
    logger(useColor ? styleText("cyan", String(msg)) : String(msg))
  const success = (msg) =>
    logger(useColor ? styleText("green", String(msg)) : String(msg))

  return {
    error,
    info,
    success,
  }
}

const { values } = parseArgs({ options })

const useColor = values.color

const { error, info, success } = get_loggers({ useColor, logger: console.log })

const configPath = values.config
const outputPath = values.output

info(`Using config file: ${configPath}`)

const config = globSync([configPath])

if (config.length < 1) {
  error("Config file not found")
  process.exit(1)
}

const ALLOWED_UNITS = ["rem", "px", "em"]

const config_file = readFileSync(configPath, { encoding: "utf-8" })
info("Read config file successfully")

let config_obj = {}
try {
  config_obj = JSON.parse(config_file)
} catch (error) {
  error(JSON.stringify(error))
  process.exit(1)
}

if (!config_obj.spacing) {
  error("Missing option in config: spacing")
  process.exit(1)
}
const spacing = config_obj.spacing
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

if (!config_obj.breakpoints) {
  error("Missing option in config: breakpoints")
  process.exit(1)
}
const breakpoints = config_obj.breakpoints
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
  success(`Generated CSS written to: ${outputPath}`)
} catch (err) {
  error(`${err}`)
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
      console.log("label", numUnit)

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
