const fromInput = function (inputAttr) {
  return function (target, propertyKey, descriptor) {
    target.__mapper = target.__mapper || {
      properties: []
    }

    target.__mapper.properties.push((context, input) => {
      if (inputAttr in input) {
        context[propertyKey] = input[inputAttr]
      }
    })

    return descriptor
  }
}

export default fromInput
