// var methodMap = {
//   'create': 'POST',
//   'update': 'PUT',
//   'delete': 'DELETE',
//   'read':   'GET'
// };
(function(){
  var methodMap = {
    'create': 'POST',
    'update': 'POST',
    'delete': 'POST',
    'read':   'POST'
  };

  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.// 追加
    //var params = {type: type, dataType: 'json'};
    var params = {type: type, dataType: 'xml'}; // 追加

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/xml'; // 追加
      params.data = model.attributes;         // 追加
      //params.contentType = 'application/x-www-form-urlencoded';
      //params.data = JSON.stringify(model.toJSON());
    }

    // // For older servers, emulate JSON by encoding the request into an HTML-form.
    // if (Backbone.emulateJSON) {
    //   params.contentType = 'application/x-www-form-urlencoded';
    //   params.data = params.data ? {model: params.data} : {};
    // }

    // // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // // And an `X-HTTP-Method-Override` header.
    // if (Backbone.emulateHTTP) {
    //   if (type === 'PUT' || type === 'DELETE') {
    //     if (Backbone.emulateJSON) params.data._method = type;
    //     params.type = 'POST';
    //     params.beforeSend = function(xhr) {
    //       xhr.setRequestHeader('X-HTTP-Method-Override', type);
    //     };
    //   }
    // }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };
  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A url property or function must be specified');
  };  
})();

$(function(){

  var User = Backbone.Model.extend({

    defaults:{
      name: '',
    },

  });

  var UserCollection = Backbone.Collection.extend({
    model: User,

    initialize: function(data) {
      this.url = 'getuser';
    },

    parse: function(res) {
      var parsed = [];
      var $users = $(res).find('users');  

      $users.find('user').each(function(j) {
        parsed.push(new User({
          name: $(this).find('name').text(),
          team: $(this).find('team').text(),
        }));
      });
      return parsed;
    }
  });

  var UserListView = Backbone.View.extend({

    el: $('#users'),

    template: _.template($('#list-template').html()),

    initialize: function() {
      this.options.collection.bind('reset', this.render, this);
    },

    render: function(){
      var list = this.collection.toJSON();
      _.each(list, function(user){
        this.$el.append(this.template({user:user}));
      }, this);
      return this;
    },
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
        '': 'list',
    },

    list:function () {
      this.userList = new UserCollection();
      this.userListView = new UserListView({collection:this.userList});
      this.userList.fetch();
    },
  });
  router = new AppRouter();
  Backbone.history.start();
});