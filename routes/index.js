const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ref');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const UserSchema = new Schema({
  username: { type: String },
  userpwd: { type: String },
  userage: { type: Number },
  city: { type: Schema.Types.ObjectId, ref: 'City' },
});
const CitySchema = new Schema({
  name: { type: String },
  state: { type: Schema.Types.ObjectId, ref: 'State' }
});
const StateSchema = new Schema({
  name: { type: String },
  country: { type: Schema.Types.ObjectId, ref: 'Country' }
});
const CountrySchema = new Schema({
  name: { type: String }
});
const User = mongoose.model('User', UserSchema);
const City = mongoose.model('City', CitySchema);
const State = mongoose.model('State', StateSchema);
const Country = mongoose.model('Country', CountrySchema);
/* GET home page. */
router.post('/v1/ref', (req, res, next) => {
  const user_getCountryList = async function (req, res) {
    console.log("/v1/ref start -->" + JSON.stringify(req.body));
    try {
      const respondData = {
        status: res.statusCode,
        data: {},
        error: {}
      };
      const username = req.body.username;
      const userpwd = req.body.userpwd;
      const userage = req.body.userage;
      const usercityname = req.body.usercityname;
      const userstatename = req.body.userstatename;
      const usercountryname = req.body.usercountryname;
      const userInfoCountry = await findUserCountry({ name: usercountryname }, usercountryname);//查看国家
      const userInfoState = await findUserState({ name: userstatename }, userstatename);//查看州
      const userInfoCity = await findUserCity({ name: usercityname }, usercityname);//查看城市
      const userInfo = await findUser({ username: username, }, username, userpwd, userage);//查看用户信息
      const updateInfoUser = await updateUser({ _id: userInfo }, userInfoCity);//更新用户信息
      const updateInfoCity = await updateCity({ _id: userInfoCity }, userInfoState);//更新城市信息
      const updateInfoState = await updateState({ _id: userInfoState }, userInfoCountry);//更新州信息
      return res.json(respondData);
    }
    catch (error) {
      //错误处理
      console.log("userCity error -->" + JSON.stringify(error));
      respondData.error = error;
      return res.json(respondData);
    }
  }
  const findUserCountry = async function (cnd, country) {
    console.log("findUserCountry start --> " + JSON.stringify(cnd));
    return new Promise(function (resolve, reject) {
      Country.findOne(cnd, function (error, data) {
        console.log("findUserCountry findOne  data --> " + JSON.stringify(data));
        if (error) {
          return reject(error);
        }
        if (data) {
          return resolve(data._id);
        } else {
          const userCountry = new Country({
            name: country
          });
          userCountry.save(function (err, data) {
            if (err) {
              console.log("userCountry.save err-->" + JSON.stringify(err));
              return reject(err);
            }
            console.log("userCountry-->" + JSON.stringify(data));
            return resolve(data._id);
          });
        }
      });
    })
  }
  const findUserState = async function (cnd, state) {
    console.log("findUserState start --> " + JSON.stringify(cnd));
    return new Promise(function (resolve, reject) {
      State.findOne(cnd, function (error, data) {
        console.log("findUserState findOne  data --> " + JSON.stringify(data));
        if (error) {
          return reject(error);
        }
        if (data) {
          return resolve(data._id);
        } else {
          const userState = new State({
            name: state
          });
          userState.save(function (err, data) {
            if (err) {
              console.log("userState.save err-->" + JSON.stringify(err));
              return reject(err);
            }
            console.log("userState-->" + JSON.stringify(data));
            return resolve(data._id);
          });
        }
      });
    })
  }
  const findUserCity = async function (cnd, city) {
    console.log("findUserCity start --> " + JSON.stringify(cnd));
    return new Promise(function (resolve, reject) {
      City.findOne(cnd, function (error, data) {
        console.log("findUserCity findOne  data --> " + JSON.stringify(data));
        if (error) {
          return reject(error);
        }
        if (data) {
          return resolve(data._id);
        } else {
          const userCity = new City({
            name: city
          });
          userCity.save(function (err, data) {
            if (err) {
              console.log("userCity.save err-->" + JSON.stringify(err));
              return reject(err);
            }
            console.log("userCity-->" + JSON.stringify(data));
            return resolve(data._id);
          });
        }
      });
    })
  }
  const findUser = async function (cnd, username, userpwd, userage) {
    console.log("findUser start --> " + JSON.stringify(cnd));
    return new Promise(function (resolve, reject) {
      User.findOne(cnd, function (error, data) {
        console.log("findUser findOne  data --> " + JSON.stringify(data));
        if (error) {
          return reject(error);
        }
        if (data) {
          return resolve(data._id);
        } else {
          const userInfo = new User({
            username: username,
            userpwd: userpwd,
            userage: userage
          });
          userInfo.save(function (err, data) {
            if (err) {
              console.log("userInfo.save err-->" + JSON.stringify(err));
              return reject(err);
            }
            console.log("userInfo-->" + JSON.stringify(data));
            return resolve(data._id);
          });
        }
      });
    })
  }
  const updateUser = async function (cnd, cityid) {
    console.log("updateUser start --> " + JSON.stringify(cnd));
    return new Promise(function (resolve, reject) {
      User.update(cnd, { $set: { city: cityid } }, function (error, data) {
        console.log("updateUser findOne  data --> " + JSON.stringify(data));
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    })
  }
  const updateCity = async function (cnd, stateid) {
    console.log("updateCity start --> " + JSON.stringify(cnd));
    return new Promise(function (resolve, reject) {
      City.update(cnd, { $set: { state: stateid } }, function (error, data) {
        console.log("updateCity findOne  data --> " + JSON.stringify(data));
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    })
  }
  const updateState = async function (cnd, countryid) {
    console.log("updateState start --> " + JSON.stringify(cnd));
    return new Promise(function (resolve, reject) {
      State.update(cnd, { $set: { country: countryid } }, function (error, data) {
        console.log("updateState findOne  data --> " + JSON.stringify(data));
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    })
  }
  user_getCountryList(req, res);
});

router.get('/v1/getInfo', (req, res, next) => {
  const respondData = {
    status: res.statusCode,
    data: [],
    error: {}
  };
  let user_name = req.query.username;
  User.find({ username: user_name })
    .populate('city')
    .exec(function (err, docs) {
      City.find({ _id: docs[0].city._id })
        .populate('state')
        .exec(function (err, doc) {
          State.find({ _id: doc[0].state._id })
            .populate('country')
            .exec(function (err, result) {
              const userInfo = {};
              userInfo.username = docs[0].username;
              userInfo.userpwd = docs[0].userpwd;
              userInfo.userage = docs[0].userage;
              userInfo.usercity = doc[0].name;
              userInfo.userstate = result[0].name;
              userInfo.usercountry = result[0].country.name;
              respondData.data.push(userInfo);
              return res.json(respondData);
            })
        })
    });
})
router.get('/v1/getInfot', (req, res, next) => {
  const respondData = {
    status: res.statusCode,
    data: [],
    error: {}
  };
  let user_name = req.query.username;
  User.find({ username: "wwf" })
    .populate('city')
    .exec(function (err, docs) {
      console.log(docs);
      console.log(docs.length);
      respondData.data.push(docs);
      return res.json(respondData);
    });
})

module.exports = router;
