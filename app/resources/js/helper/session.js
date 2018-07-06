'use strict';

sealurmealApp.service('Session', function () {

    this.user = {
        userId: null,
        role: null
    };
    
    this.create = function (data) {
        this.user.userId = data.userId;
        this.user.role = data.role;
    };

    this.invalidate = function () {
        this.user.userId = null;
        this.user.role = null;
    };
});