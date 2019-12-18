angular.module('app')
.controller('reportRevenueCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', 'uiGridConstants', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, uiGridConstants){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.myData = [];
    $scope.secret={
        key:''
    };
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
            { field: 'driverid', displayName : 'Driver ID',aggregationType: uiGridConstants.aggregationTypes.count, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  ng-style="row.entity.net<0 && {\'background-color\':\'#f4b7d9\'} || {\'color\': \'black\'}" >{{row.entity.driverid }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents" >Total Zoomer: {{col.getAggregationValue() }}</div>' },
            { field: 'totaldelivery' , displayName:'Total Delivered', type:'number', cellClass: 'grid-alignright' ,aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  ng-style="row.entity.net<0 && {\'background-color\':\'#f4b7d9\'} || {\'color\': \'black\'}" >{{row.entity.totaldelivery }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total: {{col.getAggregationValue() }}</div>' },
            { field: 'billing' , displayName:'Revenue', type:'number', cellClass: 'grid-alignright' ,aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  ng-style="row.entity.net<0 && {\'background-color\':\'#f4b7d9\'} || {\'color\': \'black\'}" >{{row.entity.billing | number:2 }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>'},
            { field: 'daily' , displayName:'Salary & Allowance', type:'number', cellClass: 'grid-alignright' ,aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  ng-style="row.entity.net<0 && {\'background-color\':\'#f4b7d9\'} || {\'color\': \'black\'}" >{{row.entity.daily | number:2 }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>'},
            { field: 'insentive' , displayName:'Insentive', type:'number', cellClass:  'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  ng-style="row.entity.net<0 && {\'background-color\':\'#f4b7d9\'} || {\'color\': \'black\'}" >{{row.entity.insentive | number:2 }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright"  >Total (RM): {{col.getAggregationValue() | number:2 }}</div>'},
			{ field: 'net' , displayName:'Net', type:'number', cellClass: 'grid-alignright' ,aggregationType: uiGridConstants.aggregationTypes.sum, 
				cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding"  ng-style="row.entity.net<0 && {\'background-color\':\'#f4b7d9\'} || {\'color\': \'black\'}" >{{row.entity.net | number:2 }}</div>' ,
				footerCellTemplate: '<div class="ui-grid-cell-contents grid-alignright" >Total (RM): {{col.getAggregationValue() | number:2 }}</div>'},
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
        $http.get('http://18.141.18.7/controlpanel/getZoomerRevenue.php?date='+year+month+date+'&date2='+year2+month2+date2+'&key='+$scope.secret.key)		
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
   // $scope.init();
}]);
