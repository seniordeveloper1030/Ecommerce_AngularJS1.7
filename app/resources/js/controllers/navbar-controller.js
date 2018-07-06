'use strict';

sealurmealApp.controller('NavbarController', function($rootScope, $scope, $http, $location) {

    $scope.init = function() {
        $scope.getCuisines();
        $scope.getFoodCategories();
    }

    $scope.getCuisines = function() {
        $http.get($rootScope.hostAddress + 'engine/menu/getAvailableCuisines')
        .success(function(response) {
            var cuisines = response.availableCuisines.map(function(value) {
                return value.toLowerCase();
            });
            $scope.allCuisines = cuisines;
            $scope.startSliceIndex = 0;
            $scope.cuisines = cuisines.slice($scope.startSliceIndex, $scope.startSliceIndex + 7);
        });
    }

    $scope.getFoodCategories = function() {
        $rootScope.selectedFoodCategory = 'ALL';
        $http.get($rootScope.hostAddress + 'engine/menu/getAvailableFoodCategories')
        .success(function(response) {
            $rootScope.foodCategories = [];
            $rootScope.foodCategories.push('ALL');
            $rootScope.foodCategories = $rootScope.foodCategories.concat(response.availableFoodCategories);
        })
    }

    $scope.goLeft = function() {
        if($scope.startSliceIndex == 0) {
            return;
        }
        $scope.startSliceIndex--;
        $scope.cuisines = $scope.allCuisines.slice($scope.startSliceIndex, $scope.startSliceIndex + 7);
    }

    $scope.goRight = function() {
        if(($scope.startSliceIndex + 7) >= $scope.allCuisines.length){
            return;
        }
        $scope.startSliceIndex++;
        $scope.cuisines = $scope.allCuisines.slice($scope.startSliceIndex, $scope.startSliceIndex + 7);
    }
});