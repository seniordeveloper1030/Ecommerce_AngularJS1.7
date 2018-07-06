'use strict';

var sealurmealApp = angular
    .module('sealurmealApp', ['ngResource', 'ngRoute', ,'ngCookies', 'http-auth-interceptor', 'ngAnimate', 'angular-spinkit', 'ui.router']);


sealurmealApp.constant('USER_ROLES', {
    all: '*',
    admin: 'ADMIN',
    user: 'ROLE_USER',
    client: 'ROLE_CLIENT',
    support: 'ROLE_SUPPORT',
    restaurant: 'ROLE_RESTAURANT'
});

sealurmealApp.config(function ($routeProvider, USER_ROLES) {

    $routeProvider
    .when("/recommended", {
        templateUrl: "views/recommended.html",
        controller: 'RecommendationController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.all]
        }
    })
    .when('/', {
        redirectTo: '/recommended',
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthenticationController',
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    })
    .when('/changePassword', {
        templateUrl: 'views/change-password.html',
        controller: 'AuthenticationController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.all]
        }
    })
    .when('/menu/:menuName', {
        templateUrl: 'views/menu.html',
        controller: 'MenuController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.user]
        }
    })
    .when('/menu/item/:itemId', {
        templateUrl: 'views/menu-item.html',
        controller: 'MenuController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.user]
        }
    })
    .when('/cart', {
        templateUrl: 'views/cart.html',
        controller: 'CartController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.user]
        }
    })
    .when('/order/:orderId', {
        templateUrl: 'views/track-order.html',
        controller: 'OrderController',
        access: {
            loginRequired: true,
            authorizedRoles: [USER_ROLES.user]
        }
    })
    .when('/loading', {
        templateUrl: 'views/loading.html',
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    })
    .when("/logout", {
        templateUrl: "views/logout.html",
        controller: "AuthenticationController",
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    })
    .when("/verify", {
        templateUrl: "views/verify.html",
        controller: "VerifyController",
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    })
    .when("/forgotPassword", {
        templateUrl: "views/forgot-password.html",
        controller: "AuthenticationController",
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    })
    .when("/error/:code", {
        templateUrl: "views/error.html",
        controller: "ErrorController",
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    })
    .otherwise({
        redirectTo: '/error/404',
        access: {
            loginRequired: false,
            authorizedRoles: [USER_ROLES.all]
        }
    });
})
.config(['$stateProvider', function($stateProvider, USER_ROLES) {
    $stateProvider
    .state({
        name: 'recommended',
        templateUrl: 'views/recommended.html',
        url: '/recommended',
        controller: 'RecommendationController',
        access: {
            loginRequired: true,
            authorizedRoles: ['ROLE_USER']
        }
    })
    .state({
        name: 'menu',
        templateUrl: 'views/menu.html',
        url: '/menu/{menuName}',
        controller: 'MenuController',
        access: {
            loginRequired: true,
            authorizedRoles: ['ROLE_USER']
        }
    })
    .state({
        name: 'menuItem',
        templateUrl: 'views/menu-item.html',
        url: '/menu/item/{itemId}',
        controller: 'MenuController',
        access: {
            loginRequired: true,
            authorizedRoles: ['ROLE_USER']
        }
    })
    .state({
        name: 'cart',
        templateUrl: 'views/cart.html',
        url: '/cart',
        controller: 'CartController',
        access: {
            loginRequired: true,
            authorizedRoles: ['ROLE_USER']
        }
    })
    .state({
        name: 'trackOrder',
        templateUrl: 'views/track-order.html',
        url: '/order/{orderId}',
        controller: 'OrderController',
        access: {
            loginRequired: true,
            authorizedRoles: ['ROLE_USER']
        }
    })
    .state({
        name: 'changePassword',
        templateUrl: 'views/change-password.html',
        url: '/changePassword',
        controller: 'AuthenticationController',
        access: {
            loginRequired: true,
            authorizedRoles: ['ROLE_USER']
        }
    })
    .state({
        name: 'forgotPassword',
        templateUrl: 'views/forgot-password.html',
        url: '/forgotPassword',
        controller: 'AuthenticationController',
        access: {
            loginRequired: false,
            authorizedRoles: ['ROLE_USER']
        }
    });
}])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}]);

sealurmealApp.run(function ($rootScope, $location, $http, $cookies, Authentication, $q) {
	
    $rootScope.hostAddress = "http://52.15.84.55:8090/";
    //$rootScope.hostAddress = "http://localhost:8090/";
    
    //delete $http.defaults.headers.common['X-Requested-With'];

    $rootScope.$on('$routeChangeStart', function (event, next) {
        if(next.originalPath === "/login" && $rootScope.authenticated) {
            event.preventDefault();
        } else if (next.access && next.access.loginRequired && !$rootScope.authenticated) {
            event.preventDefault();
            $rootScope.$broadcast("event:auth-loginRequired", {});
        } else if (next.access && !Authentication.isAuthorized(next.access.authorizedRoles)) {
            event.preventDefault();
            $rootScope.$broadcast("event:auth-forbidden", {});
        }
    });

    $rootScope.$on('$routeChangeSuccess', function (scope, next, current) {
        $rootScope.$evalAsync(function () {
            //$.material.init();
        });
    });

    // Call when the 401 response is returned by the server
    $rootScope.$on('event:auth-loginRequired', function (event, data) {
    	if($location.$$path.indexOf("verify") !== -1){
    		return;
    	}
        if ($rootScope.loadingAccount && data.status !== 401) {
            $rootScope.requestedUrl = $location.path()
            $location.path('/loading');
        } else {
            $rootScope.authenticated = false;
            $rootScope.loadingAccount = false;
            $location.path('/login');
        }
    });

    // Call when the 403 response is returned by the server
    $rootScope.$on('event:auth-forbidden', function (rejection) {
        $rootScope.$evalAsync(function () {
            $location.path('/error/403').replace();
        });
    });

    // Get already authenticated user account
    Authentication.getAccount();

});