/**
 * server.ts
 * Entrypoint for the server & configuration of all modules.
 * 2021-06-24
 */

import Koa from 'koa';

import BodyParser from 'koa-bodyparser';
import CORS from '@koa/cors';
import KoaJSON from 'koa-json';
import KoaSession from 'koa-session';
import Router from 'koa-router';
import websockify from 'koa-websocket';

import { createConnection } from 'typeorm';
import { DomainModel, LinkDomainModel, LinkModel } from './model';

import { Session } from './lib/Session';
import { loadAllDomain } from './lib/Domain';

import db_config from '../config/db.json';
import server_config from '../config/server.json';
import { IndexController, v1 } from './controller';

/************************************************
 * setup
 ************************************************/

const koaApp: Koa = new Koa();

const wsOptions = {};
const app = websockify(koaApp as any, wsOptions);

const router: Router = new Router();
const socket_router = new Router();

/************************************************
 * database
 ************************************************/

/**** mongo *****/

(async () => {
	createConnection({
		...db_config.mongo,
		type: 'mongodb',
		entities: [

		],
		useUnifiedTopology: true,
		synchronize: !server_config.production
	}).then((connection) => {
		(app.context as any).mongo = connection;
		// eslint-disable-next-line no-console
		console.log('connected to database: mongodb');
	}).catch((error) => {
		// eslint-disable-next-line no-console
		console.log(error);
	});
})();

/**** maria *****/

(async () => {
	createConnection({
		...db_config.maria,
		type: 'mariadb',
		entities: [
			DomainModel,
			LinkDomainModel,
			LinkModel
		],
		synchronize: !server_config.production
	}).then(async (connection) => {
		(app.context as any).maria = connection;
		// eslint-disable-next-line no-console
		console.log('connected to database: mariadb');

		await loadAllDomain({ db: connection }).then(() => {
			// eslint-disable-next-line no-console
			console.log('domains: success');
		}).catch(() => {
			// eslint-disable-next-line no-console
			console.log('domains: failure');
		});
	}).catch((error) => {
		// eslint-disable-next-line no-console
		console.log(error);
	});
})();

/************************************************
 * services
 ************************************************/

// TODO

/************************************************
 * middleware
 ************************************************/

app.keys = server_config.sessionKeys;

app.use(KoaSession({
	key: 'session',
	maxAge: 1000*60*60*24*30,
	renew: true
}, 
app
));

app.use(CORS({
	origin: '*',
	credentials: true
}));

app.use(KoaJSON({ pretty: false, param: 'pretty' }));

app.use(BodyParser());

/************************************************
 * ANCHOR authentication
 ************************************************/

(app.context as Koa.BaseContext & { state: Session }).state = {
	session_id: null,
	user_id: null,
	email: null
};

/************************************************
 * routes
 ************************************************/

{ /* root */
	const Root: Router = new Router();

	Root.use('', IndexController.routes());

	router.use('', Root.routes());
}

{ /* api/v1 */
	const APIv1: Router = new Router();

	APIv1.use('/l', v1.LinkController.routes());
	APIv1.use('/link', v1.LinkController.routes());

	router.use('/api/v1', APIv1.routes());
}

app.use(router.routes());

{ /* websocket */
	// socket_router.all('/', async (ctx) => {
	// });
}

app.ws.use(socket_router.routes() as any);

/************************************************
 * start server
 ************************************************/

app.listen(server_config.port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server listening: http://localhost:${server_config.port}`);
	// eslint-disable-next-line no-console
	console.log(`enviroment: ${app.env}`);
});



export default app;