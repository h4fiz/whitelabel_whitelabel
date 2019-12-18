angular.module('app')
.controller('orderUnsuccessfulHistoryCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$window',  function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $window){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    
    
    $scope.info = {
        total:0,
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
            { field: 'zoomorderid', displayName : 'ID', width:100, pinnedLeft:true , }, //cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.openDetailOrderModal(row.entity.zoomorderid)">+</button>&nbsp;&nbsp;{{ row.entity.zoomorderid }}</div>'
            { field: 'unsuccessfultime' , displayName:'Unsuccessful Datetime', width:160,  pinnedLeft:true },
            { field: 'reason' , displayName:'Reason', width:300 },
            { field: 'remark' , displayName:'Remark', width:300 },
            { field: 'partnername' , displayName:'Vendor', width:150 },
            //{ field: 'Delivery_Shift', displayName:'Delivery Shift', width:150},
            { field: 'Pickup_Address' , displayName:'Pickup Address', width:400 },
            { field: 'Delivery_Instruction', displayName:'Delivery Instruction', width:400
                /*filter: {
                    term: '',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
                }*/
            },
            { field: 'Delivery_Address', displayName : 'Delivery Address', width:400 },
            { field: 'Pickup_Name' , displayName:'Pickup Name', width:150 },
            { field: 'Delivery_Name', displayName : 'Receiver Name', width:150 },
            { field: 'Delivery_Phone', displayName:'Delivery Phone', width:150},
                        
            { field: 'driver', displayName:'Driver', width:80, pinnedRight:true  },
            //{ name: 'actions', enableFiltering:false, field:'Ticketid', width:200, pinnedRight:true, 
                //cellTemplate:'<button class="btn btn-primary btn-sm" ng-click="grid.appScope.doConfirm(row.entity)">Confirm</button>'}
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

    $scope.getOrderList = function(){

    	var date = $scope.datepicker.requestDate.getDate();
        var month =$scope.datepicker.requestDate.getMonth();
        var year = $scope.datepicker.requestDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);

        var tmp = {
        	date: year+"-"+month+"-"+date
        };

        var jsonData = CRYPTO.encrypt(tmp);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getUnsuccessfulHistory.php', data:{'data':jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            $scope.info.total = respone.total;
            for(var i=0, length=respone.records.length;i<length;i++){
				for ( var temp in respone.records[i] )
                {
                        respone.records[i][temp] = decodeURIComponent(respone.records[i][temp]);
                }
                var arr = respone.records[i].insertdate.split(", ");
                
                var time = arr[1].split(":");
                respone.records[i].pickup_time = time[0]+":"+time[1];
                
                var date = arr[0].split(" ");
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

                respone.records[i].pickup_date = date[2]+"/"+month+"/"+date[0];
                
   
            }
            $scope.orders = respone.records;
            $scope.gridOptions.data = respone.records;
            
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer reject')
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
        
        $scope.getOrderList();
              
        $rootScope.eventInit.push($interval(function(){
            $scope.getOrderList();
        },15000));
    };
    $scope.init();
}]);
