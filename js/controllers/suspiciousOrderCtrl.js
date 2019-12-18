angular.module('app')
.controller('suspiciousOrderCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    $scope.driverlist = {
        available:[]
    }
    $scope.info = {
        total:0,
    }
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : $scope.orders,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'zoomorderid', displayName : 'ID', width:100, pinnedLeft:true },
            { field: 'rootid', displayName : 'Group ID', width:100, pinnedLeft:true },
            { field: 'sortkey', displayName : 'Seq', width:70, pinnedLeft:true },
            /*{ field: 'status' , displayName:'Status', width:100,  pinnedRight:true },*/
            { field: 'partnername' , displayName:'Vendor', width:150 },
            /*{ field: 'Delivery_Shift', displayName:'Delivery Shift', width:150},*/
            { field: 'Pickup_Address' , displayName:'Pickup Address', width:400 },
            /*{ field: 'Delivery_Instruction', displayName:'Delivery Instruction', width:400},*/
            { field: 'Delivery_Address', displayName : 'Delivery Address', width:400 },
            { field: 'reason', displayName : 'Reason', width:400 },
            /*{ field: 'Pickup_Name' , displayName:'Pickup Name', width:150 },
            { field: 'Delivery_Name', displayName : 'Receiver Name', width:150 },
            { field: 'Delivery_Phone', displayName:'Delivery Phone', width:150},*/
            { name: 'actions', enableFiltering:false, field:'zoomorderid', width:200, pinnedRight:true, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.openUpdateModal(row.entity)">Update</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/

    $scope.getSuspiciousList = function(){
        var url = 'http://18.141.18.7/controlpanel/getSuspiciousOrder.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/getSuspiciousOrder.php";

        $http({method: 'POST',url: url, data:{'data':''},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            $scope.info.total = respone.records.length;
            for(var i=0, length=respone.records.length;i<length;i++){
                var arr = respone.records[i].timestamp.split(" ");
                
                var time = arr[1].split(":");
                respone.records[i].pickup_time = time[0]+":"+time[1];
                
                var date = arr[0].split(".");
                var month = "";
                switch(date[1].toLowerCase()){
                    case "jan": month="1";break;
                    case "feb": month="2";break;
                    case "mar": month="3";break;
                    case "apr": month="4";break;
                    case "may": month="5";break;
                    case "jun": month="6";break;
                    case "jul": month="7";break;
                    case "aug": month="8";break;
                    case "sep": month="9";break;
                    case "oct": month="10";break;
                    case "nov": month="11";break;
                    case "dec": month="12";break;
                }
                if( respone.records[i].timeout=='Y' )
				{
					respone.records[i].status='Timeout';
				}
                respone.records[i].pickup_date = date[2]+"/"+month+"/"+date[0];
   
            }
            $scope.orders = respone.records;
            $scope.gridOptions.data = respone.records;
            
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer reject')
        });
    };

    $scope.openUpdateModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'UpdateModal.html',
            controller: 'UpdateModalCtrl',
            size: 'lg',
            resolve: {
                params: function () {
                    return data;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getSuspiciousList();
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
        
        $scope.getSuspiciousList();
        
        $rootScope.eventInit.push($interval(function(){
            $scope.getSuspiciousList();
        },20000));
    };
    $scope.init();
}]);

angular.module('app')
.controller('UpdateModalCtrl', ['$scope', '$uibModalInstance', '$uibModal', 'params', '$http', function ($scope, $uibModalInstance, $uibModal, params, $http) {
    $scope.data = params;

    $scope.openMap = function(type){
        var param = {
            address: type == 'pickup' ? $scope.data.Pickup_Address : $scope.data.Delivery_Address,
            lat: type == 'pickup' ? $scope.data.Pickup_Lat : $scope.data.Delivery_Lat,
            lng:type == 'pickup' ? $scope.data.Pickup_Lng : $scope.data.Delivery_Lng
        }

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'MapModal.html',
            controller: 'MapModalCtrl',
            size: 'lg',
            resolve: {
                dataInput: function () {
                    return param;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            if(type == 'pickup'){
                $scope.data.Pickup_Address = returnValue.address;
                $scope.data.Pickup_Lat = parseFloat(returnValue.lat);
                $scope.data.Pickup_Lng = parseFloat(returnValue.lng);
            }else{
                $scope.data.Delivery_Address = returnValue.address;
                $scope.data.Delivery_Lat = parseFloat(returnValue.lat);
                $scope.data.Delivery_Lng = parseFloat(returnValue.lng);
            }
            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.update = function(){
        var param = {
            zoomorderid : $scope.data.zoomorderid,
            pickup_address: $scope.data.Pickup_Address,
            pickup_lat : $scope.data.Pickup_Lat,
            pickup_lng : $scope.data.Pickup_Lng,
            delivery_address: $scope.data.Delivery_Address,
            delivery_lat : $scope.data.Delivery_Lat,
            delivery_lng : $scope.data.Delivery_Lng,
        }
        var jsonData = CRYPTO.encrypt(param);
        var url = 'http://18.141.18.7/controlpanel/updateSuspicious.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/updateSuspicious.php";

        $http({method: 'POST',url:url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            
            if(respone.message.toLowerCase() == "ok"){
                alert('Update Address Success');
                $uibModalInstance.close('');
            }else{
                console.log(respone.message);
            }
            
        }).error(function (respone, status, headers, config){
            alert('Error update suspicious address : '+status);
        });
    };

}]);

