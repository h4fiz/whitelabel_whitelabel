angular.module('app')
.controller('groupOrderCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.list = [];
    $scope.partnerList = [];
    $scope.data = {
        partnerid:'',
    }
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: false,
        enableGridMenu: true,
        enableFiltering: false,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'zoomorderid', displayName : 'Order Number', width:100  },
            { field: 'shift', displayName : 'Delivery Shift', width:100  },
            { field: 'name', displayName : 'Reciever', width:200  },
            { field: 'partnername', displayName : 'Vendor', width:200  },
            { field: 'address', displayName : 'Drop off Address'  },
            { field: 'instruction', displayName : 'Instruction'  },
	        { name: 'actions', enableFiltering:false, field:'chk', width:80, pinnedRight:true, cellClass: 'grid-align', cellTemplate:'<input type="checkbox" ng-model="row.entity.chk">'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.getPartners = function(){
        $http.get('http://18.141.18.7/controlpanel/getPartnerNoGroup.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.partnerList = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
    };

    $scope.reload= function(){
        $scope.getList();
    };

    $scope.getList = function(){

        if( $scope.data.partnerid.partnerid.length>0 )
        {
            var data = {
                partnerid:$scope.data.partnerid.partnerid
            };
            var jsonData = CRYPTO.encrypt(data);

            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getNoGroupOrder.php', data:{'data':jsonData},  
                            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
                    {
                respone = CRYPTO.decrypt(respone.data);
                $scope.gridOptions.data = respone.result;
            })
            .error(function (respone, status, headers, config){
                alert('Unable to get order list ' );
            });
        } 
        else
        {
            alert ("Please choose vendor first");
        }
    };

    $scope.groupOrder = function(){
        var orders=[];
	    for(var i=0 ;i<$scope.gridOptions.data.length;i++)
        {
            if( $scope.gridOptions.data[i].chk==true )
	        {
                orders.push($scope.gridOptions.data[i].zoomorderid);
	            //	alert($scope.gridOptions.data[i].zoomorderid+'|'+$scope.gridOptions.data[i].chk);
	        }
        }
        var data = {
            orders:orders
        };
        var jsonData = CRYPTO.encrypt(data);
        
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/addGroupOrder.php', data:{'data':jsonData},  
        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            if(respone.message == "OK"){
                alert('Group Order Success');
		        $scope.getList(); 
            }else{
                alert('Group Order fail.');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Request Failed');
        });
    }
        
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        
        $scope.getPartners();

        /*$rootScope.eventInit.push($interval(function(){
            $scope.getList();
        },15000));*/
    };
    $scope.init();
}]);