angular.module('app')
.controller('orderListCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    $scope.interval = {
        requestOrder:null,
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
            
            { field: 'zoom_orderid', displayName : 'Order ID', width:60, cellTemplate:'<div class="ui-grid-cell-contents">{{ row.entity.zoom_orderid }}&nbsp;&nbsp;<button class="btn btn-primary btn-xs" ng-click="grid.appScope.openDetailOrderModal(row.entity.zoom_orderid)">+</button></div>' },
            
            { field: 'partner_name' , displayName:'Partner', width:150 },
            { field: 'pickup_name', displayName : 'Pickup Name', width:150 },
            { field: 'pickup_address', displayName : 'Pickup Address', width:300 },
            { field: 'delivery_contact', displayName : 'Receiver Name', width:150 },
            { field: 'delivery_phone' , displayName:'Receiver Phone', width:150 },
            { field: 'delivery_address' , displayName:'Delivery Address', width:300 },
            { field: 'delivery_instruction' , displayName:'Delivery Instruction', width:300 },
            { field: 'status', displayName:'Status', width:100
                /*filter: {
                    term: '',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
                }*/
            },
            /*{ name: 'actions', enableFiltering:false, field:'firstname', cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.rootid == row.entity.zoom_orderid" ng-click="grid.appScope.showMe(row.entity)">Request Zoomer</button>'}*/
            //{ name: 'actions', enableFiltering:false, field:'firstname', width:250, pinnedRight:true , cellTemplate:'<button class="btn btn-sm" ng-class="row.entity.new_auto_manual == \'M\' ? \'btn-primary\' : \'btn-default\'" ng-click="grid.appScope.doManual(row.entity)">Manual</button> <button class="btn btn-sm" ng-class="row.entity.new_auto_manual == \'A\' ? \'btn-primary\' : \'btn-default\'" ng-click="grid.appScope.doAuto(row.entity)">Auto</button>'}
            { name: 'actions', enableFiltering:false, field:'firstname', width:250, pinnedRight:true , cellTemplate:'<button class="btn btn-sm" ng-class="row.entity.new_auto_manual == \'M\' ? \'btn-primary\' : \'btn-default\'" ng-click="grid.appScope.doManual(row.entity)">Manual</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.getOrderList = function(){
        var today = new Date();
        var date = today.getDate();
        var month = today.getMonth();
        var year = today.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);
        
        $http.get('http://18.141.18.7/controlpanel/getOrderList.php?date='+year+month+date)		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
            for(var i=0, length=respone.result.length;i<length;i++){
               for ( var temp in respone.result[i] )
               {
                  respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
               }
            }
            for(var i=0, length=respone.result.length;i<length;i++){
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
			alert('Unable to get order list ' );
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

    $scope.batchRequest = function(){
        if($rootScope.eventInit[0] != null){
            $interval.cancel($rootScope.eventInit[0]);
            $rootScope.eventInit = [];
        }
        
        var temp = { result : $scope.gridOptions.data };
        
        var jsonData = CRYPTO.encrypt(temp);
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/batchRequestDriver.php', data:{'data' : jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            alert('Request Success');
            $rootScope.eventInit.push($interval(function(){
                $scope.getOrderList();
            },15000)); 
            $scope.getOrderList(); 
        }).error(function (respone, status, headers, config) 
		{
            $rootScope.eventInit.push($interval(function(){
                $scope.getOrderList();
            },15000)); 
            $scope.getOrderList(); 
            
			console.log('error on get driver info')
		});
    }
    $scope.doManual=function(data){
        //console.log(data);  
        if(data.new_auto_manual == "M")
            data.new_auto_manual = "";
        else
        data.new_auto_manual="M";
    };
    $scope.doAuto=function(data){
        //console.log(data);  
        /*
        if(data.new_auto_manual == "A")
            data.new_auto_manual = "";
        else
            data.new_auto_manual="A";
	*/
    };
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $scope.getOrderList();
        
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
        },15000));  
    };
    $scope.init();
}]);

