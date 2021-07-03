import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { HttpStatus } from '../lib';
import { findTinyLink } from '../lib/Link';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.all('/ping', (ctx) => {
	ctx.body = 'Pong!';
});

router.get('/:tiny_url', async (ctx: ParameterizedContext) => {

	const link_data = await findTinyLink({ db: ctx.maria, tiny_url: ctx.params.tiny_url });

	if(link_data && link_data.long_url) {
		ctx.status = HttpStatus.REDIRECTION.PERMANENT.status;
		ctx.header.location = `${link_data.long_url}`;
		ctx.redirect(link_data.long_url);
		return;
	} else {
		ctx.status = HttpStatus.CLIENT_ERROR.NOT_FOUND.status;
		ctx.body = HttpStatus.CLIENT_ERROR.NOT_FOUND.message;
		return;
	}
});


export {
	router as IndexController
};