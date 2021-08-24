module.exports = (Model) => async function () {
  return new Promise((resolve, reject) => Model.remove({}, (err) => {
    if (err) {
      return reject(err)
    }
    resolve()
  }))
}
