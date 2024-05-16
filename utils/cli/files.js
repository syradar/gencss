import { writeFileSync, readFileSync } from "node:fs"
import { EOL } from "node:os"
import Result from "../type/result.js"

/**
 * Safely reads data from a file, returning a Result type.
 * @param {string} path - The path to the file to be read.
 * @returns {Result} - Result.Ok with the file contents on success, Result.Err with the error message on failure.
 */
export function safeReadFileSync(path) {
  try {
    const configFile = readFileSync(path, { encoding: "utf-8" })
    return Result.Ok(configFile)
  } catch (error) {
    return Result.Err(error.message)
  }
}

/**
 * Safely writes data to a file, returning a Result type.
 * @param {string} path - The path to the file where data should be written.
 * @param {string} data - The data to be written to the file.
 * @returns {Result} - Result.Ok on success, Result.Err on failure.
 */
export function safeWriteFileSync(path, data) {
  try {
    writeFileSync(path, data + EOL, { encoding: "utf-8" })
    return Result.Ok(path)
  } catch (err) {
    return Result.Err(err.message)
  }
}
