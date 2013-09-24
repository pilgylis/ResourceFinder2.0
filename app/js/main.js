(function () {
	var app;
	require.config({
		paths: {
			jquery: '../../bower_components/jquery/jquery',
			angular: '../../bower_components/angular/angular',
			angularRoute: '../../bower_components/angular-route/angular-route',
			angularResource: '../../bower_components/angular-resource/angular-resource',
			angularSanitize: '../../bower_components/angular-sanitize/angular-sanitize',
			angularMocks: '../../bower_components/angular-mocks/angular-mocks',
			text: '../../bower_components/requirejs-text/text'
		},
		baseUrl: 'app/js',
		shim: {
			'jquery': {
				'exports':'jquery'
			},
			'angular' : {
				deps:['jquery'],
				'exports' : 'angular'
			},
			'angularRoute': ['angular'],
			'angularResource': ['angular'],
			'angularSanitize': ['angular'],
			'angularMocks': {
				deps:['angular'],
				'exports':'angular.mock'
			},
			'app': {
				deps: ['angular', 'angularRoute', 'angularResource', 'angularSanitize'],
				'exports':'app',
				init: function (a) {
					app = this.app;
				}
			}
		},
		priority: [
			"angular"
		]
	});

	// hey Angular, we're bootstrapping manually!
	window.name = "NG_DEFER_BOOTSTRAP!";
	
	var modules = [
	    "jquery", 
	    "angular", 
	    "angularRoute", 
	    "angularResource", 
    	"text",
    	"routes",
		"app"
	];
	
	var progress = 10; // the progress meter
	
	var bootstrapped = false;
	var loadModule = function (lastResult) {
		var module = modules.shift();
		if (module) {
			require([module], function (a) {
				loadModule(a);
			});
		} else {
		}
		
		progress += 8;
		if (window.$) { // make sure jquery is loaded
	        $("#splash").find(".meter").css("width", progress + "%");
	    }
	    
	    if (window.$ && window.angular && !module && !bootstrapped) { // make sure jquery and angular are loaded
	    	var $html = angular.element(document.getElementsByTagName('html')[0]);
    
			angular.element().ready(function() {
				$html.addClass('ng-app');
				angular.bootstrap($html, [lastResult['name']]);
			});
			
			bootstrapped = true;
	    }
	};
	
	loadModule();
})();
