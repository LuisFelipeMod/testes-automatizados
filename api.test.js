import { describe, before, after, it } from 'node:test'
import { deepStrictEqual, ok, strictEqual } from 'node:assert'
const BASE_URL = 'http://localhost:3000'

describe('API Workflow', () => {
  let _server = {}
  let _globalToken = ''

  before(async () => {
    _server = (await import('./api.js')).app
    await new Promise(resolve => _server.once('listening', resolve))
  })
  after(done => _server.close(done))

  it('should receive not authorized given wrong user and password', async() =>{
    const data = {
      user: 'luismodesto',
      password: ''
    }
    const request = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    strictEqual(request.status, 401)

    const response = await request.json()
    deepStrictEqual(response, {error: 'user invalid!'})
  })
  it('should login sucessfuly given correct user and password', async() =>{
    const data = {
      user: 'luismodesto',
      password: '1234'
    }
    const request = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    strictEqual(request.status, 200)

    const response = await request.json()
    ok(response.token, 'token should be present')
    _globalToken = response.token
  })

  it('should not be allowed to acesss private data without token', async() =>{
    const request = await fetch(`${BASE_URL}/login`, {
      method: 'GET',
      headers: {
        authorization: ''
      }
    })
    strictEqual(request.status, 400)

    const response = await request.json()
    deepStrictEqual(response, {error: 'invalid token!'})
  })
  it('should be allowed to acesss private data with valid token', async() =>{
    const request = await fetch(`${BASE_URL}/login`, {
      method: 'GET',
      headers: {
        authorization: _globalToken
      }
    })
    strictEqual(request.status, 200)

    const response = await request.json()
    deepStrictEqual(response, {result: 'valid token... welcome!!!'})
  })
})