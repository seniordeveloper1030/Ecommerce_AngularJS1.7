'use strict';

sealurmealApp.controller('RecommendationController', function ($rootScope, $scope, $http, $location, Menu) {

    $scope.init = function() {
        $scope.getRecommendation();
        $scope.getMenuItems();
        $scope.count = 1;
    };

    $scope.getRecommendation = function() {
        $http.get($rootScope.hostAddress + 'engine/menu/getRecommendedMenuItem')
        .success(function(response) {
            $scope.recommendedItem = response.recommendedItem;
            var ingredientList = "";
            for(var key in response.recommendedItem.ingredients){
                ingredientList += key + ", ";
            }
            ingredientList = ingredientList.slice(0, ingredientList.length - 2);
            $scope.recommendedItem.ingredientList = ingredientList;
        });
    }

    $scope.getMenuItems = function() {
        $http.get($rootScope.hostAddress + 'engine/menu/getMenuItems', {
            params: {index: 0}
        })
        .success(function(response){
            $rootScope.menuItems = response.menuItems.slice(0, 4);
        });
    }

    $scope.selectMenuItem = function(menuItem) {
        $rootScope.selectedMenuItem = menuItem;
    }

    $scope.placeOrder = function() {
        var body = {
            menuItems: {
                'item1': 1,
                'item2': 2
            }
        };
        $http.post($rootScope.hostAddress + 'engine/menu/updateCart', body, {})
        .success(function(response) {
            console.log("YAAAYYY SEGOY");
            console.log(response);
        })
        .error(function(response) {
            console.log("OHHH NOOOO");
            console.log(response);
        }) 
    }

    $scope.increaseCount = function() {
        $scope.count++;
    }

    $scope.decreaseCount = function() {
        if($scope.count > 1){
            $scope.count--;
        }
    }

    $scope.addToCart = function(recommendedItem) {
        $rootScope.cartItemNum = $rootScope.cartItemNum + $scope.count;
        var menuItems = {};
        var menuId = recommendedItem.menuId;
        if($rootScope.cartItems != null){
            alert("asdf")
            var added = false;
            for(var i = 0 ; i < $rootScope.cartItems.length ; i++){
                if($rootScope.cartItems[i].menuId == menuId) {
                    menuItems[menuId] = $rootScope.cartItems[i].quantity + $scope.count;
                    added = true;
                } else{
                    menuItems[$rootScope.cartItems[i].menuId] = $rootScope.cartItems[i].quantity;
                }
            }
            if(added == false){
                menuItems[menuId] = $scope.count;
            }
        }
        var body = {
            menuItems: menuItems
        };
        console.log(menuItems);

        $http.post($rootScope.hostAddress + 'engine/menu/updateCart', body)
        .success(function(response) {
            $rootScope.cartNotif();
            $http.get($rootScope.hostAddress + 'engine/menu/getCart')
            .success(function(response) {
                if(response.cartItems == null){
                    $rootScope.cartItemNum = 0;
                } else{
                    $rootScope.cartItemNum = 0;
                    for(var i = 0 ; i < response.cartItems.length ; i++) {
                        $rootScope.cartItemNum += response.cartItems[i].quantity;
                    }
                    $rootScope.cartItems = response.cartItems;
                }
            });
        });
    }

});