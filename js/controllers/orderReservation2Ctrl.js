angular.module('app')
.controller('orderReservationCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    $scope.driverlist = {
        available:[]
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
            { field: 'nearest', displayName:'Nearest Driver 1', width:100},
            { field: 'nearest2', displayName:'Nearest Driver 2', width:100},
            { field: 'Pickup_Address' , displayName:'Pickup Address', width:400 },
            { field: 'Delivery_Instruction', displayName:'Delivery Instruction', width:400
                /*filter: {
                    term: '',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
                }*/
            },
            { field: 'Delivery_Address', displayName : 'Delivery Address', width:400 },
            { field: 'Pickup_Name' , displayName:'Pickup Name', width:150 },
            { field: 'Delivery_Name', displayName : 'Receiver Name', width:150 },
            { field: 'Delivery_Phone', displayName:'Delivery Phone', width:150},
                        
            { field: 'driverid', displayName:'Driver', width:80, pinnedRight:true  },
            { name: 'actions', enableFiltering:false, field:'Ticketid', width:200, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.openAssignOrderModal(row.entity)">Assign Job</button> <button class="btn btn-primary btn-sm" ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.autoAssign(row.entity)">Auto Assign</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.getDriver = function()
	{
		$http.get('http://apps.zoomitnow.co/controlpanel/getDriver.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.rawDrivers = respone.records;

            $scope.driverlist.available=[];
            for(var idx=0;idx<respone.records.length;idx++)
            {
                if(respone.records[idx].status=="1")
                    $scope.driverlist.available.push(respone.records[idx]);
            }
		})
		.error(function () 
		{
			console.log('Unable to get Driver' );
		});
	};

    $scope.getOrderList = function(){
        $http({method: 'POST',url:'http://apps.zoomitnow.co/controlpanel/getBasketOrder.php', data:{'data':''},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            $scope.info.total = respone.total;
            for(var i=0, length=respone.records.length;i<length;i++){
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
                if( respone.records[i].timeout=='Y' )
				{
					respone.records[i].status='Timeout';
				}
                respone.records[i].pickup_date = date[2]+"/"+month+"/"+date[0];

                respone.records[i].nearest = '';
                respone.records[i].nearest2 = '';
                
                var id = respone.records[i].zoomorderid;
                var myPromise = $scope.nearDriver(id, i);
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
                });
   
            }
            $scope.orders = respone.records;
            $scope.gridOptions.data = respone.records;
            
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer reject')
        });
    };

    $scope.nearDriver = function(id, idx){
        var deferred = $q.defer();
        var data = {
            zoomorderid: id
        };
        var jsonData = CRYPTO.encrypt(data);
        $http({
                url: 'http://apps.zoomitnow.co/controlpanel/getNearDriver.php',
                method: 'POST',
                data:{'data':jsonData},
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
            })
            //if request is successful
            .success(function(data,status,headers,config){

                //resolve the promise
                var tmp = CRYPTO.decrypt(data.data);
                var result = {
                    'zoomorderid':id,
                    'idx':idx,
                    'nearest':tmp
                };
                deferred.resolve(result);

            })
            //if request is not successful
            .error(function(data,status,headers,config){
                //reject the promise
                deferred.reject(null);
            });

        //return the promise
        return deferred.promise;
    }

    $scope.autoAssign = function(data){
        var data = {'lat':data.Pickup_Lat , 'lng':data.Pickup_Lng };
        jsonData = CRYPTO.encrypt(data);
	$http({method: 'POST',url:'http://apps.zoomitnow.co/controlpanel/getClosestDriver.php', data:{'data':jsonData},
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config)
        {
            respone = CRYPTO.decrypt(respone.data);	
            if("OK" == respone.records.message )
	    {
	        if(confirm('Are your sure want to Assign orderid '+ data.zoomorderid +' to ZOOMER'+respone.records.n_id+' ?')){
            		var data = {
                		usr:respone.records.n_id,
                		zoomorderid:data.zoomorderid
            		};
            		var jsonData = CRYPTO.encrypt(data);
            		$http({method: 'POST',url:'http://apps.zoomitnow.co/controlpanel/setReservationOrder.php', data:{'data':jsonData},
        		headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config)
          	  	{
                		respone = CRYPTO.decrypt(respone.data);
       		   	    	if(respone.message == "OK"){
       	                 		alert('Assign Order Success');
 	                        }else{
                	        	alert('Assign Order Reject by server. Please Try Again.');
        	                }
	                }).error(function (respone, status, headers, config){
                		alert('Assign Failed');
                	});
		}
	    }
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
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $scope.getDriver();
        $scope.getOrderList();
        
        $rootScope.eventInit.push($interval(function(){
            $scope.getDriver();
        },10000));        
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
        },15000));
    };
    $scope.init();
}]);

angular.module('app')
.controller('AssignOrderModalCtrl', ['$scope', '$uibModalInstance', 'orderId', 'drivers', '$http', function ($scope, $uibModalInstance, orderId, drivers, $http) {
    $scope.orderId = orderId;
    $scope.drivers = drivers;
    $scope.detailOrders = [];
    $scope.order = {};
    $scope.input = {
        assignTo:0,
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

        $http({method: 'POST',url:'http://apps.zoomitnow.co/controlpanel/getOrderGroupDetail.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.order = respone.result[0];
            $scope.detailOrders = respone.result;
            $scope.gridDetailOrdersOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
    
    $scope.ok = function () {
        if(confirm('Are your sure want to Assign this order?')){
            var data = {
                usr:$scope.input.assignTo.n_id,
                zoomorderid:$scope.orderId
            };
            
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://apps.zoomitnow.co/controlpanel/setReservationOrder.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                //console.log(respone);
                if(respone.message == "OK"){
                    alert('Assign Order Success');
                    $uibModalInstance.close('');
                }else{
                    alert('Assign Order Reject by server. Please Try Again.');
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
