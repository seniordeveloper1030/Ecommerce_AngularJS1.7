'use strict';

sealurmealApp.service('Authentication', function ($rootScope, $http, $location, Session) {
    
    var loginConfirmed = function(){
        $rootScope.loadingAccount = false;
        var nextLocation = ($rootScope.requestedUrl ? $rootScope.requestedUrl : "/recommended");
        $rootScope.authenticated = true;
        $location.path(nextLocation).replace();
    }

    var getAccountDetails = function() {
        $http.get($rootScope.hostAddress + 'security/account')
            .then(function(response) {
                alert("asdf")
                loginConfirmed();
                console.log(response.data);
                Session.create(response.data);
            });
    }

    var getUserDetails = function() {
        $http.get($rootScope.hostAddress + 'engine/getUserDetails')
        .success(function(response) {
            $rootScope.userDetails = response.userDetails;
            console.log($rootScope.userDetails);
        })
    }

    this.getAccount = function() {
        $rootScope.loadingAccount = true;
        getAccountDetails();
        getUserDetails();
    };

    this.login = function(username, password) {
        $rootScope.authErrorMessage = null;
        var config = {
            ignoreAuthModule: 'ignoreAuthModule',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        };
        $http.post($rootScope.hostAddress + 'authenticate', $.param({
            username: username,
            password: password
        }), config)
            .success(function (data, status, headers, config){
   
                $rootScope.authErrorMessage = null;
                getAccountDetails();
                getUserDetails();
            })
            .error( function(data, status, headers, config) {
                $rootScope.authenticationError = true;
                $rootScope.authErrorMessage = "Invalid credentials";
                Session.invalidate();
            });
    };

    this.isAuthorized = function(authorizedRoles) {
        if(authorizedRoles == '*'){
            return true;
        }
        var isAuthorized = false;
        if(!!Session.user){
            for(var i = 0 ; i < authorizedRoles.length ; i++){
                if(authorizedRoles[i] == Session.user.role) {
                    isAuthorized = true;
                    break;
                }
            }
        }
        return isAuthorized;
    }

    this.logout = function() {
        $rootScope.authenticationError = false;
        $rootScope.authenticated = false;
        Session.invalidate();
        $http.get($rootScope.hostAddress + 'logout');
        $location.path('/login').replace();
    }

});