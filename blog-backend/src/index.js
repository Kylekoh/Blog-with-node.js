require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');

const api = require('./api');
const mongoose = require('mongoose');

const {
	PORT: port = 4000,
	MONGO_URI: mongoURI,
	COOKIE_SIGN_KEY: signKey
} = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI).then(() => {
	console.log('connected to mongodb');
}).catch((e) => {
	console.log(e);
});

const app = new Koa();
const router = new Router();

//라우터 설정
router.use('/api', api.routes());

// 라우터 적용 전에 먼저 bodyParser 적용
app.use(bodyParser());

// 세션/키 적용
const sessionConfig = {
	maxAge: 86400000, // 하루
	// signed: true(기본으로 설정되어 있습니다)
};

app.use(session(sessionConfig, app));
app.keys = [signKey];

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
	console.log('listening to port', port)
})