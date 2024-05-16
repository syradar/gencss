import { globSync, readFileSync } from "node:fs"
import { isEmpty } from "../type/typeCheck.js"
import { safeJsonParse } from "../type/json.js"
import Result from "../type/result.js"
import { trace } from "../type/trace.js"
import { safeReadFileSync } from "./files.js"

const REQUIRED_OPTIONS = ["spacing", "breakPoints"]

export function readConfig({ logger, configPath }) {
  return Result.Ok(configPath)
    .map(trace((c) => logger.debug(`Using config file: ${c}`)))
    .andThen(validateConfigPath)
    .andThen(safeReadFileSync)
    .map(trace(() => logger.debug("Read config file successfully")))
    .andThen(safeJsonParse)
    .andThen(validateOptions)
    .map(trace((conf) => logger.debug("Config read and validated", conf)))
}

function validateConfigPath(configPath) {
  const configFiles = globSync([configPath])

  if (configFiles.length < 1) {
    return Result.Err("Config file not found")
  }

  return Result.Ok(configPath)
}

function validateOptions(configObj) {
  const missingOptions = REQUIRED_OPTIONS.filter((option) => !configObj[option])

  if (!isEmpty(missingOptions)) {
    const errorMessages = missingOptions.map(
      (option) => `Missing option in config: ${option}`
    )
    return Result.Err(errorMessages)
  }

  return Result.Ok(configObj)
}
