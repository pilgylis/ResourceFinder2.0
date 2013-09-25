define(["app"], function (app) {
    app.lazy.factory('resourceService', ["$resource", "$rootScope", function ($resource, $rootScope) {
        var resourceManager = $resource("/webapi/resources/page/:page.json",
            {page: "@page"},
            {
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        return angular.fromJson(data).list
                    },
                    isArray: true
                }
            });

        var optionsTemplate = {
            page: 0
        };

        var service = {
            query: function () {
                var options = arguments.length > 0 ? arguments[0] : null;
                var callback = arguments.length > 1 ? arguments[1] : null;

                var mOption = angular.extend({}, optionsTemplate);
                mOption = angular.extend(mOption, options);
                var page = options.page || 0;

                return resourceManager.query({page: page});
            }
        };

        return service;
    }]);
});