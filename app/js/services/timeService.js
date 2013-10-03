define(['app'], function (app) {
    app.lazy.factory("TimeService", ["$rootScope", "$parse", function ($rootScope, $parse) {
        var hours = new Array(24);

        var startDay = new Date(); // today
        startDay = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate());
        var numberOfDays = 2;
        
        var tempDate = new Date(startDay.getTime());
        var days = [];
        for (var i = 0; i < numberOfDays; i++) {
            days.push(new Date(tempDate.getTime()));

            // advance the date
            tempDate.setDate(tempDate.getDate() + 1);
        }
                
        var stepType = 'full'; // values: quarter, half, full

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

        var timeToSlot = function (date) {
            var dateIndex = getDateIndex(date);
            if (dateIndex >= 0) {
                return Math.round((dateIndex * hours.length * 60 + (date.getHours() * 60 + date.getMinutes())) / getSlotLength());
            }

            return -1;
        };

        var slotToTime = function (slot) {
            var minutes = slot * getSlotLength();
            return new Date(startDay.getTime() + minutes * 60 * 1000);
        };

        var startTime = new Date(startDay.getTime());
        startTime.setHours(7);
        startTime.setMinutes(0);

        var endTime = new Date(startDay.getTime());
        endTime.setHours(8);
        endTime.setMinutes(0);
        
        var startSlot = timeToSlot(startTime), endSlot = timeToSlot(endTime);

        var selectedTime = {
            start: startTime,
            end: endTime
        }
        
        $rootScope.startTime = startTime;
        $rootScope.endTime = endTime;
        
        return {
            hours: hours,
            days: days,
            selectedTime: selectedTime,
            stepType: stepType,
            timeToSlot: timeToSlot,
            slotToTime: slotToTime
        };
    }]);
});