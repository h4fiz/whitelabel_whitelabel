angular.module('app')
.controller('reportOnPercentagePayoutCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

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
	    enableSelectAll: true,
        columnDefs:[
            //{ field: 'zoom_orderid', displayName : 'ID', width:250, cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.getDetail(row.entity.zoom_orderid)">+</button>&nbsp;&nbsp;{{ row.entity.zoom_orderid }}</div>' },
            { field: 'date', displayName : 'Date', width:400 },
            { field: 'groupid' , displayName:'GroupID', width:450 },
            { field: 'payout', displayName : '%Payout', width:550 },
           
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
		//alert('123');
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
        $scope.getData();
    };
    /*-----FINISH DATEPICKER----*/

    $scope.getData = function(){
		
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
        
        $http.get('http://18.141.18.7/controlpanel/getReportOnPercentagePayout.php?startdate='+yearStart+monthStart+dateStart+'&enddate='+yearEnd+monthEnd+dateEnd+'&key='+$scope.secret.key)		
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
