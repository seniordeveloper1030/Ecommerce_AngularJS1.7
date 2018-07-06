'use strict';

sealurmealApp.controller('OrderController', function ($rootScope, $scope, $http, $location, $interval){

    $scope.init = function() {
        $scope.getOrderId();
        $scope.getCart();
        $scope.trackOrder();
    }

    $scope.getOrderId = function() {
        var path = $location.path();
        var split = path.split('/');
        $scope.orderId = split[split.length - 1];
    }

    $scope.getCart = function() {
        $http.get($rootScope.hostAddress + 'engine/menu/getCart')
        .success(function(response) {
            $scope.cartItems = response.cartItems;
            $scope.subTotal = 0;
            for(var i = 0 ; i < $scope.cartItems.length ; i++) {
                $scope.cartItems[i].totalPrice = $scope.cartItems[i].price * $scope.cartItems[i].quantity;
                $scope.subTotal += $scope.cartItems[i].totalPrice;
            }
        });
    }

    $scope.trackOrder = function() {
        var stop = $interval(function() {
            $http.get($rootScope.hostAddress + 'engine/order/trackOrder', {
                params: {
                    orderId: $scope.orderId
                }
            })
            .success(function(response) {
                if(response.orderStatus == 'RECEIVED') {
                    $scope.accepted = false;
                    $scope.preparing = false;
                    $scope.dispatched = false;
                    $scope.delivered = false;
                } else if(response.orderStatus == 'ACCEPTED') {
                    $scope.accepted = true;
                    $scope.preparing = false;
                    $scope.dispatched = false;
                    $scope.delivered = false;
                } else if(response.orderStatus == 'PREPARING') {
                    $scope.accepted = true;
                    $scope.preparing = true;
                    $scope.dispatched = false;
                    $scope.delivered = false;
                } else if(response.orderStatus == 'DISPATCHED') {
                    $scope.accepted = true;
                    $scope.preparing = true;
                    $scope.dispatched = true;
                    $scope.delivered = false;
                } else {
                    $scope.accepted = true;
                    $scope.preparing = true;
                    $scope.dispatched = true;
                    $scope.delivered = true;
                    $interval.cancel(stop);
                }
            });
        }, 10000);
    }
});