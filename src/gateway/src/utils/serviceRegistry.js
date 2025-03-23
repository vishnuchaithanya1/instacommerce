const axios = require('axios');
const config = require('../config');
const { CustomError } = require('./error');

/**
 * usable functions:
 * - getUrl: get the url of a service, given the service name.
 */
class ServiceRegistryClient {
  static async getUrl(serviceName) {
    try {
      const response = await axios.get(`${config.SERVICE_REGISTRY_BASE_URI}/discover/${serviceName}`);
      const url = `http://${response.data.host}:${response.data.port}`
      return url;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new CustomError(`Service ${serviceName} not found`, 500, true)
      }
      throw new Error(`Error discovering service: ${error.message}`);
    }
  }
}

module.exports = ServiceRegistryClient;
