Apps = new Mongo.Collection('apps');

App = Astro.Class.create({
	name: 'App'
	, collection: Apps
	, fields: {
		key: {
			type: Key
			, default: function () {
				return new Key();
			}
		}
	}
	, methods: {
		regenerateKey: function () {
			this.key = new Key();
		}
	}
});