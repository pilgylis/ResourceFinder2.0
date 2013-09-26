define(['app', "services/resourceService"], function (app) {
    app.lazy.controller("resourcesController", ['$scope', 'resourceService', function ($scope, resourceService) {
        $scope.resources = resourceService.query({ page: 0 });

        $scope.timeslots = new Array(24);

        var today = new Date();
        var getDay = function (date) {
            var dd = date.getDate();
            var mm = date.getMonth() + 1; //January is 0!

            var yyyy = date.getFullYear();
            return dd + '/' + mm + '/' + yyyy;
        };

        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        $scope.days = [getDay(today)];
	}]);
});