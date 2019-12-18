angular.module('app')
.controller('acceptanceOrderCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$rootScope','uiGridConstants','$location', function($state, $scope, $timeout, $interval, $http, $uibModal, $rootScope, uiGridConstants,$location){
	$scope.dataTable = [];
	$scope.OptType='3';	//1-3 days
	$scope.OptTypeList=[];
    $scope.interval = {
        requestOrder:null,
    }
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : $scope.dataTable,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
		showColumnFooter: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            
            { field: 'partner', displayName : 'Partner', width:350,aggregationType: uiGridConstants.aggregationTypes.count },            
            { field: 'uploaded' , displayName:'Uploaded', type: 'number', cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:right">{{col.getAggregationValue() | number:0 }}</div>', width:100 },
            { field: 'qty' , displayName:'Qty', type: 'number', cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:right">{{col.getAggregationValue() | number:0 }}</div>', width:100 },
            { field: 'accepted', displayName : 'Accepted', type: 'number', cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:right">{{col.getAggregationValue() | number:0 }}</div>', width:100},
            { field: 'confirmed', displayName : 'Confirmed', type: 'number',  cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:right">{{col.getAggregationValue() | number:0 }}</div>', width:100 },
			{ field: 'driverid', displayName : 'Accepter', width:150 },
			{ name: 'actions', enableFiltering:false, field:'partner', width:360, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-click="grid.appScope.checkUA(row.entity)">Check UA</button> <button class="btn btn-warning btn-sm" ng-click="grid.appScope.checkAC(row.entity)">Check AC</button> <button class="btn btn-danger btn-sm" ng-click="grid.appScope.consolidate(row.entity)">Consolidate</button> <button class="btn btn-success btn-sm" ng-click="grid.appScope.submitToZoom(row.entity)">Submit</button>'}
        ],
    };
	
	$scope.getOrderList = function(){
		var tmp = new Date();

    	var year = tmp.getFullYear();
    	var month = (tmp.getMonth() + 1) < 10 ? ((tmp.getMonth() + 1)+'') : ('0'+(tmp.getMonth() + 1));
    	var date = (tmp.getDate() + 1) < 10 ? ((tmp.getDate() + 1)+'') : ('0'+(tmp.getDate() + 1));
        
        $http.get('http://'+$location.$$host+'/controlpanel/getAcceptanceOrder.php?type='+$scope.OptType)		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			//console.log(respone.result);
			for(var i=0, length=respone.result.length;i<length;i++){
				for ( var temp in respone.result[i] )
				{
					respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
				}
			}
            
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get order list ' );
		});
		
    };

    $scope.submitToZoom = function(item){
        if(item.uploaded != item.accepted || item.accepted != item.confirmed){
            alert('Uploaded, Accepted and Confirmed is not the same');
            return false;
        }

        if(confirm('Are your sure want to submit this consignment?')){
            var data = {
                partnerid:item.partnerid,
            };
            
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/submitConsignment.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                if(respone.message == "OK"){
                    alert('Submit Consignment Success');
                    $scope.getOrderList();
                }else{
                    alert('Submit Consignment Reject by server. Please Try Again.');
                }
                
            }).error(function (respone, status, headers, config){
                alert('Submit Consignment Failed. Error : '+status);
            });
        }   
    }

    $scope.checkAC = function(item){	//check accepted and confirm
    	var tmp = new Date();

    	var year = tmp.getFullYear();
    	var month = (tmp.getMonth() + 1) < 10 ? ((tmp.getMonth() + 1)+'') : ('0'+(tmp.getMonth() + 1));
    	var date = (tmp.getDate() + 1) < 10 ? ((tmp.getDate() + 1)+'') : ('0'+(tmp.getDate() + 1));

    	var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'CheckConsignmentACModal.html',
            controller: 'CheckConsignmentACModalCtrl',
            size: 'lg',
            resolve: {
                date: function () {
                    return year+'-'+month+'-'+date;
                },
                partnerid : function(){
                	return item.partnerid
                }
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.checkUA = function(item){	//check upload and accepted
    	var tmp = new Date();

    	var year = tmp.getFullYear();
    	var month = (tmp.getMonth() + 1) < 10 ? ((tmp.getMonth() + 1)+'') : ('0'+(tmp.getMonth() + 1));
    	var date = (tmp.getDate() + 1) < 10 ? ((tmp.getDate() + 1)+'') : ('0'+(tmp.getDate() + 1));

    	var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'CheckConsignmentUAModal.html',
            controller: 'CheckConsignmentUAModalCtrl',
            size: 'lg',
            resolve: {
                date: function () {
                    return year+'-'+month+'-'+date;
                },
                partnerid : function(){
                	return item.partnerid
                }
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.consolidate = function(item){
    	var tmp = new Date();

    	var year = tmp.getFullYear();
    	var month = (tmp.getMonth() + 1) < 10 ? ((tmp.getMonth() + 1)+'') : ('0'+(tmp.getMonth() + 1));
    	var date = (tmp.getDate() + 1) < 10 ? ((tmp.getDate() + 1)+'') : ('0'+(tmp.getDate() + 1));

    	var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ConsolidateConsignmentModal.html',
            controller: 'ConsolidateConsignmentModalCtrl',
            size: 'lg',
            resolve: {
                date: function () {
                    return year+'-'+month+'-'+date;
                },
                partnerid : function(){
                	return item.partnerid
                }
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getOrderList();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

	$scope.getPartnerType= function(){
		var url = 'http://'+$location.$$host+'/controlpanel/getPartnerType.php';		

		$http.get(url)
		.success(function(respone)
		{
			respone = CRYPTO.decrypt(respone.data);
			$scope.OptTypeList= respone.result;
		})
		.error(function ()
		{
			alert('Unable to get Billing list ' );
		});
    };
	 $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
	$scope.getOrderList();
	$scope.getPartnerType();
}]);


angular.module('app')
.controller('CheckConsignmentUAModalCtrl', ['$scope', '$uibModalInstance', 'date', 'partnerid', '$http', function ($scope, $uibModalInstance, date, partnerid, $http) {
    $scope.date = date;
    $scope.partnerid = partnerid;

    $scope.gridDetailOrdersOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            /*{ field: 'partnername', displayName : 'Partner', width:120 },*/
            { field: 'ticketid' , displayName:'Ticket ID' },
        ],
    };
    
    $scope.getDetail = function(){

        var data = {'date':$scope.date, 'partnerid': partnerid};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/checkConsignmentUA.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.gridDetailOrdersOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
    
    /*$scope.ok = function () {
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
    };*/

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDetail();
}]);

angular.module('app')
.controller('CheckConsignmentACModalCtrl', ['$scope', '$uibModalInstance', 'date', 'partnerid', '$http', function ($scope, $uibModalInstance, date, partnerid, $http) {
    $scope.date = date;
    $scope.partnerid = partnerid;

    $scope.gridDetailOrdersOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            /*{ field: 'partnername', displayName : 'Partner', width:120 },*/
            { field: 'ticketid' , displayName:'Ticket ID' },
        ],
    };
    
    $scope.getDetail = function(){

        var data = {'date':$scope.date, 'partnerid': partnerid};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/checkConsignmentAC.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.gridDetailOrdersOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDetail();
}]);

angular.module('app')
.controller('ConsolidateConsignmentModalCtrl', ['$scope', '$uibModalInstance', 'date', 'partnerid', '$http', function ($scope, $uibModalInstance, date, partnerid, $http) {
    $scope.date = date;
    $scope.partnerid = partnerid;

    $scope.gridDetailOrdersOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            /*{ field: 'partnername', displayName : 'Partner', width:120 },*/
            { field: 'ticketid' , displayName:'Ticket ID' },
            { name: 'actions', enableFiltering:false, field:'partner', width:120, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-click="grid.appScope.delete(row.entity)">Delete</button> '}
        ],
    };
    
    $scope.getDetail = function(){

        var data = {'date':$scope.date, 'partnerid': partnerid};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/checkConsignmentConsolidate.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.gridDetailOrdersOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }

    $scope.delete = function(item){
    	if(confirm('Are your sure want to delete this parcel?')){
            var data = {
                ticketid:item.ticketid,
            };
            
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/deleteConsignment.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                if(respone.message == "OK"){
                    alert('Delete Parcel Success');
                    $uibModalInstance.close('');
                }else{
                    alert('Delete Parcel Reject by server. Please Try Again.');
                }
                
            }).error(function (respone, status, headers, config){
                alert('Delete Parcel Failed');
            });
        }     
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDetail();
}]);