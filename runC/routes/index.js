const co = require('co');
const Router = require('koa-express-router');

const fileTools = require('./file')();

Router.defaultOptions.mergeParams = true;
const router = new Router();

router.post('/code', co.wrap(function* (ctx, next) {
  const filename = fileTools.getRandomFilename();
  
  // create C file
  let result = yield fileTools.writeCFileAsync(filename, ctx.request.body.code);
  if (result.success === false) {
    result.stderr = 'Internal Server Error';
    ctx.body = result;
    ctx.status = 500;
    return next;
  }

  // compile C code
  result = yield fileTools.compileCFileByFilenameAsync(filename);
  if (result.success === false) {
    ctx.body = result;
    return next;
  }

  // run C code
  result = yield fileTools.execCFileByFilenameAsync(filename);
  ctx.body = result;
  return next;
}));



module.exports = router;
