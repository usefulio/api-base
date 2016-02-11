API.onInitialization(function (api) {
  Meteor.publish(null, function () {
    var fields = {};
    fields[api.options.apiName + "PersonalKey"] = 1;
    return Meteor.users.find(this.userId, {
      fields: fields
    });
  });  
});
