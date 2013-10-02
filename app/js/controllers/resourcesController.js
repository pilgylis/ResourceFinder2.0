define(['app', "services/resourceService", "services/timeService"], function (app) {
    app.lazy.controller("resourcesController", ['$scope', 'ResourceService', 'TimeService', function ($scope, ResourceService, TimeService) {
        $scope.resources = ResourceService.query({ page: 0 });
        
        $scope.hours = TimeService.hours;
        $scope.days = TimeService.days;
        $scope.selectedTime = TimeService.selectedTime;

        // time picker
        $scope.stepType = TimeService.stepType;

        $scope.hourStep = 1;
        switch ($scope.stepType) {
            case 'quarter':
                $scope.minuteStep = 15;
                break;
            case 'half':
                $scope.minuteStep = 30;
                break;
            case 'full':
            default:
                $scope.minuteStep = 0;
                break;
        }

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.minDate = ($scope.minDate) ? null : new Date();
	}]);
});