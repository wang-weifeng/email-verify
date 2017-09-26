const Redis = require('ioredis');
const redisPort = 6379;
const redisHost = '127.0.0.1';
const redisFamily = 4;
const redisPassword = '';
const redisDb = 0;
const redis = new Redis({
    port: redisPort,          // Redis port
    host: redisHost,   // Redis host
    family: redisFamily,           // 4 (IPv4) or 6 (IPv6)
    password: redisPassword,
    db: redisDb
})

module.exports = redis;