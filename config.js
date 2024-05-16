import { globSync, readFileSync } from "node:fs"

export function readConfig({ logger, configPath }) {
  logger.debug(`Using config file: ${configPath}`)

  const config = globSync([configPath])

  if (config.length < 1) {
    logger.error("Config file not found")
    process.exit(1)
  }

  const config_file = readFileSync(configPath, { encoding: "utf-8" })
  logger.debug("Read config file successfully")

  let config_obj = {}

  try {
    config_obj = JSON.parse(config_file)
  } catch (error) {
    logger.error(error.message)
    process.exit(1)
  }

  if (!config_obj.spacing) {
    logger.error("Missing option in config: spacing")
    process.exit(1)
  }

  if (!config_obj.breakpoints) {
    logger.error("Missing option in config: breakpoints")
    process.exit(1)
  }
  logger.debug("Config read and validated", config_obj)

  return config_obj
}
