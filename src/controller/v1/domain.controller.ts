import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { HttpStatus } from '../../lib';

import { findTinyLink } from '../../lib/Link';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.get('/', async (ctx: ParameterizedContext) => {

	const link_data = await findTinyLink({ db: ctx.maria, tiny_url: ctx.params.tiny_url });

	if(link_data) {
		ctx.status = HttpStatus.SUCCESS.OK.status;
		ctx.body = link_data;
		return;
	} else {
		ctx.status = HttpStatus.CLIENT_ERROR.NOT_FOUND.status;
		ctx.body = HttpStatus.CLIENT_ERROR.NOT_FOUND.message;;
		return;
	}
});

router.get('/:domain_id', async (ctx: ParameterizedContext) => {

	const link_data = await findTinyLink({ db: ctx.maria, tiny_url: ctx.params.tiny_url });

	if(link_data) {
		ctx.status = HttpStatus.SUCCESS.OK.status;
		ctx.body = link_data;
		return;
	} else {
		ctx.status = HttpStatus.CLIENT_ERROR.NOT_FOUND.status;
		ctx.body = HttpStatus.CLIENT_ERROR.NOT_FOUND.message;;
		return;
	}
});

export {
	router as LinkController
};