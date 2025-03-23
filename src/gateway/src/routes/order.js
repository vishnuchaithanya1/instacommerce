const proxy = require('../proxy')
const { extractToken, extractUserId } = require('../utils/middleware')
const ServiceRegistryClient = require('../utils/serviceRegistry')

const OrderRouter = require('express').Router()

OrderRouter.post('/all',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Order-Management')
      const targetUrl = new URL('/api/order/all', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

OrderRouter.get('/:orderId',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const orderId = req.params.orderId
      const baseUrl = await ServiceRegistryClient.getUrl('Order-Management')
      const targetUrl = new URL(`/api/order/${orderId}`, baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

OrderRouter.post('/cancel/:orderId',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const orderId = req.params.orderId
      const baseUrl = await ServiceRegistryClient.getUrl('Order-Management')
      const targetUrl = new URL(`/api/order/cancel/${orderId}`, baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

OrderRouter.post('/update-status',
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Order-Management')
      const targetUrl = new URL('/api/for-agent/update-status', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)
module.exports = OrderRouter
