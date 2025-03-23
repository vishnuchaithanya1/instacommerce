const proxy = require("../proxy");
const ServiceRegistryClient = require("../utils/serviceRegistry");
const {
  extractSellerId,
  extractToken,
  verifySeller,
} = require("../utils/middleware");
const ProductRouter = require("express").Router();

ProductRouter.get("/all", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL("/api/product/all", baseUrl).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.get("/:id", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      `/api/product/${request.params.id}`,
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.post(
  "/add",
  extractToken,
  verifySeller,
  extractSellerId,
  async (request, response, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl("Product");
      const targetUrl = new URL("/api/product/add", baseUrl).toString();
      await proxy(request, response, targetUrl);
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.put(
  "/update/:id",
  extractToken,
  verifySeller,
  extractSellerId,
  async (request, response, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl("Product");
      const targetUrl = new URL(
        `/api/product/update/${request.params.id}`,
        baseUrl
      ).toString();
      await proxy(request, response, targetUrl);
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.delete(
  "/remove/:id",
  extractToken,
  verifySeller,
  extractSellerId,
  async (request, response, next) => {
    try {
      const baseUrl = await ServiceRegistryClient.getUrl("Product");
      const targetUrl = new URL(
        `/api/product/remove/${request.params.id}`,
        baseUrl
      ).toString();
      await proxy(request, response, targetUrl);
    } catch (error) {
      next(error);
    }
  }
);

ProductRouter.get("/filter/:category", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      `/api/product/filter/${request.params.category}`,
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.put("/buy", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      "/api/product/buy",
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

ProductRouter.put("/refund", async (request, response, next) => {
  try {
    const baseUrl = await ServiceRegistryClient.getUrl("Product");
    const targetUrl = new URL(
      "/api/product/refund",
      baseUrl
    ).toString();
    await proxy(request, response, targetUrl);
  } catch (error) {
    next(error);
  }
});

module.exports = ProductRouter;
