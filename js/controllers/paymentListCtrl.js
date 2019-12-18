angular.module('app')
.controller('paymentListCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$rootScope','uiGridConstants', function($state, $scope, $timeout, $interval, $http, $uibModal, $rootScope, uiGridConstants){
	$scope.dataTable = [];
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
            
            { field: 'id', displayName : 'Package ID', width:150,aggregationType: uiGridConstants.aggregationTypes.count },            
            { field: 'driverid' , displayName:'Driver', width:80 },
            { field: 'date', displayName : 'date', width:150 },
            { field: 'amount', displayName : 'amount', type: 'number', cellFilter: 'number: 2', cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:right">{{col.getAggregationValue() | number:2 }}</div>', width:100 },
			{ name: 'actions', enableFiltering:false, field:'id', width:300, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-click="grid.appScope.openCode(row.entity)">Payment Code</button>&nbsp;<button class="btn btn-primary btn-sm" ng-click="grid.appScope.openQRCode(row.entity)">QR</button>'}
        ],
    };
	
	$scope.openCode = function(data) {
			//alert('PackageID : '+data.id+'\nDriverID : '+data.driverid+'\nAmount : '+data.amount+'\nCode : '+data.code);
			alert('Code : '+data.code);
	};
	
	$scope.openQRCode = function(data) {
			
			
		var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'qr.html',
            controller: 'QRCtrl',
            size: 'sm',
            resolve: {
                code: function () {
                    return data.code;
                }
            },
            scope: $scope
        });
        modalInstance.result.then(function (returnValue) {
           
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });   
	};
	
	$scope.getOrderList = function(){
        var today = new Date();
        var date = today.getDate();
        var month = today.getMonth();
        var year = today.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);
        
        $http.get('http://18.141.18.7/controlpanel/getUnpaid.php')		
		.success(function(respone) 
		{
            //respone = CRYPTO.decrypt(respone.data);
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
	 $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
	$scope.getOrderList();
}]);

angular.module('app')
.controller('QRCtrl', ['$scope', '$uibModalInstance', 'code', '$timeout',
 function ($scope, $uibModalInstance, code, $timeout) {
	 $scope.qrcode={};
	 $scope.id=code;
	$scope.init = function() {
			//alert("asd "+code);
		$scope.qrcode = new QRCode(document.getElementById("qrcode_id"), {width : 100,height : 100});
		//$scope.qrcode = new QRCode(document.getElementById("qrcode_id"), code);
		$scope.qrcode.makeCode(code);
	}
	$timeout(function(){
            $scope.init();
    },100);
	
 }]);
