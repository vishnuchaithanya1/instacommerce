const proxy = require('../proxy')
const { extractToken, extractUserId } = require('../utils/middleware')
const ServiceRegistryClient = require('../utils/serviceRegistry')

const ProfileRouter = require('express').Router()

ProfileRouter.get('/',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      console.log(req.headers)
      const baseUrl = await ServiceRegistryClient.getUrl('User-Management')
      const targetUrl = new URL('/api/profile', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

module.exports = ProfileRouter
