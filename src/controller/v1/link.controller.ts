import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

import { HttpStatus } from '../../lib';
import { LinkSchema } from '../../schema';

import { createLink, findTinyLink, saveLink } from '../../lib/Link';
import { findDomain, findDomainByLink } from '../../lib/Domain';

const router: Router = new Router();

/************************************************
 * routes
 ************************************************/

router.get('/:tiny_url', async (ctx: ParameterizedContext) => {

	const link_data = await findTinyLink({ db: ctx.maria, tiny_url: ctx.params.tiny_url });
	
	if(link_data && link_data.id) {
		const domain_data = await findDomainByLink({ db: ctx.maria, link_id: link_data.id });
		
		if(domain_data && domain_data.id) {
			ctx.status = HttpStatus.SUCCESS.OK.status;
			ctx.body = {
				domain: domain_data.domain,
				long_url: link_data.long_url,
				tiny_url: link_data.tiny_url,
				create_date: link_data.create_date
			};
			return;
		} else {
			ctx.status = HttpStatus.CLIENT_ERROR.NOT_FOUND.status;
			ctx.body = HttpStatus.CLIENT_ERROR.NOT_FOUND.message;;
			return;
		}
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
		const exists = await findTinyLink({ db: ctx.maria, tiny_url: value.tiny_url });
		if(!exists) {
			const newLink = createLink({
				long_url: value.long_url,
				tiny_url: value.tiny_url
			});
			const result = await saveLink({
				db: ctx.maria,
				newLink: newLink,
				domain_id: value.domain_id
			});
			const domain_data = await findDomain({ db: ctx.maria, domain_id: value.domain_id });
			if(result && domain_data) {
				ctx.status = HttpStatus.SUCCESS.CREATED.status;
				ctx.body = {
					domain: domain_data.domain,
					long_url: newLink.long_url,
					tiny_url: newLink.tiny_url,
					create_date: newLink.create_date
				};
				return;
			} else {
				ctx.status = HttpStatus.SERVER_ERROR.INTERNAL.status;
				ctx.body = HttpStatus.SERVER_ERROR.INTERNAL.message;;
				return;
			}
		} else {
			ctx.status = HttpStatus.CLIENT_ERROR.CONFILCT.status;
			ctx.body = HttpStatus.CLIENT_ERROR.CONFILCT.message;;
			return;
		}
	}
});

export {
	router as LinkController
};