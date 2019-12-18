angular.module('app')
.controller('reportDeliveryZoomerCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', 'uiGridConstants', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, uiGridConstants){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.myData = [];
    $scope.info ={
   		total:0,
   		onloading:false
   	}
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : $scope.myData,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
		showColumnFooter: true,
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
		exporterPdfTableStyle: {margin: [10, 10, 10, 5]},
		exporterPdfOrientation: 'landscape',
        columnDefs:[
            { field: 'driverid', displayName : 'Driver ID',aggregationType: uiGridConstants.aggregationTypes.count, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Agent Delivery: {{col.getAggregationValue() }}</div>' },
            { field: 'totaldelivery' , displayName:'Total Delivered', type:'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>' },
            { field: 'totalpending' , displayName:'Total Pending', type:'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    /*----START DATEPICKER---*/
    $scope.datepicker = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date(),
    };
    $scope.open = function() {
        $scope.datepicker.isOpen = true;
    };
    $scope.reloadOrder= function(){
        $scope.datepicker.chooseDate = $scope.datepicker.requestDate;
        $scope.getData();
       
    };
    /*-----FINISH DATEPICKER----*/

    $scope.getData = function(){
        var date = $scope.datepicker.chooseDate.getDate();
        var month =$scope.datepicker.chooseDate.getMonth();
        var year = $scope.datepicker.chooseDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);
        
        //console.log(year+month+date);
        $scope.info.onloading = true;
        $http.get('http://18.141.18.7/controlpanel/getZoomerDeliveryPerDay.php?date='+year+month+date)		
		.success(function(respone) 
		{
			$scope.info.onloading = false;
            respone = CRYPTO.decrypt(respone.data);
            $scope.info.total = 0;
            for(var i=0; i< respone.result.length;i++){
            	$scope.info.total += parseInt(respone.result[i].totaldelivery);
            }
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			$scope.info.onloading = false;
			alert('Unable to get data ' );
		});
		
    };

    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $rootScope.eventInit.push($interval(function(){
            $scope.getData();
        },60000));
        
        $scope.getData();
    };
    $scope.init();
}]);
