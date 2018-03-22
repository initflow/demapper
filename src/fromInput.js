const fromInput = function (inputAttr) {
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
            context[propertyKey] = inputContext[part]
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
