/**
 * server.ts
 * Entrypoint for the server & configuration of all modules.
 * 2021-06-24
 */

import Koa from 'koa';

import CORS from '@koa/cors';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import KoaJSON from 'koa-json';
import KoaSession from 'koa-session';
import websockify from 'koa-websocket'

import { createConnection } from "typeorm";
import { DomainModel, LinkDomainModel, LinkModel } from './model';
//  import * as ModelsMysql from './model/mysql';
//  import * as ModelsMongo from './model/mongo';

import { Session } from './lib/Session';

import server_config from "../config/server.json";
import db_config from "../config/db.json";
import { v1 } from './controller';

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
		type: "mongodb",
		entities: [

		],
		useUnifiedTopology: true,
		synchronize: !server_config.production,
	}).then((connection) => {
		(app.context as any).mongo = connection;
		console.log("connected to database: mongodb");
	}).catch((error) => {
		console.log(error);
	});
})();

/**** maria *****/

(async () => {
	createConnection({
		...db_config.maria,
		type: "mariadb",
		entities: [
			DomainModel,
			LinkDomainModel,
			LinkModel
		],
		synchronize: !server_config.production,
	}).then((connection) => {
		(app.context as any).maria = connection;
		console.log("connected to database: mariadb");
	}).catch((error) => {
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

app.keys = server_config.crypt.sessionKeys;

app.use(KoaSession({
		key: 'session',
		maxAge: 1000*60*60*24*30,
		renew: true,
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
	email: null,
};

/************************************************
 * routes
 ************************************************/

{
	const ping: Router = new Router();
	ping.all("/", (ctx) => {
		ctx.body = 'Pong!'
	});
	router.use("/ping", ping.routes());
}

{ /* api/v1 */
	const APIv1: Router = new Router();

	APIv1.use("/link", v1.LinkController.routes());

	router.use("/api/v1", APIv1.routes());
}

app.use(router.routes());

{ /* websocket */
	socket_router.all('/', async (ctx: any) => {
		// do something
	});
}

app.ws.use(socket_router.routes() as any);

/************************************************
 * start server
 ************************************************/

app.listen(server_config.port, () => {
	console.log(`Server listening: http://localhost:${server_config.port}`);
	console.log(`enviroment: ${app.env}`);
});



export default app;