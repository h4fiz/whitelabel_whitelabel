angular.module('app')
.controller('dashboardCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.zoomerOnline = [];
    $scope.zoomerOnRoad = [];
    $scope.zoomerOffline = [];
    $scope.zoomerDailyTask = [];
    $scope.zoomerMissTask = [];
    $scope.zoomerRejectTask = [];
    $scope.dailyCod = [];

    $scope.rawDrivers = null;

    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridZoomerOnlineOptions = {
        data : $scope.zoomerOnline,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'driverid', displayName : 'Zoomer', pinnedLeft:true },
            { field: 'locstatus' , displayName:'Location Status', enableFiltering:false },
        ],
    };

    $scope.gridZoomerOnRoadOptions = {
        data : $scope.zoomerOnRoad,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'driverid', displayName : 'Zoomer', pinnedLeft:true },
            { field: 'locstatus' , displayName:'Location Status', enableFiltering:false },
        ],
    };

    $scope.gridZoomerOfflineOptions = {
        data : $scope.zoomerOffline,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'driverid', displayName : 'Zoomer' },
            //{ field: 'locstatus' , displayName:'Location Status', enableFiltering:false },
        ],
    };

    $scope.gridZoomerDailyTaskOptions = {
        data : $scope.zoomerDailyTask,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'driver', displayName : 'Zoomer', pinnedLeft:true },
            { field: 'task' , displayName:'Task Count' },
        ],
    };
    $scope.gridZoomerMissTaskOptions = {
        data : $scope.zoomerMissTask,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'driverid', displayName : 'Zoomer', pinnedLeft:true },
            { field: 'zoomorderid' , displayName:'Order ID' },
            { field: 'number_of_timeout' , displayName:'Miss Count' },
            { name: 'actions', enableFiltering:false, field:'driverid', width:100, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-click="grid.appScope.reAssignOrder(row.entity)">Reassign</button>'}
        ],
    };
    $scope.gridZoomerRejectTaskOptions = {
        data : $scope.zoomerRejectTask,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'driverid', displayName : 'Zoomer', pinnedLeft:true },
            { field: 'zoomorderid' , displayName:'Order ID' },
            { field: 'number_of_reject' , displayName:'Reject Count' },
        ],
    };
    $scope.gridDailyCodOptions = {
        data : $scope.dailyCod,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'driver', displayName : 'Zoomer', pinnedLeft:true, width:90 },
            { field: 'cod' , displayName:'COD', width:70, cellFilter:"currency:''", cellClass:"textalign-right" },
            { field: 'act_cod' , displayName:'Zoomer COD', width:70, cellFilter:"currency:''", cellClass:"textalign-right" },
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.getStatus = function(status){
        var result= "";
            switch(status){
                    case "1" : result = "Available"; break;
                    case "2" : result = "On Delivery"; break;
                    case "3" : result = "Offline"; break;
                    case "4" : result = "On Road"; break;
                    case "5" : result = "Receiving"; break;
                    case "6" : result = "Arriving"; break;
                    case "7" : result = "Pickup"; break;
                    case "E" : result = "Emergency"; break;
            }    
        return result;
    }

    $scope.getDriver = function()
	{
		$http.get('http://18.141.18.7/controlpanel/getDriver.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
            
			$scope.rawDrivers = respone.records;

            var offline = [];
            var online = [];
            var onroad =[];
			for(idx=0;idx<respone.records.length;idx++)
			{
				if(respone.records[idx].Active == "A"){
					
					respone.records[idx].statusdesc = $scope.getStatus(respone.records[idx].status);
					respone.records[idx].locstatus = "";
                    if(respone.records[idx].timediff > 30 && respone.records[idx].timediff < 300 && respone.records[idx].status != "3")
                        respone.records[idx].locstatus = "< 5 Minutes No Update";
                    if(respone.records[idx].timediff >= 300 && respone.records[idx].timediff < 900 && respone.records[idx].status != "3")
                        respone.records[idx].locstatus = "< 15 Minutes No Update";
                    if(respone.records[idx].timediff >= 900 && respone.records[idx].timediff < 1800 && respone.records[idx].status != "3")
                        respone.records[idx].locstatus = "< 30 Minutes No Update";
					if(respone.records[idx].timediff >= 1800 && respone.records[idx].status != "3" )
						respone.records[idx].locstatus = "> 30 Minutes No Update";

                    if(respone.records[idx].status == "3")
                        offline.push(respone.records[idx]);
                    else if(respone.records[idx].status == "4")
                        onroad.push(respone.records[idx]);
                    else
                        online.push(respone.records[idx]);
				}else{
					respone.records[idx].statusdesc = "Offline";
                    offline.push(respone.records[idx]);
				}
   			}
   			$scope.gridZoomerOnlineOptions.data = online;
            $scope.gridZoomerOfflineOptions.data = offline;
            $scope.gridZoomerOnRoadOptions.data = onroad;
			//$scope.changeStatus();
		})
		.error(function () 
		{
			console.log('Unable to get Driver' );
		});
	};

    $scope.getZoomerTimeout = function(){
        
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getTimeoutDriver.php', data:{'data':''},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            
            $scope.zoomerMissTask = respone.records;
            
            for(var i=0, lengthI=$scope.zoomerMissTask.length; i<lengthI;i++){
                
                for(var j=0, lengthJ = $scope.rawDrivers.length; j<lengthJ;j++){
                    if($scope.rawDrivers[j].n_id == $scope.zoomerMissTask[i].n_id){
                        $scope.zoomerMissTask[i].driverid = $scope.rawDrivers[j].driverid;
                        break;
                    }
                }
                
            }
            $scope.gridZoomerMissTaskOptions.data = $scope.zoomerMissTask;
            
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer timeout')
        });
    }
    $scope.getZoomerReject = function(){
        
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getRejectedOrder.php', data:{'data':''},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            
            $scope.zoomerReject = respone.records;
            
            for(var i=0, lengthI=$scope.zoomerReject.length; i<lengthI;i++){
                
                for(var j=0, lengthJ = $scope.rawDrivers.length; j<lengthJ;j++){
                    if($scope.rawDrivers[j].n_id == $scope.zoomerReject[i].n_id){
                        $scope.zoomerReject[i].driverid = $scope.rawDrivers[j].driverid;
                        break;
                    }
                }
                
            }
            $scope.gridZoomerRejectTaskOptions.data = $scope.zoomerReject;
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer reject')
        });
    };
    $scope.getDriverDailyTask = function()
	{
		$http.get('http://18.141.18.7/controlpanel/getDriverDailyTask.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
            $scope.gridZoomerDailyTaskOptions.data = respone.records;
		})
		.error(function () 
		{
			console.log('Unable to get Driver Daily Task' );
		});
	};
    $scope.getDriverDailyCod = function()
	{
		$http.get('http://18.141.18.7/controlpanel/getDriverDailyCod.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
            $scope.gridDailyCodOptions.data = respone.records;
		})
		.error(function () 
		{
			console.log('Unable to get Driver Daily Task' );
		});
	};

    $scope.openReassignModal = function(id){
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'DashboardReassignModal.html',
            controller: 'DashboardReassignModalCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    //return $scope.items;
                    return id;
                },
                drivers: function () {
                    return $scope.rawDrivers;
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
    $scope.getGridHeight = function(pembagi){
        var height = (($scope.screen.height - 102) / pembagi) - 50;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $scope.getDriver();
        $scope.getDriverDailyTask();
        $scope.getDriverDailyCod();
        
        $timeout(function(){
            $scope.getZoomerTimeout();
            $scope.getZoomerReject();
        },1000);

        $rootScope.eventInit.push($interval(function(){
            $scope.getDriver();
            $scope.getDriverDailyTask();
            $scope.getDriverDailyCod();
        },8000));
        /*$interval(function(){
            $scope.getDriver();
            $scope.getDriverDailyTask();
            $scope.getDriverDailyCod();
        },8000);*/
        $rootScope.eventInit.push($interval(function(){
            $scope.getZoomerTimeout();
            $scope.getZoomerReject();
        },10000));
        /*$interval(function(){
            $scope.getZoomerTimeout();
            $scope.getZoomerReject();
        },10000);*/
        
    };
    $scope.init();
}]);

angular.module('app')
.controller('DashboardReassignModalCtrl', ['$scope', '$uibModalInstance', 'orderId', 'drivers', '$http', function ($scope, $uibModalInstance, orderId, drivers, $http) {
    $scope.orderId = orderId;
    $scope.drivers = drivers;
    $scope.detailOrders = [];
    $scope.order = {};
    $scope.input = {
        reassignTo:0,
    }

    $scope.gridDetailOrdersOptions = {
        data : $scope.detailOrders,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'sortkey', displayName : 'No', enableFiltering:false, width:60 },
            { field: 'zoom_orderid' , displayName:'Order ID', width:100 },
            { field: 'rootid' , displayName:'Group ID', width:100 },
            { field: 'delivery_contact' , displayName:'Receiver Name', width:150 },
            { field: 'delivery_address' , displayName:'Delivery Address', width:250 },
            { field: 'delivery_phone' , displayName:'Delivery Phone', width:100 },
            { field: 'delivery_instruction' , displayName:'Delivery Instruction', width:250 },
            { field: 'cod' , displayName:'COD Amount', width:90 },
        ],
    };
    
    $scope.getDetail = function(){
        var data = {'rootid':$scope.orderId};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getOrderGroupDetail.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++){
				for ( var temp in respone.result[i] )
                {
                        respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
                }
			}
            $scope.order = respone.result[0];
            $scope.detailOrders = respone.result;
            $scope.gridDetailOrdersOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
    
    $scope.ok = function () {
        if(confirm('Are your sure want to reassign this order?')){
            var data = {
                usr:$scope.input.reassignTo,
                zoomorderid:$scope.orderId
            };
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/setReservationOrder.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                if(respone.message == "OK"){
                    alert('Assign Order Success');
                    
                    $uibModalInstance.close('');
                }else{
                    alert('Assign Order Reject by server. Got Problem with Network');
                }
                
            }).error(function (respone, status, headers, config){
                alert('Assign Failed');
            });
        }        
        //$uibModalInstance.close(''); //close return something
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDetail();
}]);
