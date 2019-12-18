angular.module('app')
.controller('zoomBroadcastCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    //$scope.list = [];
	$scope.TypeofZoomer=[];
	$scope.Data={};
	$scope.Data.NoZoomer=1;
	$scope.Data.Timeout=30;
	$scope.Data.Type="1";
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
			{ name: 'actions', enableFiltering:false,width:200, field:'userid', cellClass: 'grid-align', cellTemplate:'<button class="btn btn-primary btn-sm" ng-click="grid.appScope.resend(row.entity)">Resend</button> <button class="btn btn-danger btn-sm" ng-click="grid.appScope.closeBroadcast(row.entity)">Close</button> <button class="btn btn-success btn-sm" ng-click="grid.appScope.openBroadcastModal(row.entity)">Detail</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.sendBroadcast= function(){
		var today = new Date();
		today.setHours(0,0,0,0);
		$scope.datepickerStart.requestDate.setHours(0,0,0,0);
		var date = $scope.datepickerStart.requestDate.getDate();
        var month =$scope.datepickerStart.requestDate.getMonth();
        var year = $scope.datepickerStart.requestDate.getFullYear();        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);		
		var diffDays = Math.ceil((Math.abs($scope.datepickerStart.requestDate.getTime() - today.getTime())) / (1000 * 3600 * 24));
		
		if( $scope.datepickerStart.requestDate<today )
		{
			alert ("Date cannot be past");
		}else if  ( diffDays>1 ){
			alert ("Maximum date tommorow");
		} else 
		{
			if( $scope.Data.NoZoomer>0 &&  $scope.Data.NoZoomer<100)
			{
				var r = confirm(  "Are you sure want to broadcast it ?");				
				if (r == true) {					
					 var param = {
						tgl:year+month+date,
						type:$scope.Data.Type,
						qty:$scope.Data.NoZoomer,
						timeout:$scope.Data.Timeout
					};
					var jsonData = CRYPTO.encrypt(param);
					var url = 'http://18.141.18.7/controlpanel/addBroadcast.php';
					
					$http({method: 'POST',url:url, data:{'data':jsonData},  
						headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
					{
						if( 'OK'==respone.message )
						{
							alert ("Sent to "+respone.counter+ " zoomer");
							$scope.getBroadcastList();
						}
					})
					.error(function (respone, status, headers, config){
						alert('Unable to send broadcast messages ' );
					});
				}
			} else 
			{
				alert ("Number of zoomer between 1 - 99");
			}
        }
    };

    $scope.getList = function(){
		
        $http.get('http://18.141.18.7/controlpanel/getZoomerType.php')
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
			$scope.TypeofZoomer = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get zoomer type' );
		});
		
    };

     $scope.getBroadcastList = function(){
		
        $http.get('http://18.141.18.7/controlpanel/getBroadcastList.php')		
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

     $scope.resend= function(id){
        if(confirm('Are your sure want to Resend ?')){
            var data = {
                ID:id.broadastid
            };            
            var jsonData = CRYPTO.encrypt(data);            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/resendBroadcast.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                if(respone.message == "OK"){					
                    alert("Resent to "+respone.counter+ " zoomer");                   
                }else{
                    alert(respone.message);
                }
            }).error(function (respone, status, headers, config){
                alert('Resend Failed');
            });
			
        }        
    }
	
	$scope.closeBroadcast= function(id){
        if(confirm('Are your sure want to close submition ?')){
            var data = {
                ID:id.broadastid
            };            
            var jsonData = CRYPTO.encrypt(data);            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/closeBroadcast.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                if(respone.message == "OK"){					
                    //alert("Notif to "+respone.counter+ " zoomer");  
					alert("Closing done");  
					$scope.getBroadcastList();
                }else{
                    alert(respone.message);
                }
            }).error(function (respone, status, headers, config){
                alert('Resend Failed');
            });
			
        }        
    }
	
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
        $scope.getList();
		$scope.getBroadcastList();
    };
    $scope.init();
}]);

angular.module('app')
.controller('BroadcastModalCtrl', ['$scope', '$uibModalInstance', 'data', '$http', function ($scope, $uibModalInstance, data,  $http) {
    $scope.Data = data;    
    $scope.zoomers = [];
	$scope.getDetail = function(){
        var data = {'broadcastid':$scope.Data.broadastid};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getBroadcastZoomer.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            for(var i=0, lengthI=respone.result.length;i<lengthI;i++)
			{
				for ( var temp in respone.result[i] )
				{
					respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);					
				}
			}
			$scope.zoomers= respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data');
        });
    };
	 $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
	$scope.getDetail();
}]);


