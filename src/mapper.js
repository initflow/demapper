const mapper = function (Constructor) {
  return class extends Constructor {
    constructor (input) {
      super(input)
      if (this.__mappers) {
        let data = input
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data)
          } catch (error) { }
        }
        this.__mappers.forEach((id) => {
          const key = `__mapper__${id}`
          if (key in this) {
            this[key](this, data)
          }
        })
      }
    }
  }
}

export default mapper
