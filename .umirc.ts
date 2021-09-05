import { defineConfig } from 'umi';
import routes from './config/router';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
  // mfsu: {},
  proxy: {
    '/api': {
      target: 'http://localhost:3333',
      changeOrigin: true,
      // 'pathRewrite': { '^': '' },
    },
  },
});
