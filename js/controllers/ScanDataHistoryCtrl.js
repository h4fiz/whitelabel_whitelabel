angular.module('app')
.controller('ScanDataHistoryCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    $scope.driverlist = {
        available:[]
    }
    $scope.info = {
        total:0,
        cod:0,
        collected:0
    }
    $scope.datepicker = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date(),
    };
    
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
            { field: 'zoom_orderid', displayName : 'ID', width:100, cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.openDetailOrderModal(row.entity.zoom_orderid)">+</button>&nbsp;&nbsp;{{ row.entity.zoom_orderid }}</div>' },
            /*{ field: 'pickup_time', displayName : 'Pickup Time', width: 90  },
            { field: 'pickup_date', displayName : 'Pickup Date', width:100  },*/
            { field: 'partner_name' , displayName:'Vendor', width:150 },
            { field: 'pickup_address' , displayName:'Pickup Address', width:400 },
            { field: 'alldelivery', displayName : 'Receiver Name', width:150 },
            /*{ field: 'delivery_address', displayName : 'Delivery Address', width:400 },
            { field: 'delivery_phone', displayName:'Delivery Phone', width:150},
            { field: 'delivery_instruction', displayName:'Delivery Instruction', width:400
                filter: {
                    term: '',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
                }
            },*/
            { field: 'status' , displayName:'Status', width:150 },
            { field: 'rootid' , displayName:'GroupId', width:150 },
            { field: 'driverid', displayName:'Driver', width:150, type:'number'},
            /*{ name: 'actions', enableFiltering:false, field:'Ticketid', width:100, cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.openAssignOrder(row.entity)">Assign Job</button>'}*/
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.open = function() {
        $scope.datepicker.isOpen = true;
    };
    $scope.reloadOrder= function(){
        $scope.datepicker.chooseDate = $scope.datepicker.requestDate;
        $scope.getOrderList();
       
    };

    /*$scope.getDriver = function()
    {
        $http.get('http://apps.zoomitnow.co/controlpanel/getDriver.php')        
        .success(function(respone) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.rawDrivers = respone.records;

            $scope.driverlist.available=[];
            for(var idx=0;idx<respone.records.length;idx++)
            {
                if(respone.records[idx].status=="1")
                    $scope.driverlist.available.push(respone.records[idx]);
            }
        })
        .error(function () 
        {
            console.log('Unable to get Driver' );
        });
    };*/

    $scope.getOrderList = function(){
        var date = $scope.datepicker.chooseDate.getDate();
        var month =$scope.datepicker.chooseDate.getMonth();
        var year = $scope.datepicker.chooseDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);
        
        console.log(year+month+date);
        
        $http.get('http://18.141.18.7/controlpanel/getScanDataHistory.php?date='+year+month+date)        
        .success(function(respone) 
        {
            respone = CRYPTO.decrypt(respone.data);
            console.log(respone);
            for(var i=0, length=respone.result.length;i<length;i++){
        for ( var temp in respone.result[i] )
        {
            respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
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
            $scope.info.total = respone.total;
            $scope.info.cod = parseFloat(respone.totalcod).toFixed(2);
            $scope.info.collected = parseFloat(respone.totalcollected).toFixed(2);
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
    
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        //$scope.getDriver();
        $scope.getOrderList();
        
        /*$rootScope.eventInit.push($interval(function(){
            $scope.getDriver();
        },10000));*/        
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
        },15000));
    };
    $scope.init();
}]);
