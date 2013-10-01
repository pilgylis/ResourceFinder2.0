define(['app'], function (app) {
    app.lazy.factory("TimeService", ["$rootScope", function ($rootScope) {
        var hours = new Array(24);
        var today = new Date();

        var tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        var days = [today, tomorrow];
        
        var stepType = 'half'; // values: quarter, half, full

        var getSlotLength = function () {
            if (stepType == 'quarter') return 15;
            if (stepType == 'half') return 30;
            return 60;
        };

        var getDateIndex = function (date) {
            var result;
            angular.forEach(days, function (day, index) {
                if (result) return;
                if (day && day.getDate && day.getDate() == date.getDate()) result = index;
            });

            return result;
        };

        var getSlot = function (date) {
            var dateIndex = getDateIndex(date);
            if (dateIndex >= 0) {
                return Math.round((dateIndex * hours.length * 60 + (date.getHours() * 60 + date.getMinutes())) / getSlotLength());
            }

            return -1;
        };

        var startTime = new Date();
        startTime.setHours(7);
        startTime.setMinutes(0);

        var endTime = new Date();
        endTime.setHours(8);
        endTime.setMinutes(0);

        $rootScope.selectedTimeslot = function () {
            return {
                start: startTime,
                end: endTime,
                stepType: stepType
            };
        };

        var startSlot, endSlot;

        var calculateSlots = function () {
            startSlot = getSlot(startTime);
            endSlot = getSlot(endTime);
        };

        calculateSlots();
        $rootScope.$watch("selectedTimeslot", calculateSlots);

        return {
            hours: hours,
            days: days,
            selectedTimeslot: {
                start: startTime,
                end: endTime,
                startSlot: startSlot,
                endSlot: endSlot
            },
            stepType: stepType
        };
    }]);
});