define([], function() {
	'use strict';

return {
	defaultRoutePath: "/",
	routes: {
	    "/": {
	        templateUrl: 'resources.html',
	        title: "Resources",
	        dependencies: [
	            'controllers/resourcesController'
	        ]
	    },
	}
};

});