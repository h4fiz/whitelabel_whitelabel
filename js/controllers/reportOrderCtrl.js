angular.module('app')
.controller('reportOrderCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.myData = [];
    $scope.rawDrivers={};
    $scope.modal = {
        show:false,
        title:"",
    };
    $scope.secret={
        key:''
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
            //{ field: 'zoom_orderid', displayName : 'ID', width:100, cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.getDetail(row.entity.zoom_orderid)">+</button>&nbsp;&nbsp;{{ row.entity.zoom_orderid }}</div>' },
            { field: 'pickup_timestamp', displayName : 'Date', width:100 },
            { field: 'partnername' , displayName:'Vendor', width:170 },
            { field: 'delivery_name', displayName : 'Receiver Name', width:150 },
            { field: 'delivery_phone', displayName:'Delivery Phone', width:200},
            { field: 'pickup_address' , displayName:'Pickup Address', width:450 },
            { field: 'delivery_address', displayName : 'Delivery Address', width:450 },
            { field: 'cod', displayName:'COD', width:100,  cellClass: 'grid-alignright', cellFilter: 'number: 2' },
            { field: 'actcod', displayName:'Collected', width:100,  cellClass: 'grid-alignright', cellFilter: 'number: 2' },
            { field: 'codflag', displayName:'COD Flag', width:80,  cellClass: 'grid-align' },
            { field: 'driverid', displayName:'Driver', width:100},
            { field: 'distance', displayName:'Distance (KM)', width:150 , cellClass: 'grid-alignright', cellFilter: 'number: 0'},
            { field: 'duration', displayName:'Duration (Minute)', width:150,  cellClass: 'grid-alignright', cellFilter: 'number: 0' },
            { field: 'deliverycharge', displayName:'Delivery Charge', width:150,  cellClass: 'grid-alignright', cellFilter: 'number: 2' },
            { field: 'billing', displayName:'Billing To Client', width:150,  cellClass: 'grid-alignright', cellFilter: 'number: 2' },
            { field: 'diff', displayName:'Differential', width:100,  cellClass: 'grid-alignright', cellFilter: 'number: 2' },
            { field: 'delivery_instruction', displayName:'Delivery Instruction', width:320},
            { field: 'zoom_orderid', displayName : 'ID', width:100 },
            { field: 'rootid' , displayName:'Group Order', width:100 }
            //{ field: 'status' , displayName:'Status', width:100 }
            /*{ name: 'actions', enableFiltering:false, field:'Ticketid', width:100, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.openAssignOrder(row.entity)">Assign Job</button>'}*/
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
        if( $scope.secret.key.length <6 )
        {
            alert("Your boss is watching you !!");
            return ;
        }
		
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
        
        console.log(yearStart+monthStart+dateStart);
	    console.log(yearEnd+monthEnd+dateEnd);
        
        $http.get('http://18.141.18.7/controlpanel/getReportHistory.php?startdate='+yearStart+monthStart+dateStart+'&enddate='+yearEnd+monthEnd+dateEnd+'&key='+$scope.secret.key)		
		.success(function(respone) 
		{
            //console.log(respone);
            respone = CRYPTO.decrypt(respone.data);
            console.log(respone);
            for(var i=0, length=respone.result.length;i<length;i++){
		        for ( var temp in respone.result[i] )
		        {
			        respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
		        }
	            respone.result[i].diff = respone.result[i].deliverycharge - respone.result[i].billing;
                //if( respone.result[i].cod==((respone.result[i].actcod=='')?0:respone.result[i].actcod) )
                if( respone.result[i].cod==respone.result[i].actcod && parseFloat(respone.result[i].cod)==0.0 )
                {
                    respone.result[i].codflag = ' ';
                } else if( respone.result[i].cod==respone.result[i].actcod )
                {
                    respone.result[i].codflag = 'Y';
                } else if ( parseFloat(respone.result[i].cod)>0 && parseFloat(respone.result[i].actcod)==0 )
                {
                    respone.result[i].codflag = 'N';
                } else
                {
                    respone.result[i].codflag = 'I';
                }
                respone.result[i].new_auto_manual= respone.result[i].auto_manual == "" ? "A" : respone.result[i].auto_manual;
                for(var j=0, length1= $scope.gridOptions.data.length;j<length1;j++){
                    if(respone.result[i].zoom_orderid == $scope.gridOptions.data[j].zoom_orderid){
                        respone.result[i].new_auto_manual = $scope.gridOptions.data[j].new_auto_manual == "" ? "A" : $scope.gridOptions.data[j].new_auto_manual;
                        break;
                    }
                }
            }
            
			$scope.gridOptions.data = respone.result;
            console.log('respone.result');
		})
		.error(function () 
		{
            //console.log('ABC1');
			alert('Unable to get report order ' );
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
