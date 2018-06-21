const fromInput = function (inputAttr, options) {
  return function (target, propertyKey, descriptor) {
    target.__mappers = target.__mappers || []
    inputAttr = inputAttr || propertyKey

    const id = String(Math.random()).substr(2)
    target.__mappers.push(id)
    target[`__mapper__${id}`] = (context, input = null) => {
      const parts = inputAttr.split('.')

      let inputContext = input
      parts.forEach((part, index) => {
        if (inputContext === null) {
          return
        }
        if (part in inputContext) {
          if (index < parts.length - 1) {
            inputContext = inputContext[part]
          } else {
            let value = inputContext[part]
            if (options && options.model) {
              const Model = options.model
              if (Array.isArray(value)) {
                value = value.map(x => new Model(x))
              } else {
                value = new Model(value)
              }
            }
            if (options && options.each && Array.isArray(value)) {
              value = value.map(x => options.each(x))
            }
            if (options && options.sort && Array.isArray(value)) {
              value.sort(options.sort)
            }
            if (options && options.transform) {
              value = options.transform(value, input)
            }

            context[propertyKey] = value
          }
        } else {
          inputContext = null
        }
      })
    }

    return descriptor
  }
}

export default fromInput
