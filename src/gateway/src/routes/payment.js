const proxy = require('../proxy')
const { extractToken, extractUserId } = require('../utils/middleware')
const ServiceRegistryClient = require('../utils/serviceRegistry')

const PaymentRouter = require('express').Router()

PaymentRouter.get('/get/:paymentId',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Payment')
      const targetUrl = new URL('/api/payment/get/:paymentId', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

PaymentRouter.post('/checkout',
  extractToken,
  extractUserId,
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Payment')
      const targetUrl = new URL('/api/payment/checkout', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

PaymentRouter.post('/webhook',
  async (req, res, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl('Payment')
      const targetUrl = new URL('/api/payment/webhook', baseUrl).toString()
      await proxy(req, res, targetUrl)
    } catch (e) {
      next(e)
    }
  }
)

module.exports = PaymentRouter