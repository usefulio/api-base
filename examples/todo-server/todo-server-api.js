if (Meteor.isServer) {
	Tasks = new Mongo.Collection('tasks');

	// Perhaps you would want to do something special
	// here, or simply implement the functionality and
	// save the document so that your API clients can
	// securely use direct collection methods on collections
	// hosted by you, which would be cool.
	API.interceptCollection(Tasks, {
		insert: function (task) {
			console.log('intercepted Task.insert', task);
			throw new Meteor.Error('lol', 'Nice try, but you must use the provided `addTask` method.');
		}
	});

	API.publish("tasks", function(userId) {
		// ignore.userId request for now
		return Tasks.find({
			appId: this.connection.identity.appId,
			$or: [
				{ private: false },
				{ owner: this.connection.identity.userId }
			]
		});
	});

	API.methods({
		addTask: function (text) {
			console.log('addTask', this.connection.identity.userId);
			// Make sure the user is logged in before inserting a task
			if (!this.connection.identity || !this.connection.identity.userId) {
				throw new Meteor.Error("not-authorized");
			}

			Tasks.insert({
				appId: this.connection.identity.appId,
				text: text,
				createdAt: new Date(),
				private: false,
				owner: this.connection.identity.userId
			});
		},
		deleteTask: function (taskId) {
			var task = Tasks.findOne({
				_id: taskId,
				appId: this.connection.identity.appId
			});
			if (task.private && task.owner !== this.connection.identity.userId) {
			  // If the task is private, make sure only the owner can delete it
			  throw new Meteor.Error("not-authorized");
		  }

		  Tasks.remove(taskId);
		},
		setChecked: function (taskId, setChecked) {
			var task = Tasks.findOne({
				_id: taskId,
				appId: this.connection.identity.appId
			});
			if (task.private && task.owner !== this.connection.identity.userId) {
			  // If the task is private, make sure only the owner can check it off
			  throw new Meteor.Error("not-authorized");
		  }

		  Tasks.update(taskId, { $set: { checked: setChecked} });
		},
		setPrivate: function (taskId, setToPrivate) {
			var task = Tasks.findOne({
				_id: taskId,
				appId: this.connection.identity.appId
			});

			// Make sure only the task owner can make a task private
			if (task.owner !== this.connection.identity.userId) {
				throw new Meteor.Error("not-authorized");
			}

			Tasks.update(taskId, { $set: { private: setToPrivate } });
		}
	});  
}
