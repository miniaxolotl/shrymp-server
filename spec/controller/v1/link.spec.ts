import fetch from 'node-fetch';
import qs from 'querystring';

import config from '../../../config/server.json'

const baseURL = `http://localhost:${config.port}/api/v1`;
const longURL = `https://emawa.io/`;

describe('Link Controller', () => {
	it('Successfully create a link', async () => {
		const request = {
			longURL
		};

		const data = await fetch(`${baseURL}/link`, {
			method: 'POST',
			body: qs.stringify(request),
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		});
		
		// expect(data.status).toBe(201);
		expect(data.headers.get('content-type')).toBe(/json/);
	})
});