define([], function() {
	'use strict';

return {
	defaultRoutePath: "/",
	routes: {
	    "/": {
	        templateUrl: 'resources.html',
	        title: "Resources",
	        dependencies: [
                'services/resourceService',
                'services/timeService',
	            'controllers/resourcesController',
                'directives/timegrid',
                'directives/slider'
	        ]
	    },
	}
};

});