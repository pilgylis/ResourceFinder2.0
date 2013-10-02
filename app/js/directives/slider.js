define(['app'], function (app) {
    app.lazy.directive("slider", ["$timeout", function ($timeout) {
        inputEvents = {
            mouse: {
                start: 'mousedown',
                move: 'mousemove',
                end: 'mouseup'
            },
            touch: {
                start: 'touchstart',
                move: 'touchmove',
                end: 'touchend'
            }
        };

        return {
            restrict: "E",
            replace: true,
            scope: {
                stepCount: "=",
                selectedLow: "=ngModelSelectedLow",
                selectedHigh: "=ngModelSelectedHigh",
                selectionChanged: "&"
            },
            templateUrl: "/app/partials/directives/slider.html",
            compile: function (element, attrs) {
                return {
                    post: function (scope, element, attrs) {
                        var selection = element.find(".selection");
                        var low = element.find(".low");
                        var high = element.find(".high");
                        var pointerHalfWidth = low[0].offsetWidth / 2;
                        var stepWidth;
                        var isDragging = false;

                        var calculateSelection = function (containerWidth) {
                            var left = stepWidth * scope.selectedLow;
                            var width = (stepWidth) * (scope.selectedHigh - scope.selectedLow);
                            selection.css("left", left);
                            selection.css("width", width);

                            low.css("left", left - pointerHalfWidth);
                            high.css("left", left + width - pointerHalfWidth);
                        };

                        var calculatePosition = function () {
                            if (isDragging) return;

                            var containerWidth = element[0].offsetWidth;
                            var stepCount = scope.stepCount;
                            stepWidth = containerWidth / stepCount;

                            calculateSelection(containerWidth);
                        };
                        
                        if (!scope.stepCount) scope.stepCount = 24;
                        
                        scope.$watch("selectedLow", calculatePosition);
                        scope.$watch("selectedHigh", calculatePosition);

                        // dragging

                        var ngDocument = angular.element(document);

                        var bindPointer = function (pointer, method, target) {
                            // events of the dragging
                            var onStart, onMove, onEnd;

                            var events = inputEvents[method];

                            onEnd = function (event) {
                                pointer.removeClass('active');
                                ngDocument.unbind(events.move);
                                isDragging = false;
                                calculatePosition();
                                return ngDocument.unbind(events.end);
                            };
                            onMove = function (event) {
                                var eventX, newOffset, newPercent, newValue;

                                eventX = event.clientX || event.touches[0].clientX;
                                
                                var newOffset = eventX - element[0].getBoundingClientRect().left;

                                if (target == 'selectedLow') {
                                    var oldLeft = selection[0].offsetLeft;
                                    selection.css("left", newOffset);
                                    selection.css("width", selection[0].offsetWidth + (oldLeft - newOffset));
                                } else {
                                    selection.css("width", newOffset - selection[0].offsetLeft);
                                }
                                pointer.css("left", newOffset - pointerHalfWidth);

                                var newValue = Math.round(newOffset / stepWidth);
                                scope[target] = newValue;

                                if (scope.selectionChanged) {
                                    scope.selectionChanged()({
                                        target: target,
                                        value: newValue
                                    });
                                }

                                return scope.$apply();
                            };
                            onStart = function (event) {
                                isDragging = true;
                                pointer.addClass('active');
                                event.stopPropagation();
                                event.preventDefault();
                                ngDocument.bind(events.move, onMove);
                                return ngDocument.bind(events.end, onEnd);
                            };

                            pointer.bind(inputEvents[method].start, onStart);
                        };                        

                        var inputMethods = ['touch', 'mouse'];
                        var pointers = {
                            "selectedLow": low,
                            "selectedHigh": high
                        };
                        var doBinding = function () {
                            angular.forEach(pointers, function (pointer, key) {
                                angular.forEach(inputMethods, function (method) {
                                    bindPointer(pointer, method, key);
                                });                                
                            });
                        };

                        var updateDom = function () {
                            calculatePosition();
                            doBinding();
                        };
                        $timeout(updateDom);
                        element.bind("resize", updateDom);
                    }
                };
            }
        };
    }]);
});