angular.module('app')
.controller('pickupAndDeliveryTimeCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    
    $scope.data = {
        raw:null,
    }
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'zoomorderid', displayName : 'ID', width:100, pinnedLeft:true },//,cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.getDetail(row.entity.zoomorderid)">+</button>&nbsp;&nbsp;{{ row.entity.zoomorderid }}</div>' },
            { field: 'rootid' , displayName:'Group ID', width:150 },
            { field: 'sortkey' , displayName:'Seq', width:50 },
            { field: 'partnername' , displayName:'Vendor', width:150 },
            { field: 'driverid' , displayName:'Driver', width:150 },
            { field: 'reply' , displayName:'Accept Task Time', width:150 },
            { field: 'pickup' , displayName:'Pickup Time', width:150, cellTemplate:'<div class="ui-grid-cell-contents" ng-class="{\'color-red\':row.entity.notifpickup!=\'\'}" >{{ row.entity.pickup }}</div>' },
            { field: 'delivery' , displayName:'Delivery Time', width:150, cellTemplate:'<div class="ui-grid-cell-contents" ng-class="{\'color-red\':row.entity.notifdelivery!=\'\'}" >{{ row.entity.delivery }}</div>' },
            { field: 'status' , displayName:'Status', width:150 },
			{ field: 'trackingid', displayName:'TrackingID', width:150}
            //{ name: 'actions', enableFiltering:false, field:'zoomorderid', width:100, pinnedRight:true, cellTemplate:'<button class="btn btn-sm btn-warning" ng-show="row.entity.status.toLowerCase() == \'available\' && row.entity.driverid == \'\'" ng-click="grid.appScope.openEdit(row.entity, \'pickup\')">Edit Pickup</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    
    $scope.getOrderList = function(rootid){
        $http.get('http://18.141.18.7/controlpanel/getDriverPickup.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.data.raw = respone.records;
			
			$scope.gridOptions.data = $scope.data.raw;
		})
		.error(function () 
		{
			alert('Unable to get Data' );
		});
    };

    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 130;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $scope.getOrderList();
    };
    $scope.init();
}]);