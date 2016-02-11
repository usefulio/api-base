Identity = Astro.Class.create({
	name: 'Identity'
	, fields: {
		appId: {
			type: String
		}
		, clientId: {
			type: String
			, optional: true
		}
		, userId: {
			type: String
			, optional: true
		}
		, privileged: {
			type: Boolean
		}
		, connectionId: {
			type: String
		}
	}
	, methods: {
		app: function () {
			return App.findOne(this.appId);
		}
		, client: function () {
			return Client.findOne(this.clientId);
		}
	}
});