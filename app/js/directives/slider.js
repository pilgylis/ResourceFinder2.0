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
            compile: function (element, attrs) {
                return {
                    post: function (scope, element, attrs) {
                        var calculateSelection = function (containerWidth, stepWidth) {
                            var selection = element.find(".selection");
                            selection.css("left", stepWidth * scope.ngModelSelected.startSlot);
                            selection.css("width", (stepWidth) * (scope.ngModelSelected.endSlot - scope.ngModelSelected.startSlot));
                        };

                        var calculatePosition = function () {
                            var containerWidth = element[0].offsetWidth;
                            var stepCount = scope.stepCount()();
                            var stepWidth = containerWidth / stepCount;

                            calculateSelection(containerWidth, stepWidth);
                        };
                        
                        if (!scope.stepCount) scope.stepCount = 24;

                        $timeout(calculatePosition);
                        element.bind("resize", calculatePosition);
                    }
                };
            }
        };
    }]);
});