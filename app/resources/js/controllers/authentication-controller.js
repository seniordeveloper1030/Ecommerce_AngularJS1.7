'use strict';

sealurmealApp.controller('AuthenticationController', function ($rootScope, $scope, $http, Authentication) {

	$scope.login = function () {
        $rootScope.authenticationError = false;
        $rootScope.loadingAccount = true;
		Authentication.login(
			$scope.username,
			$scope.password,
		);
	}
	
	$scope.changePassword = function() {
		$scope.successMessage = null;
		if($scope.oldPassword == null || $scope.oldPassword == undefined || $scope.oldPassword == "") {
			$scope.errorMessage = "Old Password cannot be empty";
			return;
		}
		if($scope.newPassword == null || $scope.newPassword == undefined || $scope.newPassword == "") {
			$scope.errorMessage = "New Password cannot be empty";
			return;
		}
		if($scope.newPassword != $scope.newPasswordCopy) {
			$scope.errorMessage = "New password donot match";
			return;
		}
		var body = {
			oldPassword: $scope.oldPassword,
			newPassword: $scope.newPassword
        };
		$http.post($rootScope.hostAddress + 'changePassword', body)
		.success(function(response) {
			if(response.code == 0){
				$scope.errorMessage = null;
				$scope.oldPassword = null;
				$scope.newPassword = null;
				$scope.newPasswordCopy = null;
				$scope.successMessage = "Your password has been changed successfully";
			} else if(response.code == 1 && response.message == "Old password is incorrect") {
				$scope.errorMessage = "Your old password is incorrect";
			}
		});
	}
	$scope.forgotPassword = function() {
		var body = {
			mail: "abhishek.javali@sealurmeal.com",
			token: "63ca5c52-00bb-4518-b440-093cf827e519",
			password: "abhishek"
		};
		$http.post($rootScope.hostAddress + 'setPassword', body)
		.success(function(response) {
			console.log(response);
		})
	}
    
});