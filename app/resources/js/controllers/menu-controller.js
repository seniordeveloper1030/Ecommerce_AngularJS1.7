'use strict';

sealurmealApp.controller('MenuController', function ($rootScope, $scope, $http, $location, Menu){

    $scope.init = function() {
        $scope.getSelectedCuisine();
        $rootScope.selectedFoodCategory = "ALL";
        $scope.getMenuItems();
        $scope.count = 1;
    }

    $scope.menuItemInit = function() {
        $scope.count = 1;
        $scope.added = false;
        $scope.selectedMenuItem = $rootScope.selectedMenuItem;
        if($scope.selectedMenuItem == null || $scope.selectedMenuItem == undefined) {
            return;
        }
        var ingredientList = "";
        for(var key in $scope.selectedMenuItem.ingredients){
            ingredientList += key + ", ";
        }
        ingredientList = ingredientList.slice(0, ingredientList.length - 2);
        $scope.selectedMenuItem.ingredientList = ingredientList;
    }

    var toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    $scope.getSelectedCuisine = function() {
        var url = $location.path();
        var urlSplit = url.split("/");
        $scope.selectedCuisineEnum = urlSplit[urlSplit.length - 1];
        $scope.selectedCuisineEnum = $scope.selectedCuisineEnum.toUpperCase();
        $scope.selectedCuisine = toTitleCase($scope.selectedCuisineEnum);
        console.log( $scope.selectedCuisineEnum + "," + $scope.selectedCuisine);
    }

    $scope.getMenuItems = function() {
        var foodCategory = null;
        if(!!$rootScope.selectedFoodCategory){
           foodCategory = $rootScope.selectedFoodCategory.toUpperCase();
            if($rootScope.selectedFoodCategory == 'ALL'){
                foodCategory = null;
            }
            console.log(foodCategory);
            $http.get($rootScope.hostAddress + 'engine/menu/getMenuItems', {
                params: {
                    cuisine: $scope.selectedCuisineEnum,
                    foodCategory: foodCategory,
                    index: 0
                }
            })
            .success(function(response){
                console.log(response);
                $scope.menuItems = response.menuItems;
                $scope.paginationIndex = 0;
            });
        }
    }

    $scope.loadMoreMenuItems = function() {
        var foodCategory = null;
        if(!!$rootScope.selectedFoodCategory) {
            foodCategory = $rootScope.selectedFoodCategory.toUpperCase();
            if($rootScope.selectedFoodCategory == 'ALL') {
                foodCategory = null;
            }
            $scope.paginationIndex++;
            $http.get($rootScope.hostAddress + 'engine/menu/getMenuItems', {
                params: {
                    cuisine: $scope.selectedCuisineEnum,
                    foodCategory: foodCategory,
                    index: $scope.paginationIndex
                }
            })
            .success(function(response) {
                $scope.menuItems = $scope.menuItems.concat(response.menuItems);
            })
        }
    }

    $scope.filter = function(selectedFoodCategory) {
        $rootScope.selectedFoodCategory = selectedFoodCategory;
        $scope.getMenuItems();
    }

    $scope.selectMenuItem = function(menuItem) {
        $rootScope.selectedMenuItem = menuItem;
        $location.path("/menu/item/" + menuItem.menuId).replace();
    }

    $scope.increaseCount = function() {
        $scope.count++;
    }

    $scope.decreaseCount = function() {
        if($scope.count > 1){
            $scope.count--;
        }
    }

    $scope.addToCart = function(selectedMenuItem) {
        $rootScope.cartItemNum = $rootScope.cartItemNum + $scope.count;
        var menuItems = {};
        var menuId = selectedMenuItem.menuId;
        var added = false;
        if($rootScope.cartItems != null){
            for(var i = 0 ; i < $rootScope.cartItems.length ; i++){
                if($rootScope.cartItems[i].menuId == menuId) {
                    menuItems[menuId] = $rootScope.cartItems[i].quantity + $scope.count;
                    added = true;
                } else{
                    menuItems[$rootScope.cartItems[i].menuId] = $rootScope.cartItems[i].quantity;
                }
            }
        }
        if(added == false){
            menuItems[menuId] = $scope.count;
        }
        var body = {
            menuItems: menuItems
        };
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

});