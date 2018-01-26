const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')


const router = require('./routes/index')

// error handler

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(function* (next){
  const start = new Date();
  yield next;
  const ms = new Date() - start;
  console.log(`${this.method} ${this.url} - ${ms}ms`);
})

app.use(router.routes(false));

module.exports = app
