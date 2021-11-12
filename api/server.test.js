const server = require('./server');
const request = require('supertest');
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

// Write your tests here
test('[0] sanity', () => {
  expect(true).toBe(true)
})

describe('server.js', () => {
  describe('[POST] /api/auth/register', () => {
    test('[1] responds with correct status for missing credentials', async () => {
      const res = await request(server)
        .post('/api/auth/register').send({ username: 'bar' })
      expect(res.status).toBe(401)
    }, 750)
    test('[2] responds with correct message for missing credentials', async () => {
      const res = await request(server)
        .post('/api/auth/register').send({ username: 'bar' })
      expect(res.body.message).toMatch(/username and password required/i)
    }, 750)
    test('[3] responds with correct status for valid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/register').send({ username: 'bar', password: '1234' })
      expect(res.status).toBe(201)
    }, 750)
    test('[4] responds with correct object for valid credentials', async () => {
      const res = await request(server)
        .post('/api/auth/register').send({ username: 'baz', password: '1234' })
      expect(res.body).toMatchObject({ id: 2, username: 'baz' })
    }, 750)
  })
  describe('[POST] /api/auth/login', () => {
    test('[5] responds with correct message on valid credentials', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'foo', password: '1234' })
      expect(res.body.message).toMatch(/welcome, foo/i)
    }, 750)
    test('[6] responds with correct message on invalid credentials', async () => {
      let res = await (await request(server).post('/api/auth/login')).send({ username: 'bob', password: '1234' })
      expect(res.status).toBe(401)
      expect(res.body.message).toMatch(/invalid credentials/i)
    })
  })
  describe('[GET] /api/jokes', () => {
    test('[7] gets jokes', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'foo', password: '1234' })
      res = await request(server).get('/api/jokes').set('Authorization', res.body.token)
      expect(res.body).toMatchObject([{ "id": 1, "username": "foo"}])
    })
    test('[8] requests without a token are rejected', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.body.message).toMatch(/token required/i)
    }, 750)
  })
})