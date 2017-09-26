const mongoose = require('mongoose');
const mongo_user = require('../config/db_mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  email: { type: String, required: true },                      //用户邮箱
  username: { type: String, required: true },
  userpwd: { type: String, required: true },
  userage: { type: Number, required: false },
  status: { type: Number, required: true },
  city: { type: Schema.Types.ObjectId, ref: 'City' },
});

const CollectionName = 'users';
const UserModel = mongo_user.model(CollectionName, UserSchema);
module.exports = UserModel;