const info = (...params) => {
  //ei tulosteta jos ajetaan testejä, sotkee näkymää
  if(process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  //ei tulosteta jos ajetaan testejä, sotkee näkymää
  if(process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info, error
}