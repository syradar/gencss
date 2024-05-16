import { styleText } from "node:util"

export const LOG_LEVEL = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const LOG_COLORS = {
  0: "white",
  1: "cyan",
  2: "orange",
  3: "red",
}

const LOG_NAMES = {
  0: "DEBG",
  1: "INFO",
  2: "WARN",
  3: "ERRO",
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
    if (this.#logLevel > LOG_LEVEL.debug) {
      return
    }

    this.#print(LOG_LEVEL.debug, ...args)
  }

  info(...args) {
    if (this.#logLevel > LOG_LEVEL.info) {
      return
    }

    this.#print(LOG_LEVEL.info, ...args)
  }

  warn(...args) {
    if (this.#logLevel > LOG_LEVEL.warn) {
      return
    }

    this.#print(LOG_LEVEL.warn, ...args)
  }

  error(...args) {
    if (this.#logLevel > LOG_LEVEL.error) {
      return
    }

    this.#print(LOG_LEVEL.error, ...args)
  }

  #print(logLevel, ...args) {
    const color = this.#getColor(logLevel)

    const toPrint = args.map((arg) => {
      if (typeof arg === "string") {
        return styleText(color, String(arg))
      }

      return arg
    })

    this.#logFn(`[${LOG_NAMES[logLevel] ?? "INFO"}]`, ...toPrint)
  }

  #getColor(logLevel) {
    return this.#useColor ? LOG_COLORS[logLevel] : "white"
  }
}
