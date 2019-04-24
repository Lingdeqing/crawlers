const Router = require('koa-better-router');

const router = Router({prefix: '/users'}).loadMethods();

router.get('/', (ctx, next) => {
  ctx.body = 'this is a users response!';
});

router.get('/bar', (ctx, next) => {
  ctx.body = 'this is a users/bar response!';
});

module.exports = router;

