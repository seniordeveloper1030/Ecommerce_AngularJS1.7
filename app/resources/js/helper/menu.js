'use strict';

sealurmealApp.service('Menu', function() {
    this.menu = {
        calories: null,
        cuisine: null,
        description: null,
        foodCategory: null,
        imageLink: null,
        ingredients: null,
        menuId: null,
        name: null,
        price: null,
        quantity: null,
        restaurantId: null,
        status: null
    };

    this.create = function (data) {
        this.menu.calories = data.calories;
        this.menu.cuisine = data.cuisine;
        this.menu.description = data.description;
        this.menu.foodCategory = data.foodCategory;
        this.menu.imageLink = data.imageLink;
        this.menu.ingredients = data.ingredients;
        this.menu.menuId = data.menuId;
        this.menu.name = data.name;
        this.menu.price = data.price;
        this.menu.quantity = data.quantity;
        this.menu.restaurantId = data.restaurantId;
        this.menu.status = data.status;
    }
    
    this.delete = function() {
        this.menu.calories = null;
        this.menu.cuisine = null;
        this.menu.description = null;
        this.menu.foodCategory = null;
        this.menu.imageLink = null;
        this.menu.ingredients = null;
        this.menu.menuId = null;
        this.menu.name = null;
        this.menu.price = null;
        this.menu.quantity = null;
        this.menu.restaurantId = null;
        this.menu.status = null;
    }
})