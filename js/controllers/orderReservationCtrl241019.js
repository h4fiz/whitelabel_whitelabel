angular.module('app')
.controller('orderReservationCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$window', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $window){

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
            // { name: 'actions', enableFiltering:false, field:'Ticketid', width:465, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.openAssignOrderModal(row.entity)">Assign</button><button class="btn btn-warning btn-sm" ng-click="grid.appScope.edit(row.entity)">Delete</button>'}
            { name: 'actions', enableFiltering:false, field:'Ticketid', width:465, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-click="grid.appScope.openAssignOrderModal(row.entity)">Assign</button><button class="btn btn-warning btn-sm" ng-click="grid.appScope.edit(row.entity)">Delete</button>'}
        ],
    };

    

    $scope.edit = function(data) {  
        //$scope.info.onloading = true; 
//console.log(data);  
        if(confirm('Are you sure want to cancel? ? [' + data.zoomorderid + ']?') ==true ) {
            $scope.data = data.zoomorderid;
        $http.get('http://18.141.18.7/controlpanel/updatePosLaju.php?data='+$scope.data)      
        .success(function(response) 
        { 
            
            console.log(response);
            $scope.info.onloading = false;     
            $scope.getOrderList();        
            for(var i=0; i< respose.result.length;i++){
                
            }
        $scope.gridOptions.data = response.result; 
        })
        .error(function () 
        {
            $scope.info.onloading = false;
            alert('Unable to get data ' );
        }); 
    } else {
        return false; 
    }
} 
$scope.deleteAll = function(data) {  
        if(confirm('Are you sure want to cancel? ? [' + data.zoomorderid + ']?') ==true ) {
            $scope.data = data.zoomorderid;
        $http.get('http://18.141.18.7/controlpanel/updatePosLaju.php?data='+$scope.data)      
        .success(function(response) 
        { 
            
            console.log(response);
            $scope.info.onloading = false;     
            $scope.getOrderList();        
            for(var i=0; i< respose.result.length;i++){
                
            }
        $scope.gridOptions.data = response.result; 
        })
        .error(function () 
        {
            $scope.info.onloading = false;
            alert('Unable to get data ' );
        }); 
    } else {
        return false; 
    }
} 
    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.getDriver = function()
	{
		$http.get('http://18.141.18.7/controlpanel/getDriver.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.rawDrivers = respone.records;

            $scope.driverlist.available=[];
            $scope.driverlist.onroad = [];
	        $scope.listAllDriver=[];
            for(var idx=0;idx<respone.records.length;idx++)
            {
                if(respone.records[idx].n_id == "128" || respone.records[idx].n_id == "129") continue;
                
                $scope.listAllDriver.push(respone.records[idx]);
                if(respone.records[idx].status=="1"){
                    var tmp = respone.records[idx];
                    tmp.label = tmp.driverid+' | '+tmp.drivertype + (tmp.reserve == "" ? "" : " | "+tmp.reserve);
                    
                    $scope.driverlist.available.push(tmp);
                    //$scope.driverlist.available.push(respone.records[idx]);
                }else{
                    if(respone.records[idx].drivertypeid == "1"){
                        var tmp = respone.records[idx];
                        tmp.label = tmp.driverid+' | '+tmp.drivertype + (tmp.reserve == "" ? "" : " | "+tmp.reserve);
                        
                        $scope.driverlist.onroad.push(tmp);
                    }
                    
                }
            }
		})
		.error(function () 
		{
			console.log('Unable to get Driver' );
		});
	};

    $scope.getOrderList = function(){
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getBasketOrder.php', data:{'data':''},  
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
                url: 'http://18.141.18.7/controlpanel/getNearDriver.php',
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

    $scope.unGroup= function(id){
        if(confirm('Are your sure want to unGroup order?')){
            var data = {
                zoomorderid:id.zoomorderid
            };
            
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/unGroupOrder.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                //console.log(respone);
                if(respone.message == "OK"){
			$scope.getOrderList();
                    alert('Ungroup Order Success');
                    $uibModalInstance.close('');
                }else{
                    alert('Ungroup Order Reject by server. Please Try Again.');
                }
                
            }).error(function (respone, status, headers, config){
                alert('unGroup Failed');
            });
        }        
    }
	
	$scope.printGroup= function(data){
	 $window.open('http://18.141.18.7/controlpanel/print_receipt.php?groupid='+data.zoomorderid);
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
    $scope.openPreassignOrderModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'PreassignOrderModal.html',
            controller: 'PreassignOrderModalCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    return data.zoomorderid;
                },
                drivers: function(){
                    return $scope.driverlist.onroad;
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
        /*var r = confirm('Are your sure want to broadcast this orders?');               
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
        }*/
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modalAddBroadcast.html',
            controller: 'modalAddBroadcastCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    return id;
                }
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            //$scope.getDriver();
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
        
        //$rootScope.eventInit.push($interval(function(){
        //    $scope.getDriver();
        //},10000));        
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
        },50000));
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
        if(confirm('Are your sure want to Assign this order?')){
            var data = {
                usr:$scope.input.assignTo,
                zoomorderid:$scope.orderId
            };
            
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/setReservationOrder.php', data:{'data':jsonData},  
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

angular.module('app')
.controller('PreassignOrderModalCtrl', ['$scope', '$uibModalInstance', 'orderId', 'drivers', '$http', 'uiGridConstants', function ($scope, $uibModalInstance, orderId, drivers, $http, uiGridConstants) {
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

    $scope.gridActiveZoomerOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'zoomer' , displayName:'Zoomer', width:120 },
            { field: 'finish' , displayName:'Delivered Task', width:120 },
            { field: 'total' , displayName:'Total Task', width:120,
                sort: {
                  direction: uiGridConstants.ASC,
                  priority: 1
                }
            },
            { field: 'remaining' , displayName:'Remaining Task', width:120,
               sort: {
                  direction: uiGridConstants.ASC,
                  priority: 0
                }
            },
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

    

    $scope.getActiveZoomer = function(){
        var data = {'rootid':$scope.orderId};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getActiveZoomer.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.gridActiveZoomerOptions.data = respone.records;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
    
    $scope.ok = function () {
        if(confirm('Are your sure want to Preassign this order?')){
            var data = {
                usr:$scope.input.assignTo,
                zoomorderid:$scope.orderId
            };
            
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/setPreassignOrder.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                if(respone.message == "OK"){
                    alert('Pre-assign Order Success');
                    $uibModalInstance.close('');
                }else{
                    alert('Pre-assign Order Reject by server. Please Try Again.');
                }
                
            }).error(function (respone, status, headers, config){
                alert('Pre-assign Failed');
            });
        }        
        //$uibModalInstance.close(''); //close return something
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDetail();
    $scope.getActiveZoomer();
}]);


angular.module('app')
.controller('ManualOrderModalCtrl', ['$scope', '$uibModalInstance', 'orderId', 'drivers', '$http', function ($scope, $uibModalInstance, orderId, drivers, $http) {
    $scope.orderId = orderId;
    $scope.drivers = drivers;
    $scope.detailOrders = [];
    $scope.order = {};
    $scope.input = {
        assignTo:0,
    }
    $scope.datepicker = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date(),
    };
    $scope.isDelivered=false;

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
            { field: 'cod' , enableCellEdit: false, displayName:'COD Amount',type: 'number', cellFilter: 'number: 2',width:110 },
			{ field: 'ActualCOD' , displayName:'COD Collect', cellFilter: 'number: 2', type: 'number', width:110 }
        ],
    };

    $scope.open = function() {
        $scope.datepicker.isOpen = true;
    };

    $scope.getDetail = function(){
        var data = {'rootid':$scope.orderId};
        jsonData = CRYPTO.encrypt(data);
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getOrderGroupDetail.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
			//console.log(respone.result);
			for(var i=0, length=respone.result.length;i<length;i++){
				for ( var temp in respone.result[i] )
                {
                        respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
                }
			}
			//console.log(respone.result);
            $scope.order = respone.result[0];
            $scope.detailOrders = respone.result;
            $scope.gridDetailOrdersOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
    
    $scope.ok = function () {
	if( $scope.input.assignTo.n_id==undefined  && $scope.isDelivered==true )
	{
                alert('Please choose Zoomer');
	} else 
	{       
        if(confirm('Are your sure want to Edit this order?')){
            var date = $scope.datepicker.requestDate.getDate();
            var month =$scope.datepicker.requestDate.getMonth();
            var year = $scope.datepicker.requestDate.getFullYear();

            date = ((parseInt(date) + 100).toString()).substr(1);
            month = ((parseInt(month) + 101).toString()).substr(1);
			var listCOD=[];
			for(var idx=0;idx<$scope.gridDetailOrdersOptions.data.length;idx++)
            {
				var codvalue=0;				
				if( $scope.gridDetailOrdersOptions.data[idx].ActualCOD==undefined )
				{
					codvalue=0;
				}				
				else
				{
					codvalue = $scope.gridDetailOrdersOptions.data[idx].ActualCOD;
				}
				listCOD.push({zoomid:$scope.gridDetailOrdersOptions.data[idx].zoom_orderid,actcod:codvalue});            
            }
            var data = {
                usr:$scope.input.assignTo.n_id,
                validdate:year+month+date,
                delivered:$scope.isDelivered,
                zoomorderid:$scope.orderId,
				listcod:listCOD
            };
  		//console.log('user : '+ $scope.input.assignTo.n_id);          
  		//console.log('orderid : '+$scope.orderId);          
  		//console.log('Tanggal : '+year+month+date);          
  		//console.log('delivered : '+$scope.isDelivered);          

            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/setManualOrder.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                //console.log(respone);
                if(respone.message == "OK"){
                    alert('Edit Order Success');
                    $uibModalInstance.close('');
                }else{
                    alert('Edit Order Reject by server. Please Try Again.');
                }
                
            }).error(function (respone, status, headers, config){
                alert('Edit Failed');
            });

        }
	}
        //$uibModalInstance.close(''); //close return something
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDetail();
}]);
