import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { test } from 'node:test'
import { createRequestLogger } from '../src/middleware/requestLogger.js'

function runLogger(statusCode) {
  const messages = { info: [], warn: [], error: [] }
  const logger = {
    info: (message) => messages.info.push(message),
    warn: (message) => messages.warn.push(message),
    error: (message) => messages.error.push(message),
  }
  const times = [100, 125]
  const response = new EventEmitter()
  response.statusCode = statusCode
  let nextCalled = false

  createRequestLogger({ logger, now: () => times.shift() })(
    {
      method: 'GET',
      path: '/api/products',
      originalUrl: '/api/products?token=gizli',
      headers: { authorization: 'Bearer gizli' },
      body: { password: 'gizli' },
    },
    response,
    () => {
      nextCalled = true
    },
  )
  response.emit('finish')

  return { messages, nextCalled }
}

test('successful requests are logged at info level with method path status and duration', () => {
  const result = runLogger(200)

  assert.equal(result.nextCalled, true)
  assert.deepEqual(result.messages.info, ['[INFO] GET /api/products 200 25ms'])
})

test('client errors use warn and server errors use error', () => {
  assert.match(runLogger(404).messages.warn[0], /^\[WARN\]/)
  assert.match(runLogger(500).messages.error[0], /^\[ERROR\]/)
})

test('logs do not include query values headers or request bodies', () => {
  const result = runLogger(200)
  const message = result.messages.info[0]

  assert.equal(message.includes('gizli'), false)
  assert.equal(message.includes('token'), false)
  assert.equal(message.includes('authorization'), false)
  assert.equal(message.includes('password'), false)
})

test('disabled logging calls next without attaching a finish listener', () => {
  const response = new EventEmitter()
  let nextCalled = false

  createRequestLogger({ enabled: false })(
    { method: 'GET', path: '/api/health' },
    response,
    () => {
      nextCalled = true
    },
  )

  assert.equal(nextCalled, true)
  assert.equal(response.listenerCount('finish'), 0)
})
