angular.module('app')
.controller('reportInsentiveCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', 'uiGridConstants', '$location', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, uiGridConstants, $location){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.myData = [];
    $scope.secret={
        key:''
    };
    $scope.info ={
   		total:0,
   		onloading:false
   	};
    
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
            { field: 'driverid', displayName : 'Driver ID', type:'number',aggregationType: uiGridConstants.aggregationTypes.count, width:80,
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  >{{row.entity.driverid }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() }}</div>' },
			{ field: 'date', displayName : 'Date',aggregationType: uiGridConstants.aggregationTypes.count, width:110,
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  >{{row.entity.date }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() }}</div>' },
			{ field: 'ondemand', displayName : 'OnDemand Task', type:'number', cellClass: 'grid-alignright',aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  >{{row.entity.ondemand }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >{{col.getAggregationValue() }}</div>' },
			{ field: 'ondemand_value', displayName : 'OnDemand Incentive', type:'number', cellClass: 'grid-alignright',aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  >{{row.entity.ondemand_value | number:2  }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>' },
			{ field: 'spesial', displayName : 'Special Task', type:'number', cellClass: 'grid-alignright',aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  >{{row.entity.spesial }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total: {{col.getAggregationValue()  }}</div>' },
			{ field: 'spesial_value', displayName : 'Special Incentive', type:'number', cellClass: 'grid-alignright',aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  >{{row.entity.spesial_value| number:2  }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>' },
			{ field: 'marketplace', displayName : 'MarketPlace Task', type:'number', cellClass: 'grid-alignright',aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  >{{row.entity.marketplace }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total: {{col.getAggregationValue() }}</div>' },
			{ field: 'marketplace_value', displayName : 'MarketPlace Incentive', type:'number', cellClass: 'grid-alignright' ,aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  >{{row.entity.marketplace_value| number:2  }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>' },
			{ field: 'total' , displayName:'Total', type:'number', cellClass: 'grid-alignright' ,aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding" >{{row.entity.total | number:2 }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    /*----START DATEPICKER---*/
	var yesterday  = new Date();
	yesterday.setDate(yesterday.getDate()-1);
    $scope.datepicker = {
        requestDate:yesterday,
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1,
			maxDate:yesterday
          },
        chooseDate:yesterday,
    };
	$scope.datepicker2 = {
        requestDate:yesterday,
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1,
			maxDate:yesterday
          },
        chooseDate:yesterday,
    };
    $scope.open = function() {
        $scope.datepicker.isOpen = true;
    };
	$scope.open2 = function() {
        $scope.datepicker2.isOpen = true;
    };
    $scope.reloadOrder= function(){
        $scope.datepicker.chooseDate = $scope.datepicker.requestDate;
		$scope.datepicker2.chooseDate = $scope.datepicker2.requestDate;
        $scope.getData();
       
    };
    /*-----FINISH DATEPICKER----*/

    $scope.getData = function(){
	if( $scope.secret.key.length <6 )
        {
            alert("Your boss is watching you !!");
            return ;
        }
        var date = $scope.datepicker.chooseDate.getDate();
        var month =$scope.datepicker.chooseDate.getMonth();
        var year = $scope.datepicker.chooseDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);
        
		var date2 = $scope.datepicker2.chooseDate.getDate();
        var month2 =$scope.datepicker2.chooseDate.getMonth();
        var year2 = $scope.datepicker2.chooseDate.getFullYear();
        
        date2 = ((parseInt(date2) + 100).toString()).substr(1);
        month2 = ((parseInt(month2) + 101).toString()).substr(1);
        
        //console.log(year+month+date);
        $scope.info.onloading = true;
        $http.get('http://'+$location.$$host+'/controlpanel/getZoomerInsentive.php?date='+year+month+date+'&date2='+year2+month2+date2+'&key='+$scope.secret.key)		
		.success(function(respone) 
		{
			$scope.info.onloading = false;
            respone = CRYPTO.decrypt(respone.data);
            //$scope.info.total = 0;
			console.log(respone);
			$scope.myData= respone.result;
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

   // $scope.init();
}]);
