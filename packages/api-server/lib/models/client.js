Clients = new Mongo.Collection('clients');

Client = Astro.Class.create({
	name: 'Client'
	, collection: Clients
	, fields: {
		appId: {
			type: String
            , immutable: true
		}
		, key: {
			type: ClientKey
			, default: function () {
				return new ClientKey();
			}
		}
		, userId: {
			type: String
			, immutable: true
		}
	}
	, methods: {
		app: function () {
			return App.findOne(this.appId);
		}
		, regenerateKey: function () {
			this.key = new ClientKey();
		}
	}
});