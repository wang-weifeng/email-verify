/**
 * 加密工具类
 */
const Crypto = require('crypto');

/**
 * MD5加密
 */
exports.md5 = function (str) {
  const md5_obj = Crypto.createHash('md5');
  md5_obj.update(str);

  //返回md5字符串
  const md5_str = md5_obj.digest('hex');
  return md5_str;
}

/**
 * sha1加密
 */
exports.sha1 = function (str) {
  const sha1 = Crypto.createHash('sha1');
  sha1.update(str);

  const sha_str = sha1.digest('hex');
  return sha_str;
}