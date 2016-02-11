ClientKey = Astro.Class.create({
	name: 'ClientKey'
	, fields: {
		personal: {
			type: String
			, default: function () {
				return 'personal-' + Random.secret(43);
			}
		}
	}
});