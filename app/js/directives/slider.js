define(['app'], function (app) {
    app.lazy.directive("slider", ["$timeout", function ($timeout) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                stepCount: "&",
                ngModelSelected: "="
            },
            templateUrl: "/app/partials/directives/slider.html",
            link: function (scope, element, attrs) {

                var calculateSelection = function (containerWidth, stepWidth) {
                    var selection = element.find(".selection");
                    selection.css("left", stepWidth * scope.ngModelSelected.start);
                    selection.css("right", (stepWidth + 1) * scope.ngModelSelected.start);
                };
                
                var calculatePosition = function () {
                    var containerWidth = element[0].offsetWidth;
                    var stepCount = scope.stepCount()();
                    var stepWidth = containerWidth / stepCount;

                    calculateSelection(containerWidth, stepWidth);
                };

                return {
                    post: function (scope, element, attrs) {
                        if (!scope.ngModelSelected) {
                            scope.ngModelSelected = {
                                start: 0,
                                end: 2
                            };
                        }

                        if (!scope.stepCount) scope.stepCount = 24;

                        $timeout(calculatePosition);
                        element.bind("resize", calculatePosition);
                    }
                };
            }
        };
    }]);
});