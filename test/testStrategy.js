const x = require('tap')
const test = x.test

const Auth = require('../lib/index')
class Strategy extends Auth.strategy {}

const instance = new Strategy()

test('test strategy onError', function (assert) {
  try {
    instance.onError(null, null, null)
  } catch (e) {
    assert.ok(e instanceof Error, 'should throw Error')
    assert.equal(e.message, 'You have to implement the method onError!')
  }
  assert.end()
})

test('test strategy onUserCheck', function (assert) {
  try {
    instance.onUserCheck(null, null, null)
  } catch (e) {
    assert.ok(e instanceof Error, 'should throw Error')
    assert.equal(e.message, 'You have to implement the method onUserCheck!')
  }
  assert.end()
})

test('test strategy onPermissionCheck', function (assert) {
  instance.onPermissionCheck(null, 0, (err, PermissionRequest) => {
    assert.strictEqual(err, null)
    assert.strictEqual(PermissionRequest, true)
    assert.end()
  })
})
