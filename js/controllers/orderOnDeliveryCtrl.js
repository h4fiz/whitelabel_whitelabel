angular.module('app')
.controller('orderOnDeliveryCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

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
            /*{ field: 'pickup_time', displayName : 'Pickup Time', width: 90  },
            { field: 'pickup_date', displayName : 'Pickup Date', width:100  },*/
            { field: 'partnername' , displayName:'Vendor', width:150 },
            { field: 'Pickup_Name' , displayName:'Pickup Name', width:150 },
            { field: 'Pickup_Address' , displayName:'Pickup Address', width:400 },
            { field: 'Delivery_Name', displayName : 'Receiver Name', width:150 },
            { field: 'Delivery_Address', displayName : 'Delivery Address', width:400 },
            { field: 'Delivery_Phone', displayName:'Delivery Phone', width:150},
            { field: 'Delivery_Instruction', displayName:'Delivery Instruction', width:400
                /*filter: {
                    term: '',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
                }*/
            },
            { field: 'drivername', displayName:'Driver', width:100, pinnedRight:true },
            // new
            { name: 'actions', enableFiltering:false, field:'Ticketid', width:200, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.status.toString() == \'Available\'" ng-click="grid.appScope.unassign(row.entity)">Reassign</button> &nbsp; <button class="btn btn-warning btn-sm" ng-show="row.entity.status.toString() == \'Available\'" ng-click="grid.appScope.cancelModal(row.entity)">Cancel</button>'}
            // old
            // { name: 'actions', enableFiltering:false, field:'Ticketid', width:200, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.canreassign.toString() == \'1\'" ng-click="grid.appScope.unassign(row.entity)">Reassign</button><button class="btn btn-warning btn-sm" ng-click="grid.appScope.edit(row.entity)">Cancel</button>'}
        ],
    };

    $scope.edit = function(data) {  
        //$scope.info.onloading = true; 
        //console.log(data);  
        if(confirm('Are you sure want to cancel? ? [' + data.zoomorderid + ']?') ==true ) {
            $scope.data = data.zoomorderid;
            $http.get('http://18.141.18.7/controlpanel/updatePosLajuOrderOnDeliveryCancel.php?data='+$scope.data)      
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
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getOnDelivery.php', data:{'data':''},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            console.log(respone);
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
                respone.records[i].driverid = (parseInt(respone.records[i].driverid)+1000).toString().substr(1);
            }
            $scope.gridOptions.data = respone.records;
            
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer reject')
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

    $scope.unassign = function(data){
        if(data == undefined || data == null) {
            return false;
        }
        //alert promt
        if(confirm('Are your sure want to reassign order id : '+data.zoomorderid+' ?')){
        	
        	var tmp = {
	            zoomorderid:data.zoomorderid,
	            driverid:data.driverid
	        };
	        var jsonData = CRYPTO.encrypt(data);
	        
	        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/reassignOrderFromDelivery.php', data:{'data':jsonData},  
	                        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
	        {
	                alert('reassign Order Success');
	                $scope.getOrderList();
	    
	        }).error(function (respone, status, headers, config){

	            alert('reassign Failed');
	        });
        }
    }

    $scope.cancelModal = function (rawData) {
        var modalReset = $uibModal.open({
          animation: true,
          templateUrl: 'insertPasword.html',
          controller: 'insertPaswordCtrl',
          size: 'sm',
          resolve: {
            selectedRow: rawData
            }
        });
        
        modalReset.result.then(function (selectedItem) {
          //$scope.selected = selectedItem;
        }, function () {
        $scope.init();
        //$scope.getList(); 
        //console.log('Modal dismissed at: ' + new Date());
        });
        console.log(rawData);
    };
    
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
        },40000));        
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
        },45000));
		
    };
    $scope.init();
}]);

angular.module('app').controller('insertPaswordCtrl', function ($scope, $uibModalInstance, $http, $timeout, selectedRow, Upload) {
    $scope.dataed =[];
        $scope.dataed.zoomorderid=selectedRow.zoomorderid;
        $scope.dataed.Password='';
    $scope.data =[];
    console.log($scope.dataed);
        
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.cancelOrder = function(data) {   
            if ($scope.dataed.Password == "zoomitnow3368") {
                $scope.data = $scope.dataed.zoomorderid;
                $http.get('http://18.141.18.7/controlpanel/updatePosLajuOrderOnDeliveryCancel.php?data='+$scope.data)      
                .success(function(response)
                { 
                    if(response.message == "OK"){
                        alert('Request Success');
                        $uibModalInstance.dismiss('OK');
                        $scope.info.onloading = false;     
                        $scope.getOrderList();    
                    }
                    console.log(response);
                })
                .error(function () 
                {
                    $scope.info.onloading = false;
                    alert('Unable to get data ' );
                }); 

            } else {
                alert("Password Not Found");
            }
    } 

});
