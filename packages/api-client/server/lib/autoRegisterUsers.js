API.onInitialization(function (api) {
  Meteor.startup(function () {
    var selector = {};
    selector[api.options.apiName + "PersonalKey"] = { $exists: false };
    Meteor.users.find(selector).observe({
      added: function newUserRegistration (user) {
        api.registerClient(user._id);
      }
    });  
  });
});
