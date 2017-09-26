/**
 * 项目的验证工具类
 */

  /**
   * 验证邮箱
   */
  exports.verify_email = function (email) {
    const is_email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return is_email.test(email);
  }
  
  /**
   * 密码验证，必须是6-16位数字或字母组成
   */
  exports.verify_password = function (password) {
    const is_password = /^[0-9a-zA-Z`~!@#$%^&*()-_+=\{\}\[\]\;\:\"\'\?\/\\]{6,16}$/;
    return is_password.test(password);
  }