angular.module('app')
.controller('orderTrackingCtrl', ['$state', '$scope', '$http', '$location', '$rootScope', function($state, $scope, $http, $location, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.id='';
	$scope.data={};
	$scope.data.trackingid = '';
	$scope.data.orderid = '';
	$scope.data.rootid = '';
	$scope.data.submited = '';
	$scope.data.pickup = '';
	$scope.data.delivered = '';
	$scope.data.partner = '';
	$scope.data.deliveryname = '';
	$scope.data.deliveryaddress = '';
	$scope.data.status = '';
	$scope.data.driverid = '';
	$scope.data.addressdetail = '';
	$scope.data.instruction = '';
	$scope.data.cod = '';
	$scope.data.weight = '';
	$scope.data.qty = '';
    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.search = function(){
		$scope.init();
		if( $scope.id.length>2 ) {
			$http.get('http://'+$location.$$host+'/controlpanel/getTrackingInfo.php?trackerid='+$scope.id)		
			.success(function(respone) 
			{
				//respone = CRYPTO.decrypt(respone.data);
				$scope.data.trackingid = decodeURIComponent(respone.trackerid);
				$scope.data.orderid = decodeURIComponent(respone.orderid);
				$scope.data.rootid = decodeURIComponent(respone.groupid );
				$scope.data.submited = decodeURIComponent(respone.submited );
				$scope.data.pickup = decodeURIComponent(respone.pickup );
				$scope.data.delivered = decodeURIComponent(respone.delivered );
				$scope.data.partner = decodeURIComponent(respone.vendor );
				$scope.data.deliveryname = decodeURIComponent(respone.name );
				$scope.data.deliveryaddress = decodeURIComponent(respone.address );
				$scope.data.status = decodeURIComponent(respone.status );
				$scope.data.driverid = decodeURIComponent(respone.driver );
				$scope.data.addressdetail = decodeURIComponent(respone.addressdetail );
				$scope.data.instruction = decodeURIComponent(respone.instruction );
				$scope.data.cod = decodeURIComponent(respone.cod );
				$scope.data.weight = decodeURIComponent(respone.weight);
				$scope.data.qty = decodeURIComponent(respone.qty);
			})
			.error(function () 
			{
				alert('Unable to get order list ' );
			});
		}
    };
	$scope.init = function(){
		$scope.data={};
		$scope.data.trackingid = '';
		$scope.data.orderid = '';
		$scope.data.rootid = '';
		$scope.data.submited = '';
		$scope.data.pickup = '';
		$scope.data.delivered = '';
		$scope.data.partner = '';
		$scope.data.deliveryname = '';
		$scope.data.deliveryaddress = '';
		$scope.data.status = '';
		$scope.data.driverid = '';
		$scope.data.addressdetail = '';
		$scope.data.instruction = '';
		$scope.data.cod = '';
		$scope.data.weight = '';
		$scope.data.qty = '';
	};
    $scope.init(); 
}]);

