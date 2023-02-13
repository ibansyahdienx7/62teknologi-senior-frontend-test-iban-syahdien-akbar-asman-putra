const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(
    createProxyMiddleware("/businesses/search", {
      target: "https://api.yelp.com/v3",
      changeOrigin: true,
    })
  );
};
