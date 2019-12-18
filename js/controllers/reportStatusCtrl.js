angular.module('app')
.controller('reportStatusCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope','uiGridConstants', '$location', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope,uiGridConstants, $location){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.myData = [];
    $scope.rawDrivers={};
    $scope.modal = {
        show:false,
        title:"",
    };
    
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : $scope.myData,
/*
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
*/
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
	    enableSelectAll: true,
		flatEntityAccess: true,		
		fastWatch: true,
		showColumnFooter: true,
        exporterCsvFilename: 'zoom_reportStatus.csv',
        exporterPdfDefaultStyle: {fontSize: 9},
	
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
        exporterPdfFooter: function ( currentPage, pageCount ) {
          return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
          docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
          return docDefinition;
        },
        //exporterPdfOrientation: 'landscape',
        //exporterPdfPageSize: 'LETTER',
        //exporterPdfPageSize: 'LEGAL',
        //exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function(gridApi){
          $scope.gridApi = gridApi;
        },
        columnDefs:[
            { field: 'partner', displayName : 'Partner', width:300 , aggregationType: uiGridConstants.aggregationTypes.count},
			{ field: 'partnertype', displayName : 'Type', width:200 },
			{ field: 'delivered', displayName : 'Delivered',  type: 'number', width:100, cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum },
			{ field: 'canceled', displayName : 'Cancelled', type: 'number',  width:100, cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum },
            { field: 'unsuccesfull' , displayName:'Unsuccessful', type: 'number',  width:100, cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum }
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    /*----START DATEPICKER---*/
    $scope.datepickerStart = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date()
    };
    $scope.openStart = function() {
        $scope.datepickerStart.isOpen = true;
    };
	
	$scope.datepickerEnd = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date(),
    };
    $scope.openEnd = function() {
        $scope.datepickerEnd.isOpen = true;
    };
	
    $scope.reloadOrder= function(){
        $scope.datepickerStart.chooseDate = $scope.datepickerStart.requestDate;
		$scope.datepickerEnd.chooseDate = $scope.datepickerEnd.requestDate;
        $scope.getOrderHistory();
    };
    /*-----FINISH DATEPICKER----*/

    $scope.getOrderHistory = function(){
       
        var dateStart = $scope.datepickerStart.chooseDate.getDate();
        var monthStart =$scope.datepickerStart.chooseDate.getMonth();
        var yearStart = $scope.datepickerStart.chooseDate.getFullYear();
		
		var dateEnd = $scope.datepickerEnd.chooseDate.getDate();
        var monthEnd =$scope.datepickerEnd.chooseDate.getMonth();
        var yearEnd = $scope.datepickerEnd.chooseDate.getFullYear();
        
        dateStart = ((parseInt(dateStart) + 100).toString()).substr(1);
        monthStart = ((parseInt(monthStart) + 101).toString()).substr(1);
		
		dateEnd = ((parseInt(dateEnd) + 100).toString()).substr(1);
        monthEnd = ((parseInt(monthEnd) + 101).toString()).substr(1);
        
      
        $http.get('http://'+$location.$$host+'/controlpanel/getReportStatus.php?from='+yearStart+monthStart+dateStart+'&to='+yearEnd+monthEnd+dateEnd)		
		.success(function(respone) 
		{
            //console.log(respone);
            respone = CRYPTO.decrypt(respone.data);
            //console.log(respone);
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
            //console.log('ABC1');
			alert('Unable to get report order ' );
		});
		
    };

    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 145;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        
    };
    $scope.init();
}]);
