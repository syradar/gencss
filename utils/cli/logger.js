import { styleText } from "node:util"

export const LOG_LEVEL = {
  debug: { level: 0, color: "white", name: "DEBG" },
  info: { level: 1, color: "cyan", name: "INFO" },
  warn: { level: 2, color: "orange", name: "WARN" },
  error: { level: 3, color: "red", name: "ERRO" },
}

export class GenCSSLogger {
  #useColor
  #logFn
  #logLevel

  constructor({ useColor, logFn, logLevel }) {
    this.#logFn = logFn ?? console.log
    this.#useColor = useColor ?? true
    this.#logLevel = LOG_LEVEL[logLevel] ?? LOG_LEVEL.info
    this.debug(
      LOG_LEVEL.debug,
      "Created logger with:",
      {
        useColor: this.#useColor,
        logFn: this.#logFn,
        logLevel: this.#logLevel.name,
      },
      "Got logger options:",
      {
        useColor,
        logFn,
        logLevel,
      }
    )
  }

  debug(...args) {
    this.log(LOG_LEVEL.debug, ...args)
  }

  info(...args) {
    this.log(LOG_LEVEL.info, ...args)
  }

  warn(...args) {
    this.log(LOG_LEVEL.warn, ...args)
  }

  error(...args) {
    this.log(LOG_LEVEL.error, ...args)
  }

  log(logLevel, ...args) {
    if (this.#logLevel.level > logLevel.level) {
      return
    }

    const color = this.#getColor(logLevel)

    const formattedArgs = args.map((arg) =>
      typeof arg === "string" ? styleText(color, String(arg)) : arg
    )

    this.#logFn(`[${logLevel.name}]`, ...formattedArgs)
  }

  #getColor(logLevel) {
    return this.#useColor ? logLevel.color : "white"
  }
}
