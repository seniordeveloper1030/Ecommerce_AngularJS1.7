'use strict';

sealurmealApp.controller('CartController', function ($rootScope, $scope, $http, $location){

    $scope.init = function() {
        $scope.getCart();
    }

    $scope.getCart = function() {
        $http.get($rootScope.hostAddress + 'engine/menu/getCart')
        .success(function(response) {
            if(response.cartItems == null){
                $scope.emptyCart = true;
            } else{
                if(response.cartItems == null){
                    $rootScope.cartItemNum = 0;
                } else{
                    $rootScope.cartItemNum = 0;
                    for(var i = 0 ; i < response.cartItems.length ; i++) {
                        $rootScope.cartItemNum += response.cartItems[i].quantity;
                    }
                    $rootScope.cartItems = response.cartItems;
                }
                $scope.emptyCart = false;
                $scope.cartItems = response.cartItems;
                $scope.subTotal = 0;
                for(var i = 0 ; i < $scope.cartItems.length ; i++) {
                    $scope.cartItems[i].totalPrice = $scope.cartItems[i].price * $scope.cartItems[i].quantity;
                    $scope.subTotal += $scope.cartItems[i].totalPrice;
                }
            }
            $rootScope.cartNotif();
        });
    }

    $scope.increaseCartItem = function(cartItem) {
        var menuItems = {};
        var menuId = cartItem.menuId;
        for(var i = 0 ; i < $scope.cartItems.length ; i++){
            if($scope.cartItems[i].menuId == menuId) {
                menuItems[menuId] = $scope.cartItems[i].quantity + 1;
            } else{
                menuItems[$rootScope.cartItems[i].menuId] = $rootScope.cartItems[i].quantity;
            }
        }
        var body = {
            menuItems: menuItems
        };
        $http.post($rootScope.hostAddress + 'engine/menu/updateCart', body)
        .success(function(response) {
            $scope.getCart();
        });
    }

    $scope.decreaseCartItem = function(cartItem) {
        var menuItems = {};
        var menuId = cartItem.menuId;
        for(var i = 0 ; i < $scope.cartItems.length ; i++){
            if($scope.cartItems[i].menuId == menuId) {
                menuItems[menuId] = $scope.cartItems[i].quantity - 1;
            } else{
                menuItems[$rootScope.cartItems[i].menuId] = $rootScope.cartItems[i].quantity;
            }
        }
        var body = {
            menuItems: menuItems
        };
        $http.post($rootScope.hostAddress + 'engine/menu/updateCart', body)
        .success(function(response) {
            $scope.getCart();
        });
    }

    $scope.deleteCartItem = function(cartItem) {
        var menuItems = {};
        var menuId = cartItem.menuId;
        for(var i = 0 ; i < $scope.cartItems.length ; i++){
            if($scope.cartItems[i].menuId == menuId) {
                //menuItems[menuId] = $scope.cartItems[i].quantity - 1;
            } else{
                menuItems[$rootScope.cartItems[i].menuId] = $rootScope.cartItems[i].quantity;
            }
        }
        var body = {
            menuItems: menuItems
        };
        $http.post($rootScope.hostAddress + 'engine/menu/updateCart', body)
        .success(function(response) {
            $scope.getCart();
        });
    }

    $scope.completeOrder = function() {
        if($scope.emptyCart){
            
        }
        $http.post($rootScope.hostAddress + 'engine/order/placeOrder')
        .success(function(response) {
            $location.path("/order/" + response.orderId).replace();
        })
    }
});