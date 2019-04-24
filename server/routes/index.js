const Router = require('koa-better-router');

const router = Router().loadMethods();

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello World Koa!'
  })
});

router.get('/foo',async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello World foo!'
  });
});

module.exports = router;

