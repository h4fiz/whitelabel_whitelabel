angular.module('app')
.controller('slaDeliveryReportCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', 
    function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    
    $scope.fromDate = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date(),
    };
    $scope.openFrom = function() {
        $scope.fromDate.isOpen = true;
    };

    $scope.toDate = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date(),
    };
    $scope.openTo = function() {
        $scope.toDate.isOpen = true;
    };
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'partner_name' , displayName:'Vendor', width:150 },
            { field: 'parcel_count' , displayName:'Parcel Count', width:400 },
            { field: 'day1', displayName : 'Day 1', width:150 },
            { field: 'day2', displayName : 'Day 2', width:150 },
            { field: 'day3', displayName : 'Day 3', width:150 },
            { field: 'day4', displayName : 'Over day 3', width:150 },
            { field: 'success_percent', displayName : 'Success %', width:150 },
            /*{ name: 'actions', enableFiltering:false, field:'Ticketid', width:100, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.openAssignOrder(row.entity)">Assign Job</button>'}*/
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    
    $scope.reload= function(){
        $scope.getData();
    };

    $scope.getData = function(){
        var date = $scope.fromDate.requestDate.getDate();
        var month =$scope.fromDate.requestDate.getMonth();
        var year = $scope.fromDate.requestDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);
        
        var from = year+'-'+month+'-'+date;

        date = $scope.toDate.requestDate.getDate();
        month =$scope.toDate.requestDate.getMonth();
        year = $scope.toDate.requestDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);

        var to = year+'-'+month+'-'+date;
        
        
        $http.get('http://18.141.18.7/controlpanel/getSlaDeliveryReport.php?fromdate='+from+'&todate='+to)		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
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
			alert('Unable to get Data ' );
		});
    };

    $scope.openDetailOrderModal = function(id){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'DetailOrderModal.html',
            controller: 'DetailOrderModalCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    return id;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
    
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        
        $scope.getData();
        
        $rootScope.eventInit.push($interval(function(){
            $scope.getData();
        },15000));
    };
    $scope.init();
}]);
