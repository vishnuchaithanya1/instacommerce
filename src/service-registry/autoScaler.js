const { spawn } = require('child_process');

const hourlyUsageLimitPerInstance = 100

const basePaths = {
  'User-Management': '../User-Management-Service',
  Notification: '../Notification-Service',
  Seller: '../Seller-Service',
  Product: '../Product-Service',
  'Order-Management': '../Order-Management-Service',
  Payment: '../Payment-Service',
  Reviews: '../Reviews-Service',
  Cart: '../Cart-Service',
}

const basePortNos = {
  'User-Management': 5000,
  Notification: 5010,
  Seller: 5020,
  Product: 5030,
  'Order-Management': 5040,
  Payment: 5050,
  Reviews: 5060,
  Cart: 5070,
}

const portToChildMap = {}

function executeCommand(command, args, config) {
  console.log(command, args, config.env.PORT)
  const child = spawn(command, args, config);

  child.on('close', (code) => {
    if (code === 0) {
      // resolve();
      console.log('Command executed successfully');
    } else {
      // new Error(`Command failed with exit code ${code}`));
      console.log('Command failed');
    }
  });

  child.on('error', (err) => {
    // reject(err);
    console.log('Command failed', err);
  });
  return child
}

class autoScaler {
  static _usageCount = {}
  static _instances = {}

  static incrementUsage(serviceName) {
    if (!this._usageCount[serviceName]) {
      this._usageCount[serviceName] = 1
    }
    this._usageCount[serviceName] = this._usageCount[serviceName] + 1
  }

  static spinUpNewInstance(serviceName, instanceNumber) {
    const basePortNo = basePortNos[serviceName]
    const portNo = basePortNo + (instanceNumber - 1)
    console.log(`Spinning new instance of ${serviceName} on port ${portNo}`)

    const command = 'npm'
    const args = ['start']
    const config = {
      cwd: basePaths[serviceName],
      env: {
        ...process.env,
        PORT: portNo,
      },
      stdio: ['ignore', 'ignore', 'inherit'],
      shell: true,
    }
    const child = executeCommand(command, args, config)
    portToChildMap[portNo] = child
  }

  static spinDownInstance(serviceName, instanceNumber) {
    const basePortNo = basePortNos[serviceName]
    const portNo = basePortNo + (instanceNumber - 1)
    console.log(`Spinning down instance of ${serviceName} on port ${portNo}`)
    const child = portToChildMap[portNo]
    // console.log(child)
    child.kill('SIGTERM')
  }

  static checkAndScale(services) {
    console.log('Checking and scaling')
    Object.keys(basePaths).forEach(serviceName => {
      const usage = this._usageCount[serviceName] || 1;
      const noOfInstancesNeeded = Math.ceil(usage / hourlyUsageLimitPerInstance)
      const noOfInstances = services[serviceName].length

      console.log(`${serviceName}, needed: ${noOfInstancesNeeded}, present: ${noOfInstances}`)
      if (noOfInstancesNeeded > noOfInstances) {
        let i
        for (i = 0; i < noOfInstancesNeeded - noOfInstances; i = i + 1) {
          this.spinUpNewInstance(serviceName, noOfInstances + i + 1)
        }
      } else if (noOfInstancesNeeded < noOfInstances) {
        let i
        for (i = 0; i < noOfInstances - noOfInstancesNeeded; i = i + 1) {
          this.spinDownInstance(serviceName, noOfInstances - i)
        }
      }
    })
  }

  static onStartUp() {
    const services = Object.keys(basePaths)
    services.forEach(serviceName => {
      this.spinUpNewInstance(serviceName, 1)
    })
  }

  static resetCount() {
    this._usageCount = {}
  }
}

module.exports = autoScaler
