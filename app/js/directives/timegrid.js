define(['app'], function (app) {
    app.lazy.directive("timegrid", ['$window', function ($window) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                days: "=",
                hours: "=",
                resources: "=",
                selectedTimeslot: "=",
                stepType: "@" // values: quarter (1/4), half (1/2) and full (1/1), in hours
            },
            templateUrl: "/app/partials/directives/timegrid.html",
            link: function (scope, element, attrs) {
                scope.getContentWidth = function () {
                    var width = 0;

                    angular.forEach(element.find(".day"), function (item) {
                        var $item = angular.element(item);

                        width += $item.width();
                    });

                    return width;
                };

                scope.$watch(scope.getContentWidth, function (newValue, oldValue) {
                    element.find(".days").css("width", newValue);
                    element.find(".slider").css("width", newValue);
                }, true);

                element.bind('resize', function () {
                    scope.$apply();
                });
                
                if (!scope.days) {
                    var today = new Date();
                    scope.days = [today];
                }

                if (!scope.hours) {
                    scope.hours = new Array(24);
                }

                var numberOfSlots = scope.days.length * scope.hours.length;
                switch (scope.stepType) {
                    case "quarter":
                        numberOfSlots *= 4;
                        break;
                    case "half":
                        numberOfSlots *= 2;
                        break;
                    case "full":
                    default:
                        break;
                }

                scope.numberOfSlots = function () {
                    return numberOfSlots;
                };
            }
        };
    }]);
});