angular.module('app')
.controller('modalAddBroadcastCtrl', ['$scope', '$uibModalInstance', 'orderId', '$http', function ($scope, $uibModalInstance, orderId, $http) {
    $scope.orderId = orderId;
    $scope.detailOrders = [];
    $scope.order = {};
    $scope.input = {
        freelancerFee:60
    }

    $scope.gridDetailOrdersOptions = {
        data : $scope.detailOrders,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'sortkey', displayName : 'No', enableFiltering:false, width:60 },
            { field: 'zoom_orderid' , displayName:'Order ID', width:100 },
            { field: 'rootid' , displayName:'Group ID', width:100 },
            { field: 'delivery_contact' , displayName:'Receiver Name', width:150 },
            { field: 'delivery_address' , displayName:'Delivery Address', width:250 },
            { field: 'delivery_phone' , displayName:'Delivery Phone', width:100 },
            { field: 'delivery_instruction' , displayName:'Delivery Instruction', width:250 },
            { field: 'cod' , displayName:'COD Amount', width:90 },
        ],
    };

    $scope.getDefaultFee = function(){
        var data = {'id':''};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getDefaultFreelancerFee.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);

            $scope.input.freelancerFee = parseInt(respone.records[0].fee);
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
    
    $scope.getDetail = function(){
        var data = {'rootid':$scope.orderId};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getOrderGroupDetail.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++){
				for ( var temp in respone.result[i] )
                {
                        respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
                }
			}
            $scope.order = respone.result[0];
            $scope.detailOrders = respone.result;
            $scope.gridDetailOrdersOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
    
    $scope.ok = function () {
        if($scope.input.freelancerFee > 100) {
            alert('Freelancer Fee can not bigger then 100%');
            return false;
        }
        if($scope.input.freelancerFee < 0){
            alert('Freelancer Fee can not lower then 0%');
            return false;
        }
        if($scope.input.freelancerFee == undefined){
            alert('Invalid Freelancer Fee value');
            return false;
        }

        if(confirm('Are your sure want to broadcast this order?')){
            var param = {
                zoomorderid : $scope.orderId,
                freelancerfee : parseInt($scope.input.freelancerFee)
            };
            var jsonData = CRYPTO.encrypt(param);
            var url = 'http://18.141.18.7/controlpanel/addBroadcast.php';
            
            $http({method: 'POST',url:url, data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},})
            .success(function (respone, status, headers, config) 
            {
                //console.log(respone);
                if( 'OK'==respone.message )
                {
                    alert ("Broadcast success");
                    $uibModalInstance.close('');
                }
            })
            .error(function (respone, status, headers, config){
                alert('Unable to send broadcast messages ' );
            });
        }        
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDefaultFee();
    $scope.getDetail();
}]);