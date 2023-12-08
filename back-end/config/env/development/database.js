module.exports =  ({ env }) => ({
	connection: {
		client: 'mysql',
		connection: {
		host: env('DATABASE_HOST', 'localhost'),
			port: env.int('DATABASE_PORT', 3306),
			database: env('DATABASE_NAME', 'platform-db'),
			user: env('DATABASE_USERNAME', 'kayfo'),
			password: env('DATABASE_PASSWORD', 'Kayfo2019'),
			ssl: env.bool('DATABASE_SSL', false)
		}
	}
});
