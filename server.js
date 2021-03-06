const Koa = require('koa')
const next = require('next')
const Router = require('@koa/router')
require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();


const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');

const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST } = process.env;
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');

const json = require('koa-json');
const koaBody = require('koa-body');
const serve = require('koa-static');
const cors = require('@koa/cors');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');

const {receiveWebhook, registerWebhook} = require('@shopify/koa-shopify-webhooks')


let mockDB = [];

app.prepare().then(() => {
  const server = new Koa()

  server.use(session({ secure: true, sameSite: 'none' }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];
  server.use(json())
  server.use(cors())

  const router = new Router()

  router.get('/a', async (ctx) => {
    await app.render(ctx.req, ctx.res, '/a', ctx.query)
    ctx.respond = false
  })

  // router.get('/', async (ctx) => {
  //   await app.render(ctx.req, ctx.res, '/index', ctx.query)
  //   ctx.respond = false 
  // })
  // router.get('/create', async (ctx) => {
  //   await app.render(ctx.req, ctx.res, '/create', ctx.query)
  //   ctx.respond = false 
  // })

  // API ROUTES
  //if you want to see all the banners you saved in the server
  router.get('/api/banners', koaBody(), async (ctx) => {
    ctx.body = {
      status: 200,
      message: 'Submitted Banner Data',
      data: mockDB
    }
  })
  router.post('/api/banners', koaBody(), async (ctx) => {

    // mockDB.push(ctx.request.body)
    //unshift adds the item to the beginning of the array
    mockDB.unshift(ctx.request.body)
    console.log(ctx.request.body)
    ctx.body = {
      status: 200,
      message: 'Submitted Banner Data',
      data: mockDB
    }
  })

 //   router.all('*', async (ctx) => {
 //     await handle(ctx.req, ctx.res)
 //     ctx.respond = false
 //   })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())

 
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products', 'read_script_tags', 'write_script_tags', 'read_analytics'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set('shopOrigin', shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
        const registration = await registerWebhook({
          address:`${HOST}/webhooks/products/create`,
          topic: 'PRODUCTS_CREATE',
          accessToken,
          shop,
          apiVersion: ApiVersion.October19
        });

        if(registration.success){
          console.log('Registered WebHook')
        }else{
          console.log('Failed Webhook Registration')
        }
        // ctx.redirect(`https://${shop}/admin/apps/newfunapp`);
        await getSubscriptionUrl(ctx, accessToken, shop);
      },
    }),
  );
  
  server.use(serve(__dirname + '/public'));

  //Webhooks
  //webhooks are used to get data/notifications on when a user creates a products, collection e.t.c
  const shopifyWebhook = receiveWebhook({secret: SHOPIFY_API_SECRET_KEY});

  router.post('/webhooks/products/create', shopifyWebhook, (ctx)=>{
    console.log('received webhook:', ctx.state.webhook)
  })

  server.use(graphQLProxy({version: ApiVersion.October19}));
  server.use(verifyRequest());

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})