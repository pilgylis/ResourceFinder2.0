define(['app', "services/timeService"], function (app) {
    app.lazy.directive("timegrid", ['$window', 'TimeService', function ($window, TimeService) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                days: "=",
                hours: "=",
                resources: "=",
                selectedTime: "=",
                stepType: "@" // values: quarter (1/4), half (1/2) and full (1/1), in hours,
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

                var daysContainer = element.find(".days");
                var slider = element.find(".slider");

                scope.$watch(scope.getContentWidth, function (newValue, oldValue) {
                    daysContainer.css("width", newValue);
                    slider.css("width", newValue);
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

                scope.numberOfSlots = numberOfSlots;

                scope.startSlot = TimeService.timeToSlot(scope.selectedTime.start);
                scope.endSlot = TimeService.timeToSlot(scope.selectedTime.end);

                scope.$watch("selectedTime.start", function () {
                    scope.startSlot = TimeService.timeToSlot(scope.selectedTime.start);
                });

                scope.$watch("selectedTime.end", function () {
                    scope.endSlot = TimeService.timeToSlot(scope.selectedTime.end);
                });

                scope.selectionChanged = function (eventArgs) {
                    var timeValue = TimeService.slotToTime(eventArgs.value);
                    if (eventArgs.target == 'selectedLow') {
                        if (timeValue < scope.selectedTime.end) {                            
                            scope.selectedTime.start = timeValue;
                        } else {
                            scope.startSlot = TimeService.timeToSlot(scope.selectedTime.start);
                        }
                    } else { // 'selectedHigh'
                        if (timeValue > scope.selectedTime.start) {
                            scope.selectedTime.end = timeValue;
                        } else {
                            scope.endSlot = TimeService.timeToSlot(scope.selectedTime.end);
                        }
                    }
                };
            }
        };
    }]);
});