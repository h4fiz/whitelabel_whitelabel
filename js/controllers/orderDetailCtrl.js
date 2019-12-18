angular.module('app')
.controller('orderDetailCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    
    $scope.data = {
        rootid:''
    }
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : [],
        
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'sortkey', displayName : 'No.', width:60 },
            /*{ field: 'pickup_name' , displayName:'Pickup Name', width:150 },
            { field: 'pickup_address' , displayName:'Pickup Address', width:400 },*/
            
            { field: 'delivery_contact', displayName : 'Receiver Name', width:150 },
            { field: 'delivery_address', displayName : 'Delivery Address', width:400 },
            { field: 'delivery_phone', displayName:'Delivery Phone', width:150},
            { field: 'delivery_instruction', displayName:'Delivery Instruction', width:400
                /*filter: {
                    term: '',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
                }*/
            },
            { field: 'status', displayName:'Status', width:150},
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.reloadOrder= function(){
        $scope.getOrderList($scope.data.rootid);
       
    };

    $scope.getOrderList = function(rootid){
        var data = {
            rootid:rootid
        };
        console.log(rootid);
        var jsonData = CRYPTO.encrypt(data);
        
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getOrderGroupDetail.php', data:{'data':jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++){
				for ( var temp in respone.result[i] )
                {
                        respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
                }
			}
            $scope.gridOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config){
            alert('Get Details Failed. Please try again');
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
        
    };
    $scope.init();
}]);