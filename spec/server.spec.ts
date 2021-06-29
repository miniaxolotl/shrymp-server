import fetch from 'node-fetch';
import config from '../config/server.json'
// import app from "../../src/server";


describe('The server started properly', () => {
	it('Server has started.', () => {
		// expect(0).toBe(200);
		return fetch(`http://localhost:${config.port}`).then(data => {
			expect(data.status).toBe(200);
		});
	})
});