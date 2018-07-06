'use strict';

sealurmealApp.service('DataService',['$http', function($http){
	this.fetchData = function(options){
		if(!options || !options.url || options.url == ""){
			//Focus.utils.log('error','No url provided for http request', 'DataService');
			return false;
		}
		
		if(!(typeof options.callback == "object") || !(typeof options.callback.success == "function") || !(typeof options.callback.error == "function")){
			//Focus.utils.log('error','Either callback function is not provided or is incorrect', 'DataService');
			return false;
		}
		
		return $http({
			url : 'http://52.15.84.55:8090' + options.url,
			responseType : options.responseType || 'json',
			method : options.method || 'POST',
			params: options.params || null,
			data: options.data || null
		}).success(function(data,status){
			if(data){
				options.callback.success(data, false);
			} else {
				options.callback.success(data, Focus.constants.ErrorCodes.NULL_DATA);
			}
			
		}).error(function(error,status){
			if(status == 901){
				location.href = "/login";
			} else if(status != 404 && status != 500){
				alert(error ? error.message : "Something went wrong please try again after some time.");
				options.callback.error(error);
			} else {
				options.callback.error(error);
			}
		});
	};
}]);