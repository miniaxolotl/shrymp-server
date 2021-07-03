import fetch from 'node-fetch';

import config from '../config/server.json';

describe('The server started properly', () => {
	it('Server has started.', async () => {
		const data = await fetch(`http://localhost:${config.port}/ping`);
		expect(data.status).toBe(200);
		expect(await data.text()).toBe('Pong!');
	});
});