angular.module('app')
.controller('acceptanceHistoryCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$rootScope','uiGridConstants','$location', function($state, $scope, $timeout, $interval, $http, $uibModal, $rootScope, uiGridConstants,$location){
	$scope.dataTable = [];
	$scope.OptType='3';
	$scope.OptTypeList=[];
    $scope.interval = {
        requestOrder:null,
    }
    $scope.datepicker = {
        requestDate:new Date(),
        isOpen:false,
        options:{
			maxDate: new Date(),
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date(),
    };
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
            { field: 'accepted', displayName : 'Accepted', type: 'number', cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:right">{{col.getAggregationValue() | number:0 }}</div>', width:100},
            { field: 'confirmed', displayName : 'Confirmed', type: 'number',  cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:right">{{col.getAggregationValue() | number:0 }}</div>', width:100 },
			{ field: 'driverid', displayName : 'Accepter', width:150 },
        ],
    };
	$scope.open = function() {
        $scope.datepicker.isOpen = true;
    };
	$scope.getOrderList = function(){
		
		var date = $scope.datepicker.requestDate.getDate();
        var month =$scope.datepicker.requestDate.getMonth();
        var year = $scope.datepicker.requestDate.getFullYear();
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);

        $http.get('http://'+$location.$$host+'/controlpanel/getAcceptanceHistory.php?date='+year+month+date+'&type='+$scope.OptType)		
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
	$scope.getPartnerType();
	$scope.getOrderList();
}]);

