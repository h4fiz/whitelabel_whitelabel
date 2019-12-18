angular.module('app')
.controller('zoomBroadcastHistoryCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    //$scope.list = [];
	$scope.TypeofZoomer=[];
	$scope.Data={};
	$scope.Data.NoZoomer=1;
	$scope.Data.Timeout=30;
	$scope.Data.Type="1";
    /*$scope.datepickerStart = {
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
    };*/
    
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
            { field: 'timestamp', displayName : 'Timestamp'  },
            { field: 'date', displayName : 'Date'  },
            { field: 'qty', displayName : 'Qty'  },
            { field: 'type', displayName : 'Type' },
            { field: 'timeout', displayName : 'Timeout' },
			{ name: 'actions', enableFiltering:false,width:200, field:'userid', cellClass: 'grid-align', cellTemplate:'<button class="btn btn-success btn-sm" ng-click="grid.appScope.openBroadcastModal(row.entity)">Detail</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    
     $scope.getBroadcastList = function(){
		
        $http.get('http://18.141.18.7/controlpanel/getBroadcastHistory.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			for(var i=0, lengthI=respone.result.length;i<lengthI;i++)
			{
				for ( var temp in respone.result[i] )
				{
					respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);					
				}
			}
			$scope.gridOptions.data= respone.result;
		})
		.error(function () 
		{
			alert('Unable to get order list ' );
		});
		
    };
    	
	$scope.openBroadcastModal = function(row){
		
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
    }
	
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 290;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        //$scope.getList();
		$scope.getBroadcastList();
    };
    $scope.init();
}]);



