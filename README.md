# email-verify
现在的登陆系统除了第三方登陆接入以外，主要有短信登陆和邮箱登陆，按照现在实名制的特点，现在的短信登陆比较多，但是还是有一些会用到邮箱登陆的。
本文主要是关于邮箱登陆的相关案例，通俗的说就是用户使用邮箱注册，当注册成功时，会给注册用户发邮件进行激活，当然这个邮件有一定的时效性。当用户激活后可以正常使用相关的功能，没激活，当登陆时会提示没激活，是否需要在发送一条邮件激活。
## 1. 使用工具
> * node v8.5.0
> * mongodb
> * ioredis
> * postman
## 2. 项目结构
![项目结构图](https://github.com/wang-weifeng/picture/blob/master/email-verify/pro-jg.png)

图中说明了关键文件的含义
## 3. 用户注册接口
当用户注册时，首先检查必要字段是否传入以及邮箱密码是否符合规范，然后检查邮箱是否已注册，当注册成功时会发送一个邮件给用户用来激活这个账号，这个发送的邮件内容为一个链接，包含了这个用户的邮箱以及code，code使用reids设置了过期时间。（未激活时用户状态为0，激活状态为1）
路由routes中注册路由如下：
```js
 //user_regist
router.post('/user_regist', userCtrl.user_regist);
```
controllers中注册的部分代码如下：
```js
 	try {
		const user = await findUserAsyc({ 'useremail': user_email });//验证用户是否已注册
		if (user) {
			respondData.status = 10002;
			respondData.error = "邮箱已注册";
			return res.json(respondData);
		}
		//用户参数
		const userpassword = md5(user_password);
		const userInfo = {
			useremail: user_email,
			username: user_name,
			userpwd: userpassword,
			status: 0,
			create_time: Date.now('YYYY-MM-DD')
		};
		//新建用户
		console.log("newGuess.save userInfo-->" + JSON.stringify(userInfo));
		const newUser = new UserModel(userInfo);
		newUser.save(function (err, data) {
			if (err) {
				console.log("newGuess.save err-->" + JSON.stringify(err));
				respondData.status = "00001";
				respondData.error = "mongodb system error";
				return res.json(respondData);
			}
			console.log("newGuess.save data -->" + JSON.stringify(data));
			let userEmail = data.useremail;
			let sendEmail = sendUserEmail(userEmail);
			console.log("sendEmail:" + sendEmail);
			respondData.msg = "新用户注册成功 and 激活邮箱发送成功";
			return res.json(respondData);
		});
	} catch (error) {
		//错误处理
		console.log("controllers/UserController.js/user_regist error -->" + JSON.stringify(error));
		respondData.error = error;
		return res.json(respondData);
	}

```
邮箱发送部分代码
```js
	var config_email = {
		host: 'smtp.163.com',
		post: 25, // SMTP 端口
		//secureConnection: true, // 使用 SSL
		auth: {
			user: 'wangweifengyx@163.com',
			//这里密码不是qq密码，是你设置的smtp密码
			pass: 'wwf'
		}
	};
	var transporter = nodemailer.createTransport(config_email);

	var html = "<div>http://127.0.0.1:3000?code=" + code + "&account=" + cnd + "</div>";
	console.log(html);
	var data = {
		from: 'wangweifengyx@163.com', // 发件地址
		to: cnd, // 收件列表
		subject: 'Hello feng', // 标题

		//text: html // 标题 //text和html两者只支持一种
		html: html // html 内容
	};
	console.log(data);
	transporter.sendMail(data, function (err, info) {
		if (err) {
			return (err);
		}
		console.log(info.response);
		return (info.response);

	});
```
使用postman模拟注册
![postman模拟注册](https://github.com/wang-weifeng/picture/blob/master/email-verify/post-regist.png)

此时的截图正好把发送邮箱的消息也截取了，完美

用户没有激活时数据库中这条用户的status=0；如图：
数据库用户信息
![数据库用户信息](https://github.com/wang-weifeng/picture/blob/master/email-verify/db-wjh.png)

## 4. 用户邮箱激活
通过点击邮箱中的链接会激活邮箱，当邮箱和code不匹配时，会返回邮箱不匹配消息，当code过期时，会返回code过期消息，当用户已激活时，会告诉已激活，不要重复激活，当用户信息无上述的几种情况时会，提示激活成功。
路由routes中激活路由如下：
```js
//user_activation
router.get('/user_activation', userCtrl.user_activation);
```
controllers中注册的部分代码如下：
```js
	try {
		let codeVal = await Jtoken(code);
		if (!codeVal) {
			respondData.error = "code失效，请重新发送邮件激活";
			return res.json(respondData);
		}
		let userinfo = JSON.parse(codeVal);
		if (userinfo.userEmail !== user_email) {
			respondData.error = "邮箱不正确";
			return res.json(respondData);
		}
		const user = await findUserAsyc({ 'useremail': user_email });//验证用户是否已注册
		if (user) {
			if (user.status === 0) {
				UserModel.update({ 'useremail': user_email }, { '$set': { status: 1 } }, function (err, results) {
					if (err) {
						console.log("UserModel.update err-->" + JSON.stringify(err));
						respondData.status = "00001";
						respondData.error = "mongodb system error";
						return res.json(respondData);
					}
					respondData.msg = "邮箱激活成功";
					return res.json(respondData);
				})
			} else if (user.status === 1) {
				respondData.msg = "此邮箱已经激活了哦，不要重复激活";
				return res.json(respondData);
			}
		}
	} catch (error) {
		//错误处理
		console.log("controllers/UserController.js/user_regist error -->" + JSON.stringify(error));
		respondData.error = error;
		return res.json(respondData);
	}
```
使用postman模拟激活成功
![postman模拟激活成功](https://github.com/wang-weifeng/picture/blob/master/email-verify/code-success.png)
使用postman模拟激活code失效
![postman模拟激活code失效](https://github.com/wang-weifeng/picture/blob/master/email-verify/code-fail.png)

激活成功时数据库的用户信息
![激活成功时数据库的用户信息](https://github.com/wang-weifeng/picture/blob/master/email-verify/db-jh.png)
## 5. 用户登陆接口
当用户未激活时，登陆会告知未激活，需要去激活，当已激活时信息正常时会成功登陆，当成功登陆时会返回用户的一些信息以及加一个token。
路由routes中登陆路由如下：
```js
//user_login
router.post('/user_login', userCtrl.user_login);
```
controllers中登陆的部分代码如下：
```js
	try {
		const user = await findUserAsyc({ 'useremail': user_email });//验证用户是否已注册
		if (!user) {
			respondData.status = 10000;
			respondData.error = "邮箱未注册";
			return res.json(respondData);
		}
		const userverify = await findUserVerify(user_email,user_password);//验证用户
		if(!userverify){
			respondData.status = 10005;
			respondData.error = "邮箱或密码错误";
			return res.json(respondData);
		}
		console.log(userverify);
		if(userverify.status === 0){
			respondData.status = 10006;
			respondData.error = "邮箱未激活，请激活邮箱";
			return res.json(respondData);
		} else if(userverify.status === 1){
			const tokenexpiraton = 1800;
			const token = require('crypto').randomBytes(16).toString('hex');
			const tokenContent = {
				useremail: userverify.useremail,
				username: userverify.username
			};
			redis.set(token, JSON.stringify(tokenContent));
			redis.expire(token, tokenexpiraton);
			const userBackInfo = {};
			userBackInfo.token = token;
			userBackInfo.useremail = userverify.useremail;
			userBackInfo.username = userverify.username;
			userBackInfo._id = userverify._id;
			respondData.data.push(userBackInfo);
			respondData.msg = "登陆成功";
			return res.json(respondData);
		}	
	} catch (error) {
		//错误处理
		console.log("controllers/UserController.js/user_regist error -->" + JSON.stringify(error));
		respondData.error = error;
		return res.json(respondData);
	}
```

未激活登陆时
![未激活登陆时](https://github.com/wang-weifeng/picture/blob/master/email-verify/login-fail.png)

已激活登陆时
![已激活登陆时](https://github.com/wang-weifeng/picture/blob/master/email-verify/post-login.png)

## 6. 后续
目前来说只有注册，激活，登陆接口，后续也可以实现更多的功能，同时还没有测试，其实也可以加上测试的。

