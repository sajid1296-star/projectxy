module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/products/ankauf',
      handler: 'product.ankauf',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 