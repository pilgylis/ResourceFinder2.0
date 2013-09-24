define([
	'angular',
	'routes',
	], function (angular, routes) {
		'use strict';

		var app = angular.module('rf2', [
			'ngRoute', 'ngResource'
		]);
		
		var isProduction = false;
		var defaultDependencies = [];
		var baseUrl = "/";
	    var baseCodeUrl = "/app/";
	    var baseTemplateUrl = baseCodeUrl + "partials/";
		app.config(
        [
            '$routeProvider',
            '$locationProvider',
            '$controllerProvider',
            '$compileProvider',
            '$filterProvider',
            '$provide',

            function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
                app.lazy =
                {
                    controller: $controllerProvider.register,
                    directive: $compileProvider.directive,
                    filter: $filterProvider.register,
                    factory: $provide.factory,
                    service: $provide.service,
                    provide: $provide
                };

                $locationProvider.html5Mode(true);


                //var baseScriptUrl = baseCodeUrl + "Scripts/";

                var registerRoute = function (route, path) {
                    $routeProvider.when(baseUrl + path, {
                        templateUrl: baseTemplateUrl + route.templateUrl,
                        caseInsensitiveMatch: true,
                        resolve: {
                            resolver: ['$q', '$rootScope', function ($q, $rootScope) {
                                var deferred = $q.defer();

                                if (route.title) {
                                    $rootScope.title = route.title;
                                }

                                // fix dependencies
                                var mergedDependencies = $.merge($.merge([], defaultDependencies), route.dependencies);
                                var dependencies = [];
                                angular.forEach(mergedDependencies, function (item) {
                                    if (isProduction && item && item[0] != '/') {
                                        item = item + ".min";
                                    }

                                    dependencies.push(item);
                                });

                                require(dependencies, function () {
                                    $rootScope.$apply(function () {
                                        deferred.resolve();
                                    });
                                });

                                return deferred.promise;
                            }]
                        }
                    });
                };
                if (routes.routes !== undefined) {
                    angular.forEach(routes.routes, function (route, path) {
                        registerRoute(route, path);
                    });
                }

                if (routes.defaultRoutePaths !== undefined) {
                    $routeProvider.otherwise({ redirectTo: baseUrl + routes.defaultRoutePaths });
                }

                app.lazy.registerRoute = registerRoute;
            }
        ]);
        
        return app;
});
