'use strict';

sealurmealApp.controller('VerifyController', function($rootScope, $scope, $http, $routeParams, DataService) {
    
    $scope.onLoad = function() {
		var mail = $routeParams.mail;
		var token = $routeParams.token;

		$rootScope.loadingAccount = true;
		var body = {
			mail: mail,
			token: token
		};
		$scope.passwordSetSuccess = false;
		$http.post($rootScope.hostAddress + 'verify', body, {})
    		.success(function (response) {
	    		$rootScope.loadingAccount = false;
	    		$scope.invalidToken = false;
	    		$scope.verificationErrorMessage = "";
	    		$scope.passwordErrorMessage = "";
	    		if(response.code != 0){
	    			$scope.invalidToken = true;
	    			$scope.verificationErrorMessage = response.message;
	    		}
    	});
	}

	$scope.submit = function() {
		var password = $scope.password;
		var passwordConfirm = $scope.passwordConfirm;
		if(!!!password){
			$scope.passwordErrorMessage = "Password field cannot be empty";
			return;
		}
		if(!!!passwordConfirm){
			$scope.passwordErrorMessage = "Confirm Password field cannot be empty";
			return;
		}
		if(password !== passwordConfirm){
			$scope.passwordErrorMessage = "Passwords donot match";
			return;
		}
		var mail = $routeParams.mail;
		var token = $routeParams.token;
		var body = {
			mail: mail,
			token: token,
			password: password
		}
		$http.post($rootScope.hostAddress + 'setPassword', body, {})
			.success(function (response) {
    			$rootScope.loadingAccount = false;
    			$scope.passwordSetSuccess = true;
		});
	}
});