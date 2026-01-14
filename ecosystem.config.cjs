module.exports = {
  apps: [
    {
      name: 'sele-sele-fe',
      port: '8030',
      script: './.output/server/index.mjs',
      env: {
        PORT: 8030
      }
    }
  ]
}
