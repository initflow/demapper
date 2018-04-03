const fromInput = function (inputAttr, options) {
  return function (target, propertyKey, descriptor) {
    target.__mapper = target.__mapper || {
      properties: []
    }
    inputAttr = inputAttr || propertyKey

    target.__mapper.properties.push((context, input) => {
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
            const value = inputContext[part]
            if (options && options.each && Array.isArray(value)) {
              context[propertyKey] = value.map(x => options.each(x))
            } else if (options && options.transform) {
              context[propertyKey] = options.transform(value)
            } else if (options && options.model) {
              const Model = options.model
              if (Array.isArray(value)) {
                context[propertyKey] = value.map(x => new Model(x))
              } else {
                context[propertyKey] = new Model(value)
              }
            } else {
              context[propertyKey] = value
            }
          }
        } else {
          inputContext = null
        }
      })
    })

    return descriptor
  }
}

export default fromInput
