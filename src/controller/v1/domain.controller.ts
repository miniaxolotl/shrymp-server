import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { HttpStatus } from '../../lib';

import { findDomain, getAllDomain } from '../../lib/Domain';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.get('/', async (ctx: ParameterizedContext) => {

	const domain_list = await getAllDomain({ db: ctx.maria });
	
	if(domain_list) {
		ctx.status = HttpStatus.SUCCESS.OK.status;
		ctx.body = domain_list;
		return;
	} else {
		ctx.status = HttpStatus.CLIENT_ERROR.NOT_FOUND.status;
		ctx.body = HttpStatus.CLIENT_ERROR.NOT_FOUND.message;;
		return;
	}
});

router.get('/:domain_id', async (ctx: ParameterizedContext) => {

	const domain = await findDomain({ db: ctx.maria, domain_id: parseInt(ctx.params.domain_id) });

	if(domain) {
		ctx.status = HttpStatus.SUCCESS.OK.status;
		ctx.body = domain;
		return;
	} else {
		ctx.status = HttpStatus.CLIENT_ERROR.NOT_FOUND.status;
		ctx.body = HttpStatus.CLIENT_ERROR.NOT_FOUND.message;;
		return;
	}
});

export {
	router as DomainController
};