import { parseArgs } from "node:util"
import Result from "./result.js"
import { LOG_LEVEL } from "./logger.js"

const CONFIG_NAME = "gencss.config.json"

const GEN_CSS_CLI_OPTIONS = {
  color: { type: "boolean" },
  config: { type: "string" },
  output: { type: "string" },
  logLevel: { type: "string" },
}

const DEFAULT_GEN_CSS_CLI_OPTIONS = {
  color: true,
  config: `./${CONFIG_NAME}`,
  output: `./`,
  logLevel: "info",
}

export function getArgs() {
  const { values } = parseArgs({
    options: GEN_CSS_CLI_OPTIONS,
  })

  const result = Object.keys(DEFAULT_GEN_CSS_CLI_OPTIONS).reduce(
    (acc, optionName) => {
      acc[optionName] =
        values[optionName] ?? DEFAULT_GEN_CSS_CLI_OPTIONS[optionName]

      return acc
    },
    {}
  )

  const logLevels = Object.keys(LOG_LEVEL)
  if (!logLevels.includes(result.logLevel)) {
    return Result.Err(
      new Error(`logLevel invalid. Valid values: ${logLevels.join(", ")}`)
    )
  }

  if (!result.config.includes(CONFIG_NAME)) {
    return Result.Err(
      new Error(
        `config invalid. Should be ${CONFIG_NAME} but got: ${result.config}`
      )
    )
  }

  return Result.Ok(result)
}
