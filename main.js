import { styleText } from "node:util"
import { getArgs } from "./utils/cli/arrrgs.js"
import { readConfig } from "./utils/cli/config.js"
import { safeWriteFileSync } from "./utils/cli/files.js"
import { GenCSSLogger } from "./utils/cli/logger.js"
import { generateCssClasses } from "./utils/css/css.js"

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

if (config.err) {
  logger.error(...config.val)
  process.exit(1)
}

const safeConfig = config.safeUnwrap()

const result = generateCssClasses(safeConfig)

const writeResult = safeWriteFileSync(outputPath, result)
if (writeResult.err) {
  logger.error(`Failed to write to file: ${err.message}`)
  process.exit(1)
}

logger.info(`Generated CSS written to: ${outputPath}`)
