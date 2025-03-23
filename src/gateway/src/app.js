const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const CustomLogger = require('./utils/logger')
const { errorHandler } = require('./utils/error')
const AuthRouter = require('./routes/auth')
const ProfileRouter = require('./routes/profile')
const NotificationRouter = require('./routes/notification')
const ProductRouter = require('./routes/product')
const OrderRouter = require('./routes/order')
const PaymentRouter = require('./routes/payment')
const CartRouter = require('./routes/cart')
const RatingRouter = require('./routes/rating')
const SellerRouter = require('./routes/seller')
const { rateLimit } = require('express-rate-limit')

// Initialise instance of CustomLogger singleton service.
CustomLogger.getInstance()

app.use('/', (req, res, next) => {
  CustomLogger
    .getInstance()
    .logHttpRequest(req, res);
  next();
})

app.use(cors())

app.use('/api', (req, res, next) => {
  console.log(req.originalUrl)
  next()
})
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})
app.use(limiter)

app.use('/api/auth', AuthRouter)
app.use('/api/profile', ProfileRouter)
app.use('/api/notification', NotificationRouter)
app.use('/api/product', ProductRouter)
app.use('/api/order', OrderRouter)
app.use('/api/payment', PaymentRouter)
app.use('/api/cart', CartRouter)
app.use('/api/product-ratings', RatingRouter)
app.use('/api/seller', SellerRouter)

app.use('/api', errorHandler)

module.exports = app
