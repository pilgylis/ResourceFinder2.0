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
	            'controllers/resourcesController',
                'directives/timegrid',
                'directives/slider'
	        ]
	    },
	}
};

});