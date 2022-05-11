module.exports = (on, config) => {
  on('task', {
    // Adds a "log" task to dump output to the console.
    log(message) {
      console.log(message)
      return null
    },
    // Adds a "table" task to dump tabular output to the console.
    table(message) {
      console.table(message)
      return null
    },
  })
}
