import test from 'ava'
import { mapper, fromInput } from '../../lib/index'

const input = {
  _text: 'data',
  _num: 100,
  _sub: {
    _name: 'SubName'
  },
  _transform: {
    _a: 1
  },
  _transformNull: null,
  _each: [{
    _a: 2
  }],
  _model: {
    _a: 3
  },
  _modelWhenNull: null,
  _models: [{
    _a: 4
  }],
  _unsortedModels: [{
    _a: 3
  }, {
    _a: 2
  }, {
    _a: 1
  }]
}

@mapper
class SubModel {
  @fromInput('_a')
  a = null
}

@mapper
class BaseModel {
  @fromInput('_text')
  text = null
}

@mapper
class Model extends BaseModel {
  @fromInput('_num')
  num = null

  @fromInput('_sub._name')
  subName = null

  @fromInput('_transform', {
    transform: data => new SubModel(data)
  })
  transform = null

  @fromInput('_transformNull', {
    transformNull: data => true
  })
  transformNull = null

  @fromInput('_each', {
    each: data => new SubModel(data)
  })
  each = null

  @fromInput('_model', {
    model: SubModel
  })
  model = null

  @fromInput('_modelWhenNull', {
    model: SubModel
  })
  modelWhenNull = null

  @fromInput('_models', {
    model: SubModel
  })
  models = null

  @fromInput('_unsortedModels', {
    model: SubModel,
    sort: (a, b) => a.a - b.a
  })
  sortedModels = null
}

const expect = {
  text: input._text,
  num: input._num,
  subName: input._sub._name,
  transform: new SubModel({ _a: 1 }),
  transformNull: true,
  each: [new SubModel({ _a: 2 })],
  model: new SubModel({ _a: 3 }),
  modelWhenNull: null,
  models: [new SubModel({ _a: 4 })],
  sortedModels: [
    new SubModel({ _a: 1 }),
    new SubModel({ _a: 2 }),
    new SubModel({ _a: 3 })
  ]

}

test('Test mapper', (t) => {
  const model = new Model(input)

  t.deepEqual({
    text: model.text,
    num: model.num,
    subName: model.subName,
    transform: model.transform,
    transformNull: model.transformNull,
    each: model.each,
    model: model.model,
    modelWhenNull: model.modelWhenNull,
    models: model.models,
    sortedModels: model.sortedModels
  }, expect)
})

test('undefied', (t) => {
  const model = new Model()

  t.is(model.text, null)
})
