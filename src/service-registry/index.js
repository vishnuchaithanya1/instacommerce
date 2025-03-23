const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const winston = require('winston')
const {
  serviceCheckFrequency,
  serviceAliveTimeout,
  serverPort,
} = require('./config');
const autoScaler = require('./autoScaler');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'app.log',
      handleExceptions: false, // Do not handle uncaught exceptions
      exitOnError: false, // Do not exit on transport errors
      flags: 'a', // Append to the log file
    }),
  ],
});

const app = express();
const port = serverPort;

// In-memory store for registered services
const services = {};
const serviceIndexes = {};

app.use(cors());
app.use(bodyParser.json());

// Endpoint for registering a service
app.post('/register', (req, res) => {
  const {
    instanceId,
    serviceName,
    host,
    port,
    metadata,
  } = req.body;

  if (
    !serviceName ||
    !host ||
    !port
  ) {
    return res
      .status(400)
      .json({
        message: 'Missing required fields',
      });
  }

  if (!services[serviceName]) {
    services[serviceName] = [];
  }

  const foundInstance = services[serviceName].find(service => service.instanceId === instanceId)

  if (foundInstance === undefined) {
    services[serviceName].push({
      instanceId,
      host,
      port,
      metadata,
      lastHeartbeat: Date.now(),
    });
    serviceIndexes[serviceName] = 0
    logger.info({
      timestamp: new Date().toISOString(),
      message: `InstanceId: ${instanceId}, Registered ${serviceName} at ${host}:${port}`,
    })
  } else {
    const newList = services[serviceName].map(service => {
      if (service.instanceId === instanceId) {
        return {
          ...service,
          lastHeartbeat: Date.now(),
        }
      } else {
        return service
      }
    })

    services[serviceName] = newList

    logger.info({
      timestamp: new Date().toISOString(),
      message: `InstanceId: ${instanceId}, Received HeartBeat`,
    })
  }

  res
    .status(200)
    .json({
      message: 'Service registered successfully',
    });
});

// Endpoint for discovering a service
app.get('/discover/:serviceName', (req, res) => {
  const { serviceName } = req.params;

  const allInstances = services[serviceName];
  if (!allInstances || allInstances.length === 0) {
    return res
      .status(404)
      .json({
        message: 'Service not found',
      });
  }

  autoScaler.incrementUsage(serviceName)

  serviceIndexes[serviceName] = (serviceIndexes[serviceName] + 1) % allInstances.length
  const instance = services[serviceName][serviceIndexes[serviceName]]

  res
    .status(200)
    .json(instance);
});

// Periodically check for expired services and remove them
setInterval(() => {
  const currentTime = Date.now();
  Object.keys(services).forEach(serviceName => {
    services[serviceName] = services[serviceName].filter(instance => {
      const lastHeartbeatTime = instance.lastHeartbeat
      if (currentTime - lastHeartbeatTime > serviceAliveTimeout) {
        logger.info({
          timestamp: new Date().toISOString(),
          message: `InstanceId: ${instance.instanceId}, Removing`,
        })
        return false;
      } else {
        return true;
      }
    })
  });
}, serviceCheckFrequency);

autoScaler.onStartUp()

setInterval(() => {
  autoScaler.checkAndScale(services)
  autoScaler.resetCount()
}, 20000)

app.listen(port, () => {
  console.log(`Service registry listening at http://localhost:${port}`);
});
