TodoAPI = API;
CONFIG;
var DEFAULT_SERVER_URL = "http://my.api:3000"
	, API_NAME = "todoAPI";

if (Meteor.isClient) {
	CONFIG = Meteor.settings.public['todo-api'];
	CONFIG.server = DEFAULT_SERVER_URL;
	CONFIG.apiName = API_NAME;
	API.configure(CONFIG);
}

if (Meteor.isServer) {
	CONFIG = Meteor.settings['todo-api'];
	CONFIG.server = DEFAULT_SERVER_URL;
	CONFIG.apiName = API_NAME;
	API.configure(CONFIG);
}

_.extend(TodoAPI, {
	Tasks: new Mongo.Collection('tasks', { connection: API.connection })
});