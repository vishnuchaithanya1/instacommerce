const proxy = require('../proxy')
const ServiceRegistryClient = require('../utils/serviceRegistry')

const AuthRouter = require('express').Router()

AuthRouter.post('/signUp', async (req, res, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl('User-Management')
    const targetUrl = new URL('/api/signup', baseUrl).toString()
    await proxy(req, res, targetUrl)
  } catch (e) {
    next(e)
  }
})

AuthRouter.post('/activate', async (req, res, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl('User-Management')
    const targetUrl = new URL('/api/activate-account', baseUrl).toString()
    await proxy(req, res, targetUrl)
  } catch (e) {
    next(e)
  }
})

AuthRouter.post('/signIn', async (req, res, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl('User-Management')
    const targetUrl = new URL('/api/signIn', baseUrl).toString()
    await proxy(req, res, targetUrl)
  } catch (e) {
    next(e)
  }
})

module.exports = AuthRouter
