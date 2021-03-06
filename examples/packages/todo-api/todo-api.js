TodoAPI = new API();
CONFIG;
var DEFAULT_SERVER_URL = "http://my.api:3000"
	, API_NAME = "todoAPI";

if (Meteor.isClient) {
	CONFIG = Meteor.settings.public['todo-api'];
	CONFIG.server = DEFAULT_SERVER_URL;
	CONFIG.apiName = API_NAME;
	TodoAPI.configure(CONFIG);
}

if (Meteor.isServer) {
	CONFIG = Meteor.settings['todo-api'];
	CONFIG.server = DEFAULT_SERVER_URL;
	CONFIG.apiName = API_NAME;
	TodoAPI.configure(CONFIG);
}

_.extend(TodoAPI, {
	Tasks: TodoAPI.collection('tasks')
});