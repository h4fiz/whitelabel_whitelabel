angular.module('app')
.controller('reportSummaryMarketplaceCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', 'uiGridConstants', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, uiGridConstants){

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
            { field: 'date', displayName : 'Date' },
            { field: 'partnername' , displayName:'Partner'},
            { field: 'zoomer' , displayName:'Zoomer' },
            { field: 'totalparcel' , displayName:'Total Parcel', type: 'number', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>' },
            { field: 'totalparceldelivered' , displayName:'Parcel Delivered', type: 'number', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>' },
            { field: 'totalcancel' , displayName:'Cancel by SMS', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue() }}</div>' },
            { field: 'totalcodneedtocollect' , displayName:'Total COD',type: 'number', cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>' },
            { field: 'totalcod' , displayName:'COD Collected', type: 'number' , aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>' },
            { field: 'totalrevenue' , displayName:'Total Revenue',type: 'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>' },
            { field: 'revenuecod' , displayName:'COD Revenue',type: 'number' ,aggregationType: uiGridConstants.aggregationTypes.sum, footerCellTemplate: '<div class="ui-grid-cell-contents" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>' },
	    { name: 'actions', enableFiltering:false, field:'Ticketid', width:150, pinnedRight:true, cellTemplate:'<button class="btn btn-warning    btn-sm"   ng-click="grid.appScope.edit(row.entity)">Edit</button><button class="btn btn-danger btn-sm"   ng-click="grid.appScope.delete(row.entity)">Delete</button>'},
		
			
        ],
    };
	$scope.delete = function(item) { 
        //$scope.info.onloading = true; 
        if(confirm('Are your sure want to Delete Market Place? [' + item.id_market + ']?') ==true ) {

            $scope.data = item.id_market;
        $http.get('http://18.141.18.7/controlpanel/deleteReportMarketPlace.php?data='+$scope.data)		
		.success(function(respone) 
		{
            
			console.log(respone);
            $scope.info.onloading = false;     
            $scope.getData();        
            /*for(var i=0; i< respone.result.length;i++){
            	
            }*/
			$scope.gridOptions.data = respone.result;
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
    $scope.edit = function (data) {
        console.log(data);
        $state.go('reportSummaryMarketplaceEdit', { data: { data: data } });
    }
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
        $http.get('http://18.141.18.7/controlpanel/getReportSummaryMarketplace.php?from='+fromDate+'&to='+toDate)		
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
