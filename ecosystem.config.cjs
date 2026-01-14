module.exports = {
  apps: [
    {
      name: 'SeleSele',
      port: '8030',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        PORT: 8030
      }
    }
  ]
}
