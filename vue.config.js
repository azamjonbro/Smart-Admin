const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: { 
    port: 9998, 
  },
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: "./",
      externals: ['mongoose', 'node-schedule'], 
      nodeModulesPath: ['./node_modules'], 
      nodeIntegration: true, 
      contextIsolation: false,
    }
  }
});
