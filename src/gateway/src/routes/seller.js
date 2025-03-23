const proxy = require('../proxy')
const { extractToken, extractUserId, extractSellerId, verifySeller } = require('../utils/middleware')
const ServiceRegistryClient = require('../utils/serviceRegistry')

const SellerRouter = require('express').Router()

SellerRouter.post('/',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Seller')
      const targetUrl = new URL('/api/signUp', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

SellerRouter.get('/',
  extractToken,
  extractUserId,
  verifySeller,
  extractSellerId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Seller')
      const targetUrl = new URL('/api/details', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

module.exports = SellerRouter
