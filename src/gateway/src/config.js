require('dotenv')
  .config()

const PORT = process.env.PORT
const SERVICE_REGISTRY_BASE_URI = 'http://localhost:3001'
const logsDirectory = './logs'
const jwtSecret = process.env.JWT_SECRET

module.exports = {
  PORT,
  SERVICE_REGISTRY_BASE_URI,
  logsDirectory,
  jwtSecret,
}
