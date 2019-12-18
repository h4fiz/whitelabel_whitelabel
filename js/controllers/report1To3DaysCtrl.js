angular.module('app')
.controller('report1To3DaysCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', 'uiGridConstants', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, uiGridConstants){

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
            { field: 'partnername', displayName : 'Partner' },
            { field: 'total' , displayName:'Parcel Total', type:'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>' },
            { field: 'day1' , displayName:'Day 1', type:'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>'},
            { field: 'day1percent', displayName : 'Day 1 (%)', type:'number' },
            { field: 'day2' , displayName:'Day 2', type:'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>'},
            { field: 'day2percent', displayName : 'Day 2 (%)', type:'number' },
            { field: 'day3' , displayName:'Day 3', type:'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>'},
            { field: 'day3percent', displayName : 'Day 3 (%)', type:'number' },
            { field: 'day4' , displayName:'Over Day 3', type:'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>'},
            { field: 'day4percent', displayName : 'Over Day 3 (%)', type:'number' },
            { field: 'available' , displayName:'Available', type:'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>'},
            { field: 'availablepercent', displayName : 'Available (%)', type:'number' },
            { field: 'success' , displayName:'Success (%)', type:'number' }
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

    $scope.datepicker2 = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date(),
    };
    $scope.open2 = function() {
        $scope.datepicker2.isOpen = true;
    };

    $scope.reloadOrder= function(){
        
        $scope.getData();
       
    };
    /*-----FINISH DATEPICKER----*/

    $scope.getData = function(){
        var date = $scope.datepicker.requestDate.getDate();
        var month =$scope.datepicker.requestDate.getMonth();
        var year = $scope.datepicker.requestDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);

        var fromDate = year+'-'+month+'-'+date;

         date = $scope.datepicker2.requestDate.getDate();
         month =$scope.datepicker2.requestDate.getMonth();
         year = $scope.datepicker2.requestDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);

        var toDate = year+'-'+month+'-'+date;
        
        //console.log(year+month+date);
        $scope.info.onloading = true;
        $http.get('http://18.141.18.7/controlpanel/getReport1To3Days.php?from='+fromDate+'&to='+toDate)		
		.success(function(respone) 
		{
			$scope.info.onloading = false;
            respone = CRYPTO.decrypt(respone.data);
            
            for(var i=0; i< respone.result.length;i++){
            	
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
