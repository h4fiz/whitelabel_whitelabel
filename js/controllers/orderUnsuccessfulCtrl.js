angular.module('app')
.controller('orderUnsuccessfulCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$window', '$location',  function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $window, $location){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    $scope.listAllDriver=[];
    
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
		exporterPdfTableStyle: {margin: [10, 10, 10, 5]},
		exporterPdfOrientation: 'landscape',
        columnDefs:[
            { field: 'zoomorderid', displayName : 'ID', width:100, pinnedLeft:true  }, //cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.openDetailOrderModal(row.entity.zoomorderid)">+</button>&nbsp;&nbsp;{{ row.entity.zoomorderid }}</div>'
            { field: 'unsuccessfultime' , displayName:'Unsuccessful Datetime', width:160,  pinnedLeft:true },
            { field: 'status' , displayName:'Status', width:100,  pinnedRight:true },
            { field: 'reason' , displayName:'Reason', width:200 },
            { field: 'remark' , displayName:'Remark', width:300 },
            { field: 'partnername' , displayName:'Vendor', width:150 },
            /*{ field: 'Delivery_Shift', displayName:'Delivery Shift', width:150},*/
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
                        
            { field: 'driver', displayName:'Driver', width:80, pinnedRight:true  },
            /*{ name: 'actions', enableFiltering:false, field:'Ticketid', width:200, pinnedRight:true, 
                cellTemplate:'<button class="btn btn-success btn-sm" ng-click="grid.appScope.openEdit(row.entity, \'Delivery\')">Edit</button> <button class="btn btn-primary btn-sm" ng-click="grid.appScope.doConfirm(row.entity)">Confirm</button> <button class="btn btn-warning btn-sm" ng-click="grid.appScope.doManual(row.entity)">Manual</button>'}*/
            { name: 'actions', enableFiltering:false, field:'Ticketid', width:200, pinnedRight:true, 
                cellTemplate:'<button class="btn btn-success btn-sm" ng-click="grid.appScope.openEdit(row.entity, \'Delivery\')">Edit</button> <button class="btn btn-primary btn-sm" ng-click="grid.appScope.doConfirm(row.entity)">Confirm</button> '}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.getDriver = function()
    {
        $http.get('http://18.141.18.7/controlpanel/getDriverFullAndFreelancer.php')        
        .success(function(respone) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.listAllDriver = respone.records;

            $scope.listAllDriver.available=[];
            for(var idx=0;idx<respone.records.length;idx++)
            {
                //if(respone.records[idx].status=="1")
                    $scope.listAllDriver.available.push(respone.records[idx]);
            }
        })
        .error(function () 
        {
            console.log('Unable to get Driver' );
        });
    };

    $scope.getOrderList = function(){
        $http({method: 'POST',url:'http://'+$location.$$host+'/controlpanel/getUnsuccessfulOrder.php', data:{'data':''},  
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
/*
                if( respone.records[i].timeout=='Y' )
				{
					respone.records[i].status='Timeout';
				}
*/
                respone.records[i].pickup_date = date[2]+"/"+month+"/"+date[0];
                
   
            }
            $scope.orders = respone.records;
            $scope.gridOptions.data = respone.records;
            
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer reject')
        });
    };

    $scope.openEdit = function(data, type){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'UnsuccessfulEditModal.html',
            controller: 'UnsuccessfulEditModalCtrl',
            size: 'lg',
            resolve: {
                dataOrder: function () {
                    return data;
                },
                typeEdit : function () {
                    return type;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getOrderList();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
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
	
	$scope.doManual = function(data){
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'DeliveredManualModal.html',
            controller: 'DeliveredManualCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    return data.zoomorderid;
                },
				partnerName: function () {
                    return data.partnername;
                },
				deliveryName: function () {
                    return data.Delivery_Name;
                },
				deliveryAddress: function () {
                    return data.Delivery_Address;
                },
                drivers: function(){
                    return $scope.listAllDriver.available;
                }
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            //$scope.getDriver();
            //$scope.getOrderList();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
	}
	
    $scope.doConfirm = function(data){
        if(confirm('Are You sure to confirm this Unsuccessfull Order?')){
            var tmp = {
                zoomorderid : data.zoomorderid,
                rootid : data.rootid
            }
            var jsonData = CRYPTO.encrypt(tmp);

            $http({method: 'POST',url:'http://'+$location.$$host+'/controlpanel/setUnsuccessfulOrder.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                console.log(respone);
                if(respone.message == "OK"){
                    alert('Confirm Success');
                    $scope.getOrderList();
                    
                }else{
                    alert('Failed. Please try again');
                }
                
            }).error(function (respone, status, headers, config){
                alert('Failed. Please try again');
            });
        }   
    }
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        
        $scope.getOrderList();
        $scope.getDriver();
              
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
            $scope.getDriver();
        },15000));
    };
    $scope.init();
}]);

angular.module('app')
.controller('DeliveredManualCtrl', ['$scope', '$uibModalInstance', 'orderId', 'partnerName', 'deliveryName', 'deliveryAddress', 'drivers', '$http', '$location', function ($scope, $uibModalInstance, orderId, partnerName, deliveryName, deliveryAddress, drivers, $http, $location) {
    $scope.orderId = orderId;
    $scope.drivers = drivers;
	$scope.partnerName = partnerName;
	$scope.deliveryName = deliveryName;
	$scope.deliveryAddress = deliveryAddress;
    var startdate = new Date();
	startdate.setDate(startdate.getDate() - 7);
    $scope.datepicker = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1,
			maxDate: new Date(),
			minDate:startdate
          },
        chooseDate:new Date(),
    };
    $scope.isDelivered=true;

    $scope.input = {
        assignTo : ''
    }
	
   

    $scope.open = function() {
        $scope.datepicker.isOpen = true;
    };

    
    
    $scope.ok = function () {
	   
        if(confirm('Are your sure want to Edit this order?')){
            var date = $scope.datepicker.requestDate.getDate();
            var month =$scope.datepicker.requestDate.getMonth();
            var year = $scope.datepicker.requestDate.getFullYear();

            date = ((parseInt(date) + 100).toString()).substr(1);
            month = ((parseInt(month) + 101).toString()).substr(1);
			
            var data = {
                //usr:$scope.input.assignTo.n_id,
                validdate:year+month+date,
                zoomorderid:$scope.orderId,
                driverid : $scope.input.assignTo
            };
  		//console.log('user : '+ $scope.input.assignTo.n_id);    
			

            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://'+$location.$$host+'/controlpanel/setDeliveredManual.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                //console.log(respone);
                if(respone.message == "OK"){
                    alert('Edit Order Success');
                    $uibModalInstance.close('');
                }else{
                    //alert('Edit Order Reject by server. Please Try Again.');
					console.log(respone );
                }
                
            }).error(function (respone, status, headers, config){
                alert('Edit Failed');
            });

        }
	
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);


angular.module('app')
.controller('UnsuccessfulEditModalCtrl', ['$scope', '$uibModalInstance', 'dataOrder', 'typeEdit', '$http', '$uibModal', '$location', function ($scope, $uibModalInstance, dataOrder, typeEdit, $http, $uibModal, $location) {
    $scope.dataOrder = dataOrder;    
    $scope.typeEdit = typeEdit;
    $scope.input = {
        address:'',
        name:'',
        phone:'',
        lat:0,
        lng:0,
    };
    
    //============INITIAL=============
    $scope.init = function(){
        //console.log($scope.dataOrder);
        if($scope.typeEdit == 'Delivery'){
            $scope.input.address = $scope.dataOrder.Delivery_Address;
            $scope.input.name = $scope.dataOrder.Delivery_Name;
            $scope.input.phone = $scope.dataOrder.Delivery_Phone;
            $scope.input.lat = $scope.dataOrder.Delivery_Lat;
            $scope.input.lng = $scope.dataOrder.Delivery_Lng;
        }else{
            $scope.input.address = $scope.dataOrder.pickup_address;
            $scope.input.detail = $scope.dataOrder.pickup_detail;
            $scope.input.name = $scope.dataOrder.pickup_name;
            $scope.input.phone = $scope.dataOrder.pickup_phone;
            $scope.input.cod = 0;
            $scope.input.instruction = '';
            $scope.input.lat = $scope.dataOrder.pickup_lat;
            $scope.input.lng = $scope.dataOrder.pickup_lng;
        }
    }

    //============FUNCTION============
    $scope.doEdit = function(){
        
        if($scope.input.address == ""){
            alert('Please input '+$scope.typeEdit+' address');
            return false;
        }
        if($scope.input.phone == ""){
            alert('Please input '+$scope.typeEdit+' phone');
            return false;
        }

        var data = {
            zoomorderid:$scope.dataOrder.zoomorderid,
            address:$scope.input.address,
            phone:$scope.input.phone,
            lat:$scope.input.lat,
            lng:$scope.input.lng
        };
        console.log(data);
        var jsonData = CRYPTO.encrypt(data);
        
        var url = 'http://'+$location.$$host+'/controlpanel/editDeliveryUnsuccessful.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/editDeliveryUnsuccessful.php";


        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            if(respone.message.toUpperCase() == "OK"){
                
                if($scope.typeEdit=='Delivery'){
                    alert('Edit Delivery Success.');
                    //$scope.getDetail($scope.deliveryEdit.rootid);
                    $uibModalInstance.close($scope.typeEdit);
                }
                else{
                    alert('Edit Pickup Success.');
                    //$scope.getBasketOrder();
                    $uibModalInstance.close($scope.typeEdit);
                }
                
            }else{
                if($scope.typeEdit == 'Delivery')
                    alert('Edit Delivery Rejected by server');
                else
                    alert('Edit Pickup Rejected by server');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Edit Delivery Failed. Please try again');
        });
    }

    $scope.openMapModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'MapModal.html',
            controller: 'MapModalCtrl',
            size: 'lg',
            resolve: {
                dataInput: function () {
                    return data;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.input.address = returnValue.address;
            $scope.input.lat = returnValue.lat;
            $scope.input.lng = returnValue.lng;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.init();
}]);
