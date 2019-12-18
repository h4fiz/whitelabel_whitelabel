angular.module('app')
.controller('orderSLACtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$location', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $location){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
	$scope.data={};
	$scope.data.day0=0;
	$scope.data.day1=0;
	$scope.data.day2=0;
	$scope.data.day3=0;
	$scope.data.dayX=0;
	$scope.data.total=0;
    $scope.info = {
        total:0,
        cod:0,
        collected:0
    }
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : $scope.orders,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
		exporterPdfTableStyle: {margin: [10, 10, 10, 5]},
		exporterPdfOrientation: 'landscape',
        columnDefs:[
            { field: 'zoom_orderid', displayName : 'ID', width:100,  },
            { field: 'partnername' , displayName:'Vendor', width:150 },
            { field: 'delivery_address' , displayName:'Delivery Address', width:400 },
            { field: 'delivery_phone' , displayName:'Delivery Phone', width:150 },
            { field: 'pickup_name', displayName : 'Pickup Name', width:150 },
            { field: 'status' , displayName:'Status', width:150 },
			{ field: 'input_time', displayName : 'Timestamp', width:150},
            { field: 'RemainingTime' , displayName:'Remaining (Days)', width:150, cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding" style="background-color:{{(0>row.entity.RemainingTime)?\'rgb(247, 118, 135)\':\'WHITE\'}}">{{row.entity.RemainingTime }}</div>' },
			{ field: 'delivery_name' , displayName:'Delivery Name', width:150 },
			{ field: 'rootid' , displayName:'GroupId', width:150 },
            { field: 'driverid', displayName:'Driver', width:150, type:'number'},
			{ field: 'trackingid', displayName:'TrackingID', width:150}
            /*{ name: 'actions', enableFiltering:false, field:'Ticketid', width:100, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.openAssignOrder(row.entity)">Assign Job</button>'}*/
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    
    $scope.reloadOrder= function(){
        //$scope.datepicker.chooseDate = $scope.datepicker.requestDate;
        $scope.getOrderList();
       
    };


    $scope.getOrderList = function(){
		
        $http.get('http://'+$location.$$host+'/controlpanel/getOrderSLA.php')		
		.success(function(respone) 
		{
			$scope.data.day0=0;
			$scope.data.day1=0;
			$scope.data.day2=0;
			$scope.data.day3=0;
			$scope.data.dayX=0;
			$scope.data.total=0;
            respone = CRYPTO.decrypt(respone.data);
            console.log(respone);
            for(var i=0, length=respone.result.length;i<length;i++){
                respone.result[i].new_auto_manual= respone.result[i].auto_manual == "" ? "A" : respone.result[i].auto_manual;
				for ( var temp in respone.result[i] )
				{
					respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
				}
				
				if( respone.result[i].RemainingTime==1 ) {
					$scope.data.day0++;
				} else if( respone.result[i].RemainingTime==1 ) {
					$scope.data.day1++;
				} else if( respone.result[i].RemainingTime==2 ) {
					$scope.data.day2++;
				} else if( respone.result[i].RemainingTime==3 ) {
					$scope.data.day3++;
				} else if( respone.result[i].RemainingTime<0 ) {
					$scope.data.dayX++;
				}
				$scope.data.total++;
				
            }			
			$scope.gridOptions.data = respone.result;
			$scope.info.total = respone.total;
            $scope.info.cod = parseFloat(respone.totalcod).toFixed(2);
            $scope.info.collected = parseFloat(respone.totalcollected).toFixed(2);
		})
		.error(function () 
		{
			alert('Unable to get order list ' );
		});
		
    };

    $scope.openDetailOrderModal = function(id){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'DetailOrderModal.html',
            controller: 'DetailOrderModalCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    return id;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
    
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $scope.getOrderList();
/*        
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
        },15000));
		*/
    };
    $scope.init();
}]);
