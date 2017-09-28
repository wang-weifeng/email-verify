//校验token and code
const redis = require('../config/db_redis');

exports.tokenValidation = function (token) {
    return new Promise(function (resolve, reject) {
        console.log(token);
        redis.get(token, function (err, reply) {
            if (err) {
                console.log(err);
                return reject(err);
            } else {
                console.log(reply);
                return resolve(reply);
            }
        });
    })
}