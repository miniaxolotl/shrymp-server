import joi, { object } from 'joi';

export const LinkSchema = object({
	domain_id: joi.number()
		.default(0)
		.optional(),

	long_url: joi.string()
		.uri()
		.required(),

	tiny_url: joi.string()
		.uri()
		.default(null)
		.optional()
});