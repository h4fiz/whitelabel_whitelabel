angular.module('app')
.controller('zoomerRatingCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    //$scope.list = [];
	$scope.list=[];
	$scope.Data={};
	$scope.Data.NoZoomer=1;
	$scope.Data.Timeout=30;
	$scope.Data.Type="1";

    $scope.datepickerFrom = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date()
    };
    $scope.datepickerTo = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date()
    };
    $scope.openFrom = function() {
        $scope.datepickerFrom.isOpen = true;
    };
    $scope.openTo = function() {
        $scope.datepickerTo.isOpen = true;
    };
    
    $scope.gridOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
		exporterPdfTableStyle: {margin: [10, 10, 10, 5]},
		exporterPdfOrientation: 'landscape',
        columnDefs:[
            { field: 'driver', displayName : 'Zoomer' },
            { field: 'avg', displayName : 'Average Rating'  },
            { field: 'min', displayName : 'Lowest Rating'  },
            { field: 'max', displayName : 'Highest Rating' },
            { field: 'qty', displayName : 'Task' },
			//{ name: 'actions', enableFiltering:false,width:200, field:'userid', cellClass: 'grid-align', cellTemplate:'<button class="btn btn-success btn-sm" ng-click="grid.appScope.openBroadcastModal(row.entity)">Detail</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    
     $scope.getRating = function(){
		
        var fromDate = $scope.datepickerFrom.requestDate.getDate();
        var fromMonth =$scope.datepickerFrom.requestDate.getMonth();
        var fromYear = $scope.datepickerFrom.requestDate.getFullYear();        
        fromDate = ((parseInt(fromDate) + 100).toString()).substr(1);
        fromMonth = ((parseInt(fromMonth) + 101).toString()).substr(1);	
         
        var from = fromYear+'-'+fromMonth+'-'+fromDate;
         
        var toDate = $scope.datepickerTo.requestDate.getDate();
        var toMonth =$scope.datepickerTo.requestDate.getMonth();
        var toYear = $scope.datepickerTo.requestDate.getFullYear();        
        toDate = ((parseInt(toDate) + 100).toString()).substr(1);
        toMonth = ((parseInt(toMonth) + 101).toString()).substr(1);	
         
        var to = toYear+'-'+toMonth+'-'+toDate;
         
         
        var data = {
            from: from, to: to
        };
        var jsonData = CRYPTO.encrypt(data);
        $http({method: 'POST'
                , url:'http://18.141.18.7/controlpanel/getZoomerRating.php'
                , data:{'data':jsonData}
                , headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
        }).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            console.log(respone.result);
            $scope.list = respone.result;
            $scope.gridOptions.data = $scope.list;

        }).error(function(respone){
            
        });
		
    };
    	
	/*$scope.openBroadcastModal = function(row){
		
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'BroadcastModal.html',
            controller: 'BroadcastModalCtrl',
            size: 'lg',
            resolve: {
                data: function () {
                    return row;
                }
            },
            scope: $scope
        });
		modalInstance.result.then(function (returnValue) {
           
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }*/
	
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 150;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        //$scope.getList();
		$scope.getRating();
    };
    $scope.init();
}]);



