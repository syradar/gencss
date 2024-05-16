export function trace(fn) {
  return (val) => {
    fn(val)
    return val
  }
}
