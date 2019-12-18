angular.module('app')
.controller('preassignmentCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$window', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $window){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    $scope.listAllDriver = [];
    $scope.driverlist = {
        available:[],
        onroad:[]
    }
    $scope.info = {
        total:0,
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
        columnDefs:[
            { field: 'zoomorderid', displayName : 'ID', width:100, pinnedLeft:true ,cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.openDetailOrderModal(row.entity.zoomorderid)">+</button>&nbsp;&nbsp;{{ row.entity.zoomorderid }}</div>' },
            { field: 'status' , displayName:'Status', width:100,  pinnedRight:true },
            { field: 'partnername' , displayName:'Vendor', width:150 },
            { field: 'Delivery_Shift', displayName:'Delivery Shift', width:150},
            
            { field: 'Pickup_Address' , displayName:'Pickup Address', width:400 },
            { field: 'Delivery_Instruction', displayName:'Delivery Instruction', width:400},
            { field: 'Delivery_Address', displayName : 'Delivery Address', width:400 },
            { field: 'Pickup_Name' , displayName:'Pickup Name', width:150 },
            { field: 'Delivery_Name', displayName : 'Receiver Name', width:150 },
            { field: 'Delivery_Phone', displayName:'Delivery Phone', width:150},   
            { field: 'driverid', displayName:'Driver', width:80, pinnedRight:true  },
            { name: 'actions', enableFiltering:false, field:'Ticketid', width:200, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm"  ng-click="grid.appScope.returnToReservation(row.entity)">Return to reservation</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/

    $scope.getOrderList = function(){
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getPreassignedOrder.php', data:{'data':''},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            $scope.info.total = respone.total;
            for(var i=0, length=respone.records.length;i<length;i++){
		for ( var temp in respone.records[i] )
                {
                        respone.records[i][temp] = decodeURIComponent(respone.records[i][temp]);
                }
                var arr = respone.records[i].timestamp.split(", ");
                
                var time = arr[1].split(":");
                respone.records[i].pickup_time = time[0]+":"+time[1];
                
                var date = arr[0].split(" ");
                var month = "";
                switch(date[1].toLowerCase()){
                    case "jan": month="1";break;
                    case "feb": month="2";break;
                    case "mar": month="3";break;
                    case "apr": month="4";break;
                    case "may": month="5";break;
                    case "jun": month="6";break;
                    case "jul": month="7";break;
                    case "aug": month="8";break;
                    case "sep": month="9";break;
                    case "oct": month="10";break;
                    case "nov": month="11";break;
                    case "dec": month="12";break;
                }
                
                respone.records[i].pickup_date = date[2]+"/"+month+"/"+date[0];

                respone.records[i].nearest = '';
                respone.records[i].nearest2 = '';
                
                var id = respone.records[i].zoomorderid;
                /*var myPromise = $scope.nearDriver(id, i);
                myPromise.then(function(resolve){
                    if(resolve.nearest.records.length>0){
                        for(var j=0; j< $scope.gridOptions.data.length;j++){
                            if($scope.gridOptions.data[j].zoomorderid == resolve.zoomorderid){
                                $scope.gridOptions.data[j].nearest = resolve.nearest.records[0].driverid;
                                if(resolve.nearest.records.length>1){
                                    $scope.gridOptions.data[j].nearest2 = resolve.nearest.records[1].driverid;
                                }
                                break;
                            }
                        }
                    }
                        
                }, function(resolve){
                    console.log(resolve);
                });*/
   
            }
            $scope.orders = respone.records;
            $scope.gridOptions.data = respone.records;
            
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer reject')
        });
    };
	
	$scope.printGroup= function(data){
	 $window.open('http://18.141.18.7/controlpanel/print_receipt.php?groupid='+data.zoomorderid);
    }
	
    $scope.returnToReservation = function(order){
    	if(confirm('Are you sure want to return order ['+order.zoomorderid+'] to reservation?')){
    		var data = {
	            zoomorderid:order.zoomorderid
	        };
	        
	        var jsonData = CRYPTO.encrypt(data);
	        
	        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/returnToReservation.php', data:{'data':jsonData},  
	            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
	        {
	            respone = CRYPTO.decrypt(respone.data);
	            
	            if(respone.message == "OK"){
					$scope.getOrderList();
	                alert('Returning order to reservation success');
	                $uibModalInstance.close('');
	            }else{
	                alert('Returning order to reservation Reject by server. Please Try Again.');
	            }
	            
	        }).error(function (respone, status, headers, config){
	            alert('Returning order to reservation failed');
	        });
    	}
    	
    }

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
    $scope.openAssignOrderModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'AssignOrderModal.html',
            controller: 'AssignOrderModalCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    return data.zoomorderid;
                },
                drivers: function(){
                    return $scope.driverlist.available;
                }
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getDriver();
            $scope.getOrderList();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
    
    $scope.openEditOrderModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ManualOrderModal.html',
            controller: 'ManualOrderModalCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    return data.zoomorderid;
                },
                drivers: function(){
                    return $scope.listAllDriver;
                }
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getDriver();
            $scope.getOrderList();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.openBroadcastModal = function(id){
        var r = confirm('Are your sure want to broadcast this orders?');               
        if (r == true) {                    
             var param = {
                zoomorderid : id,
            };
            console.log("id:"+id);
            var jsonData = CRYPTO.encrypt(param);
            var url = 'http://18.141.18.7/controlpanel/addBroadcast.php';
            
            $http({method: 'POST',url:url, data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},})
            .success(function (respone, status, headers, config) 
            {
                //console.log(respone);
                if( 'OK'==respone.message )
                {
                    alert ("Broadcast success");
                }
            })
            .error(function (respone, status, headers, config){
                alert('Unable to send broadcast messages ' );
            });
        }
        /*
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ReservationBroadcastModal.html',
            controller: 'ReservationBroadcastModalCtrl',
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
        */
    }
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        
        $scope.getOrderList();
        
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
        },50000));
    };
    $scope.init();
}]);

