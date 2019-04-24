const Router = require('koa-better-router');

const router = Router({prefix: '/zhihu'}).loadMethods();

const queries = {};
router.post('/collect/:id', async (ctx, next) => {
    const id = ctx.params.id;
    if(!queries[id]){
        queries[id] = [];
    }
    const items = JSON.parse(ctx.request.body);
    queries[id].push(...items);
    ctx.body = {
        code: 0
    }
});

router.get('/list/:id', async (ctx, next) => {
    const id = ctx.params.id;
    await ctx.render('zhihu', {
        title: '搜索结果!!!',
        items: queries[id]
    });

    // 一天后删除记录
    setTimeout(function(){
        queries[id] = null;
    }, 1000*60*60*24);
})


module.exports = router;

