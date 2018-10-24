require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')

const api = require('./api');
const mongoose = require('mongoose');

const {
	PORT: port = 4000,
	MONGO_URI: mongoURI
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

app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
	console.log('listening to port', port)
})