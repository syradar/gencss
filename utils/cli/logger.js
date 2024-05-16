import { styleText } from "node:util"

export const LOG_LEVEL = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const LOG_COLORS = {
  [LOG_LEVEL.debug]: "white",
  [LOG_LEVEL.info]: "cyan",
  [LOG_LEVEL.warn]: "orange",
  [LOG_LEVEL.error]: "red",
}

const LOG_NAMES = {
  [LOG_LEVEL.debug]: "DEBG",
  [LOG_LEVEL.info]: "INFO",
  [LOG_LEVEL.warn]: "WARN",
  [LOG_LEVEL.error]: "ERRO",
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
        logLevel: this.#logLevel,
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
    if (this.#logLevel > logLevel) {
      return
    }

    const color = this.#getColor(logLevel)

    const formattedArgs = args.map((arg) =>
      typeof arg === "string" ? styleText(color, String(arg)) : arg
    )

    this.#logFn(`[${LOG_NAMES[logLevel]}]`, ...formattedArgs)
  }

  #getColor(logLevel) {
    return this.#useColor ? LOG_COLORS[logLevel] : "white"
  }
}
