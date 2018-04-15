const mapper = function (Constructor) {
  return class extends Constructor {
    constructor (input) {
      super(input)

      if (this.__mapper) {
        let data = input
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (error) { }
        }
        this.__mapper.properties.forEach(x => x(this, data))
      }
    }
  }
}

export default mapper
