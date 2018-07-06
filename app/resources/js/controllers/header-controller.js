'use strict';

sealurmealApp.controller('HeaderController', function($rootScope, $scope, $http, Authentication) {

    $scope.init = function() {
        $scope.getCart();
        $rootScope.cartItemNum = 0;
    }

    $scope.togglePreference = function(){
        var body = {
            userDetails: $rootScope.userDetails
        };
        $http.post($rootScope.hostAddress + 'engine/updateUserDetails', body)
        .success(function(response) {
        });
    }

    $scope.getCart = function() {
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
            $rootScope.cartNotif();
        });
    }

    $scope.logout = function () {
        Authentication.logout();
    }

    var cartElmnt = $(".cart-icon .value");
    $rootScope.cartNotif = function() {
        cartElmnt.css("visibility", "visible");
        if ($rootScope.cartItemNum > 0) {
            cartElmnt.text($rootScope.cartItemNum);
            cartElmnt.css("visibility", "visible").addClass("animated bounce");
        } else {
            cartElmnt.text("");
            cartElmnt.css("visibility", "hidden").removeClass("animated bounce");
        }
    }

    $(".confirm-adding").on("click", function () {
        $rootScope.cartNotif();
        $(this).addClass("confirmed");
    });
})