angular.module('app')
.controller('reportLoginCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.myData = [];
    
    
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
		exporterPdfTableStyle: {margin: [10, 10, 10, 5]},
		exporterPdfOrientation: 'landscape',
	    enableSelectAll: true,
        exporterCsvFilename: 'zoom_report.csv',
        exporterPdfDefaultStyle: {fontSize: 9},
        //exporterPdfTableStyle: {margin: [10, 10, 10, 10]},
	
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
       // exporterPdfHeader: { text: "Zoom Report", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
          return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
         // docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
          docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
          return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        //exporterPdfPageSize: 'LETTER',
        exporterPdfPageSize: 'LEGAL',
        //exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function(gridApi){
          $scope.gridApi = gridApi;
        },
        columnDefs:[
            { field: 'zoomerid', displayName:'Zoomer', width:100, type:'number'},
            { field: 'workingdate', displayName : 'Date', width:100 },
            { field: 'name' , displayName:'Name', width:200 },
            { field: 'mobile', displayName : 'Mobile', width:150 },
            { field: 'login' , displayName:'Login', width:180 },
            { field: 'logout', displayName : 'Logout', width:180 }
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

	
    $scope.reloadOrder= function(){
        $scope.datepickerStart.chooseDate = $scope.datepickerStart.requestDate;
        $scope.getOrderLogin();
    };
    /*-----FINISH DATEPICKER----*/

    $scope.getOrderLogin = function(){
        var dateStart = $scope.datepickerStart.chooseDate.getDate();
        var monthStart =$scope.datepickerStart.chooseDate.getMonth();
        var yearStart = $scope.datepickerStart.chooseDate.getFullYear();
		
        dateStart = ((parseInt(dateStart) + 100).toString()).substr(1);
        monthStart = ((parseInt(monthStart) + 101).toString()).substr(1);
		
        $http.get('http://18.141.18.7/controlpanel/getReportLogin.php?startdate='+yearStart+monthStart+dateStart)		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get order list ' );
		});
		
    };

    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 130;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        
    };
    $scope.init();
}]);
