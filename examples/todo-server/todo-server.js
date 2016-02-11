if(Meteor.isClient){

	Template.body.onCreated(function () {
		this.subscribe('apps');
	});

	Template.body.helpers({
		apps: function () {
			return API.App.find();
		}
	});

	Template.body.events({
		'click .new-app': function (e, tmpl) {
			Meteor.call('newApp', function(err){
				if(err){
					console.error('Error creating new app.');
					console.error(err);
				}
			})
		}
	});

}

if(Meteor.isServer){

	Meteor.publish('apps', function () {
		// XXX obviously should check if this is 
		// a real user logged into the UX of your
		// api server
		return API.App.find();
	});

	Meteor.methods({
		newApp: function () {
			var app = new API.App();
			return app.save();
		}
	});
	
}