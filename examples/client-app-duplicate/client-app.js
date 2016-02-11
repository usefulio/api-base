if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.onCreated(function(){
  	this.autorun(function(){
  	  if(TodoAPI.status().connected){
  	  	TodoAPI.subscribe("tasks", Meteor.user() && Meteor.user()._id);
  	  }
  	});
  });

  Template.body.helpers({
  	connected: function () {
      return TodoAPI.status().connected;
    },
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return TodoAPI.Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return TodoAPI.Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return TodoAPI.Tasks.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      // Insert a task into the collection
      TodoAPI.call("addTask", text);

      // Clear form
      event.target.text.value = "";
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      TodoAPI.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      TodoAPI.call("deleteTask", this._id);
    },
    "click .toggle-private": function () {
      TodoAPI.call("setPrivate", this._id, ! this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}