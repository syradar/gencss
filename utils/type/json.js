import Result from "./result.js"

export function safeJsonParse(supposedlyJson) {
  try {
    const parsed = JSON.parse(supposedlyJson)
    return Result.Ok(parsed)
  } catch (error) {
    return Result.Err(error)
  }
}

const JSONS = {
  safeJsonParse,
}

export default JSONS
