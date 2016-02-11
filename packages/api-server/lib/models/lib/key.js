Key = Astro.Class.create({
	name: 'Key'
	, fields: {
		public: {
			type: String
			, default: function () {
				return 'public-' + Random.secret(43);
			}
		}
		, private: {
			type: String
			, default: function () {
				return 'private-' + Random.secret(43);
			}
		}
	}
});