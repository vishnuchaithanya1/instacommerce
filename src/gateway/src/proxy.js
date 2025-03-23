const httpProxy = require('http-proxy');
const { CustomError } = require('./utils/error');

const proxyServer = httpProxy.createProxyServer();

const proxy = async (req, res, targetUrl) => {
  const promise = new Promise((resolve, reject) => {
    req.url = '/'

    res.on('finish', () => {
      resolve()
    })

    proxyServer.web(req, res, { target: targetUrl }, error => {
      const e = new CustomError(`Proxy Error ${error}`, 500, true)
      reject(e)
    });
  });
  await promise
}

module.exports = proxy
