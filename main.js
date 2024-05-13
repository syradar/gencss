import { globSync, readFileSync, writeFileSync } from "node:fs"
import { parseArgs, styleText } from "node:util"
import { EOL } from "node:os"

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

function split_unit(v) {
  if (typeof v === "string" && v !== "") {
    const split = v.match(/^([-.\d]+(?:\.\d+)?)(.*)$/)

    if (!split) {
      throw new RangeError("No number found")
    }

    return { value: split[1].trim(), unit: split[2].trim() }
  } else {
    return { value: v, unit: "" }
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

console.log(config)

// const configFile = await open(configPath)

// for await (const chunk of configFile.readableWebStream()) {
//   console.log(chunk)
// }

// await configFile.close()

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

console.log(config_obj)

if (!config_obj.spacing) {
  error("Missing option in config: spacing")
  process.exit(1)
}

const spacing = config_obj.spacing

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
  Object.entries(spacing).map(([spacer, spacer_value]) => {
    let value = ""
    let unit = ""
    try {
      const splat = split_unit(spacer_value)
      value = splat.value
      unit = splat.unit
    } catch (err) {
      error(err.toString())
      process.exit(1)
    }
    const num = Number(value)

    const is_value_zero_and_unitless = num === 0 && unit === ""
    const has_allowed_unit = ALLOWED_UNITS.some(
      (allowed_unit) => unit === allowed_unit
    )

    if (!has_allowed_unit && !is_value_zero_and_unitless) {
      error(`Invalid CSS unit: "${unit}"`)
    }

    console.log(spacer, num, unit)
    const generated_spacings = generate(spacing_property, spacer, num, unit)
    return generated_spacings
  })
)
  .flat(2)
  .join(EOL)

console.log(result)

try {
  writeFileSync(outputPath, result + EOL, { encoding: "utf-8" })
  success(`Generated CSS written to: ${outputPath}`)
} catch (err) {
  error(`${err}`)
}
function generate(property_family, spacer, num, unit) {
  return Object.entries(property_family).map(
    ([prefix, property]) =>
      `.${prefix}-${spacer} {${EOL}\t${property}: ${num}${unit};${EOL}}`
  )
}
