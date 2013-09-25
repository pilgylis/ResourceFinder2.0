define(['app', "services/resourceService"], function (app) {
    app.lazy.controller("resourcesController", ['$scope', 'resourceService', function ($scope, resourceService) {
        $scope.resources = resourceService.query({page: 0});
	}]);
});