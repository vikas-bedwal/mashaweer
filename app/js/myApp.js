// To run this code, edit file
// index.html or index.jade and change
// html data-ng-app attribute from
// angle to myAppName
// -----------------------------------

//var App = angular.module('myAppName', ['angle']);


/*{
    "text": "Reports",
    "sref": "app.reports",
    "icon": "fa fa-newspaper-o"
},*/

var App = angular.module('AppName', ['angle', 'uiGmapgoogle-maps']);

App.config(['uiGmapGoogleMapApiProvider', function (GoogleMapApi) {
    GoogleMapApi.configure({
//    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
}]);


App.run(["$log", function ($log) {

    $log.log('I\'m a line from custom.js');

}]);

App.constant("MY_CONSTANT", {
    "url": " http://52.6.230.125:8002/"
});
App.constant("MY_CONSTANT1", {
    "url": "http://maps.googleapis.com/maps/api/geocode/json"
});
App.constant("responseCode", {
    "SUCCESS": 200
});
App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // default route
       /* $urlRouterProvider.otherwise('/app/rewardBrands');*/
        $urlRouterProvider.otherwise('page/login');
        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons', 'parsley'),
                controller: ["$rootScope", function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                templateUrl: 'app/pages/login.html'
            })
            .state('page.register', {
                url: '/register',
                title: "Register",
                templateUrl: 'app/pages/register.html'
            })
            .state('page.recover', {
                url: '/recover',
                title: "Recover",
                templateUrl: 'app/pages/recover.html'
            })
            .state('page.terms', {
                url: '/terms',
                title: "Terms & Conditions",
                templateUrl: 'app/pages/terms.html'
            })
            .state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: 'app/pages/404.html'
            })

            //App routes
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: helper.resolveFor('modernizr', 'icons', 'screenfull')
            })
            .state('app.dashboard', {
                url: '/dashboard',
                title: 'Dashboard',
                templateUrl: helper.basepath('dashboard.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.customers', {
                url: '/customers',
                title: 'Customers',
                templateUrl: helper.basepath('customers.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins', 'ngDialog','parsley')
            })
            .state('app.drivers', {
                url: '/drivers',
                title: 'Drivers',
                templateUrl: helper.basepath('drivers.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.orders', {
                url: '/orders',
                title: 'Orders',
                templateUrl: helper.basepath('orders.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.payment', {
                url: '/payment',
                title: 'Payment',
                templateUrl: helper.basepath('payment.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.reports', {
                url: '/reports',
                title: 'Reports',
                templateUrl: helper.basepath('reports.html')
                //resolve: helper.resolveFor()
            })
            .state('app.pricing', {
                url: '/pricing',
                title: 'Pricing',
                templateUrl: helper.basepath('pricing.html'),
                resolve: helper.resolveFor('xeditable','ngDialog')
            })
            .state('app.subscription', {
                url: '/subscription',
                title: 'Subscription',
                templateUrl: helper.basepath('subscription.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.addSubscription', {
                url: '/add_subscription',
                title: 'Subscription',
                templateUrl: helper.basepath('addSubscription.html'),
                resolve: helper.resolveFor('parsley')
            })
            .state('app.promo', {
                url: '/promotion',
                title: 'Promotion',
                templateUrl: helper.basepath('promo.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.addPromo', {
                url: '/add_promo',
                title: 'Add Promo',
                templateUrl: helper.basepath('addPromo.html'),
                resolve: helper.resolveFor('parsley')
            })
            .state('app.placeOrder', {
                url: '/add_order',
                title: 'Add Order',
                templateUrl: helper.basepath('placeOrder.html'),
                resolve: helper.resolveFor('parsley','ngDialog','ui.select')
            })
            .state('app.dispatcher', {
                url: '/dispatcher',
                title: 'Dispatcher',
                templateUrl: helper.basepath('dispatcher.html'),
                resolve: helper.resolveFor('ngDialog','datatables', 'datatables-pugins')
            })
            .state('app.details', {
                url : "/{id:[0-9]*}",
                title: 'Details',
                templateUrl: helper.basepath('')
            })
            //
            // CUSTOM RESOLVES
            //   Add your own resolves properties
            //   following this object extend
            //   method
            // -----------------------------------
            // .state('app.someroute', {
            //   url: '/some_url',
            //   templateUrl: 'path_to_template.html',
            //   controller: 'someController',
            //   resolve: angular.extend(
            //     helper.resolveFor(), {
            //     // YOUR RESOLVES GO HERE
            //     }
            //   )
            // })
        ;


    }]);

App.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [],
                componentRestrictions: {}
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    model.$setViewValue(element.val());
                });
            });
        }
    };
});
