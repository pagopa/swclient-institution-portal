import axios from 'axios';

export default class Utils {
	static checkTokenValidity = async () => {
		/* Decode the JWT token, check for its expiration date, if it's expired, get a new one. */
		const parseJwt = (token: string | null) => {
			if (typeof token == 'string') {
				try {
					return JSON.parse(atob(token.split('.')[1]));
				} catch (e) {
					return null;
				}
			}
		};
		const decodedJwt = parseJwt(sessionStorage.getItem('access_token'));
		console.log('TOKEN:' + decodedJwt?.exp * 1000);
		console.log(Date.now());
		if (decodedJwt?.exp * 1000 < Date.now()) {
			console.log('Refreshing token... ');
			await axios
				.post(
					'https://mil-d-apim.azure-api.net/mil-auth/token',
					{
						grant_type: 'client_credentials',
						client_id: 'b9d189ec-fc47-4792-8018-db914057d964',
						client_secret: '3674f0e7-d717-44cc-a3bc-5f8f41771fea',
					},
					{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
				)
				.then((res) => {
					sessionStorage.setItem('access_token', res.data.access_token);
					sessionStorage.setItem('expires_in', res.data.expires_in);
				})
				.catch((e) => {
					console.log(e);
				});
		}
	};
}
