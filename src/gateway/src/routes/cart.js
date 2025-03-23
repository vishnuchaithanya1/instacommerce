const proxy = require('../proxy')
const { extractToken, extractUserId } = require('../utils/middleware')
const ServiceRegistryClient = require('../utils/serviceRegistry')

const CartRouter = require('express').Router()

CartRouter.post('/add/:productId',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      console.log("Headers",req.headers)
      const baseUrl = await ServiceRegistryClient.getUrl('Cart')
      const targetUrl = new URL(`/api/add/${req.params.productId}`, baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

CartRouter.put('/decrement/:productId',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Cart')
      const targetUrl = new URL(`/api/decrement-item/${req.params.productId}`, baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

CartRouter.delete('/remove-item/:productId',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Cart')
      const targetUrl = new URL(`/api/remove-item/${req.params.productId}`, baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

CartRouter.delete('/clear',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Cart')
      const targetUrl = new URL('/api/clear-cart', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

CartRouter.get('/view',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Cart')
      const targetUrl = new URL('/api/view-cart', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

module.exports = CartRouter