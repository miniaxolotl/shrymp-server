import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { HttpStatus } from '../../lib';
import { LinkSchema } from '../../schema';

import { createTinyLink, findTinyLink, saveTinyLink } from '../../lib/Link';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.get('/:tiny_url', async (ctx: ParameterizedContext) => {

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

router.post('/', async (ctx: ParameterizedContext) => {

	const body = ctx.request.body;

	const { value, error } = LinkSchema.validate(body, {
		abortEarly: false,
		errors: { escapeHtml: true }
	});

	if(error) {
		ctx.status = HttpStatus.CLIENT_ERROR.BAD_REQUEST.status;
		ctx.body = { errors: [] };
		error.details.forEach(e => { (ctx.body as any).errors.push(e.message); });
		return;
	} else {
		const newLink = createTinyLink({ long_url: value.long_url });
		const result = await saveTinyLink({ db: ctx.maria, newLink: newLink });
		
		if(result) {
			ctx.status = HttpStatus.SUCCESS.CREATED.status;
			ctx.body = newLink;
			return;
		} else {
			ctx.status = HttpStatus.SERVER_ERROR.INTERNAL.status;
			ctx.body = HttpStatus.SERVER_ERROR.INTERNAL.message;;
			return;
		}
	}
});

export {
	router as LinkController
};