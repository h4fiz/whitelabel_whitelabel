angular.module('app')
.controller('zoomBroadcastCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', 'uiGridGroupingConstants', '$location', '$window', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, uiGridGroupingConstants,$location, $window){

    /*----------*//*-----VARIABLES-----*//*----------*/
    //$scope.list = [];
    $scope.TypeofZoomer=[];
    $scope.vehicles = [];

    $scope.Data={};
    $scope.Data.Type="1";
    $scope.mindate = new Date();
    $scope.mindate.setDate($scope.mindate.getDate() - 14);

    $scope.datepickerStart = {
        requestDate:new Date(),
        isOpen:false,
        options:{
            minDate: $scope.mindate,
            maxDate:new Date(),
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
        enableRowSelection: true,
        enableSelectAll: true,
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        flatEntityAccess: true,     
        fastWatch: true,
        enableColumnResizing: true,
        multiSelect: true,
        columnDefs:[
            { field: 'broadcastid', displayName : 'BroadcastID', width:120 },
            { field: 'timestamp', displayName : 'Timestamp', width:160 },
            { field: 'date', displayName : 'For Date', width:120 },
            { field: 'type', displayName : 'Type', width:120 },
            { field: 'active', displayName : 'Active' , width:60},
            { field: 'rootid', displayName : 'Group' , width:60},           
            { field: 'driverid', displayName : 'driverid', width:100 },
            { field: 'status', displayName : 'status', width:160 },
            { name: 'actions', enableFiltering:false,width:300, field:'userid', cellClass: 'grid-align', cellTemplate:'<button class="btn btn-primary btn-sm" ng-click="grid.appScope.openBroadcastDetailModal(row.entity)">Detail</button>&nbsp;<button class="btn btn-warning btn-sm" ng-show="row.entity.driverid==\'\'" ng-click="grid.appScope.openReservationModal(row.entity)">Reservation</button><button class="btn btn-success btn-sm" ng-show="row.entity.status==\'Available\' && row.entity.driverid!=\'\'" ng-click="grid.appScope.openPickupModal(row.entity)">Pickup</button>&nbsp;<button  ng-show="row.entity.status==\'Available\' && row.entity.driverid!=\'\'" class="btn btn-danger btn-sm" ng-click="grid.appScope.cancelpick(row.entity)">Cancel Pickup</button><button class="btn btn-info btn-sm"  ng-show="row.entity.driverid == \'\'" ng-click="grid.appScope.printGroup(row.entity)">Print</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.sendBroadcast= function(){       
        var arr = $scope.gridApi.selection.getSelectedRows();
        if ( arr.length>0 ) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'SendBroadcastModal.html',
                controller: 'SendBrodcastModalCtrl',
                size: 'lg',
                resolve: {
                    data: function () {
                        return arr;
                    },
                    zoomerType: function () {
                        return $scope.TypeofZoomer;
                    },
                    vehicles:function(){
                        return $scope.vehicles;
                    }
                },
                scope: $scope
            });
            modalInstance.result.then(function (returnValue) {
               $scope.getBroadcastList();
            }, function () {
                $scope.getBroadcastList();
                console.log('Modal dismissed at: ' + new Date());
            });
        } else {
            alert ("Please select the row(s)");
        }
        /*
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
                    var url = 'http://zoom.trus.co.id/controlpanel/addBroadcast.php';
                    
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
        */
    };
    
    $scope.printGroup= function(data){
        $window.open('http://18.141.18.7/controlpanel/print_receipt_broadcast.php?groupid='+data.broadcastid);
    }
    
    $scope.getList = function(){
        
        $http.get('http://'+$location.$$host+'/controlpanel/getZoomerType.php')
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
    $scope.getVehicles = function(){
        
        $http.get('http://'+$location.$$host+'/controlpanel/getVehicles.php')
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
            $scope.vehicles = respone.result;
        })
        .error(function () 
        {
            alert('Unable to get zoomer type' );
        });
    };

    $scope.getBroadcastList = function(){
        
        $scope.datepickerStart.requestDate.setHours(0,0,0,0);
        var date = $scope.datepickerStart.requestDate.getDate();
        var month =$scope.datepickerStart.requestDate.getMonth();
        var year = $scope.datepickerStart.requestDate.getFullYear();        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);

        $http.get('http://'+$location.$$host+'/controlpanel/getBroadcastList.php?date='+year+'-'+month+'-'+date)        
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
/*
     $scope.resend= function(id){
        if(confirm('Are your sure want to Resend ?')){
            var data = {
                ID:id.broadastid
            };            
            var jsonData = CRYPTO.encrypt(data);            
            $http({method: 'POST',url:'http://zoom.trus.co.id/controlpanel/resendBroadcast.php', data:{'data':jsonData},  
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
    */
    /*
    $scope.startBroadcast = function(){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'BroadcastDetailModal.html',
            controller: 'BroadcastDetailModalCtrl',
            size: 'lg',
            resolve: {
                zoomerType: function () {
                    return $scope.TypeofZoomer;
                }
            },
            scope: $scope
        });
        modalInstance.result.then(function (returnValue) {
           $scope.getBroadcastList();
        }, function () {
            $scope.getBroadcastList();
            console.log('Modal dismissed at: ' + new Date());
        });
    }
    */
/*
    $scope.closeBroadcast= function(id){
        if(confirm('Are your sure want to close submition ?')){
            var data = {
                ID:id.broadastid
            };            
            var jsonData = CRYPTO.encrypt(data);            
            $http({method: 'POST',url:'http://zoom.trus.co.id/controlpanel/closeBroadcast.php', data:{'data':jsonData},  
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
    */
    /*
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
*/
    $scope.openPickupModal = function (row) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'qr.html',
            controller: 'QRCtrl',
            size: 'sm',
            resolve: {
                code: function () {
                    return row.broadcastid;
                }
            },
            scope: $scope
        });
        modalInstance.result.then(function (returnValue) {
           
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });   
    }
    $scope.cancelpick = function(row) {  
        //$scope.info.onloading = true; 
//console.log(data);  
var r = confirm('Are your sure want to back broadcast ?');               
        if (r == true) {                    
             var param = {
                broadcastid : row.broadcastid,
            };
            //console.log("id:"+id); 
            var jsonData = CRYPTO.encrypt(param);
            var url = 'http://18.141.18.7/controlpanel/rollbackBroadcast_new.php';
            
            $http({method: 'POST',url:url, data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},})
            .success(function (respone, status, headers, config) 
            {
                //console.log(respone);
                if( 'OK'==respone.message )
                {
                    alert ("Rollback success");
                }
            })
            .error(function (respone, status, headers, config){
                alert('Unable to send rollback broadcast messages ' );
            });
        }
    //     if(confirm('Are you sure want to cancel? ? [' + data.zoomorderid + ']?') ==true ) {
    //         $scope.data = data.zoomorderid;
    //     $http.get('http://18.141.18.7/controlpanel/rollbackBroadcast_new.php?data='+$scope.data)       
    //  .success(function(response) 
    //  { 
            
    //      console.log(response);
    //         $scope.info.onloading = false;     
    //         $scope.getOrderList();        
    //         for(var i=0; i< respose.result.length;i++){
                
    //         }
    //  $scope.gridOptions.data = response.result; 
    //  })
    //  .error(function () 
    //  {
    //      $scope.info.onloading = false;
    //      alert('Unable to get data ' );
    //     }); 
    // } else {
    //     return false; 
    // }
} 
    $scope.openReservationModal = function(row){
        //alert( "Rollback broadcastid "+ row.broadcastid);
        var r = confirm('Are your sure want move it and the prev group to order reservation ?');               
        if (r == true) {                    
             var param = {
                broadcastid : row.broadcastid,
            };
            //console.log("id:"+id);
            var jsonData = CRYPTO.encrypt(param);
            var url = 'http://18.141.18.7/controlpanel/rollbackBroadcast.php';
            
            $http({method: 'POST',url:url, data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},})
            .success(function (respone, status, headers, config) 
            {
                //console.log(respone);
                if( 'OK'==respone.message )
                {
                    alert ("Rollback success");
                }
            })
            .error(function (respone, status, headers, config){
                alert('Unable to send rollback broadcast messages ' );
            });
        }
    }
    
    $scope.openBroadcastDetailModal = function(row){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'BroadcastDetail.html',
            controller: 'BroadcastDetailModalCtrl',
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
        var height = $scope.screen.height - 170;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $scope.getList();
        $scope.getVehicles();
        $scope.getBroadcastList();
    };
    $scope.init();
}]);
/*
angular.module('app')
.controller('BroadcastModalCtrl', ['$scope', '$uibModalInstance', 'data', '$http', function ($scope, $uibModalInstance, data,  $http) {
    $scope.Data = data;    
    $scope.zoomers = [];

    $scope.getDetail = function(){
        var data = {'broadcastid':$scope.Data.broadastid};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://'+$location.$$host+'/controlpanel/getBroadcastZoomer.php', data:{'data' : jsonData},  
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
*/
angular.module('app')
.controller('BroadcastDetailModalCtrl', ['$scope', '$uibModalInstance', 'data', '$http', 'uiGridConstants', '$location', function ($scope, $uibModalInstance, data,  $http, uiGridConstants, $location) {

    $scope.data = data;    
    $scope.result = [];

    $scope.gridResultOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        showColumnFooter: true,
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'zoomorderid', displayName : 'ZoomorderID', width:120 ,aggregationType: uiGridConstants.aggregationTypes.count },
            { field: 'partner', displayName : 'Partner', width:120 },
            { field: 'timestamp', displayName : 'Submited Date', width:120 },
            { field: 'name', displayName : 'Name', width:120 },
            { field: 'phone', displayName : 'Phone', width:120 },
            { field: 'address', displayName : 'Address', width:120 },
            { field: 'info', displayName : 'Address Detail', width:120 },
            { field: 'instruction', displayName : 'Instruction', width:120 },
            { field: 'cod', displayName : 'COD', width:120, type: 'number', cellFilter: 'number: 2', cellClass: 'grid-alignright' },
            { field: 'size', displayName : 'Size', width:120 },
            { field: 'deliveryfee', displayName : 'Delivery Fee', width:120,  type: 'number', cellFilter: 'number: 2', cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum},
            { field: 'zoomerfee', displayName : 'Zoomer Fee', width:120,   type: 'number', cellFilter: 'number: 2', cellClass: 'grid-alignright', aggregationType: uiGridConstants.aggregationTypes.sum }
        ],
            
    };

    $scope.getResult = function(){
        var data = {'broadcastid':$scope.data.broadcastid};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://'+$location.$$host+'/controlpanel/getBroadcastDetail.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            
            for(var i=0, lengthI=respone.records.length;i<lengthI;i++)
            {
                for ( var temp in respone.records[i] )
                {
                    respone.records[i][temp] = decodeURIComponent(respone.records[i][temp]);                    
                }
            }
            $scope.result= respone.records;
            $scope.gridResultOptions.data = $scope.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data');
        });
    };
     $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.getResult();
}]);

angular.module('app')
.controller('SendBrodcastModalCtrl', ['$scope', '$uibModalInstance', 'zoomerType', 'data', 'vehicles', '$http','$location', function ($scope, $uibModalInstance, zoomerType, data, vehicles, $http, $location) {
    //$scope.Data = data;    
    $scope.listdata = data;
    $scope.types = zoomerType;
    $scope.vehicles = vehicles;
    $scope.transaction = [];
    $scope.maxdate = new Date();
    $scope.maxdate.setDate($scope.maxdate.getDate() + 7);
    $scope.data={
        type:'',
        vehicle: '0'
    }

    $scope.datepickerStart = {
        requestDate:new Date(),
        
        isOpen:false,
        options:{
            minDate:new Date(),
            maxDate:$scope.maxdate,
            formatYear: 'yy',
            startingDay: 1
          },
        chooseDate:new Date()
    };
    $scope.openStart = function() {
        $scope.datepickerStart.isOpen = true;
    };
/*
    $scope.gridDetailOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'zoomorderid', displayName : 'Group Id'  },
            { field: 'deliveryname', displayName : 'Delivery Name'  },
            { field: 'deliveryaddress', displayName : 'Delivery Address' },
            //{ field: 'fee', displayName : 'Zoomer Fee' },
            { name: 'actions', enableFiltering:false,width:100, field:'zoomorderid', cellClass: 'grid-align', cellTemplate:'<div style="vertical-align:middle; padding-left:10px; padding-top:5px; font-size:18px;"><i class="fa fa-check-square-o" aria-hidden="true" ng-show="row.entity.selected==1" ng-click="grid.appScope.checkorder(row.entity)"></i><i class="fa fa-square-o" aria-hidden="true" ng-show="row.entity.selected==0" ng-click="grid.appScope.checkorder(row.entity)"></i></div>'}
        ],
    };

    $scope.checkorder = function(item){
        item.selected = !item.selected;
    }

    $scope.getTransaction = function(){
        var data = {'data':''};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://zoom.trus.co.id/controlpanel/getTransactionForBroadcast.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.transaction = [];
            console.log(respone);
            if(respone.message=="OK"){
                $scope.transaction = respone.order;    
                $scope.gridDetailOptions.data = $scope.transaction;
            }
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data');
        });
    }
*/
    $scope.send = function(){
        var today = new Date();
        today.setHours(0,0,0,0);
        $scope.datepickerStart.requestDate.setHours(0,0,0,0);
        
        var date = $scope.datepickerStart.requestDate.getDate();
        var month =$scope.datepickerStart.requestDate.getMonth();
        var year = $scope.datepickerStart.requestDate.getFullYear();        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);     
       // var diffDays = Math.ceil((Math.abs($scope.datepickerStart.requestDate.getTime() - today.getTime())) / (1000 * 3600 * 24));
                
        var r = confirm(  "Are you sure want to broadcast it ?");               
        if (r == true) {       

            var arrtmp = [];
            for(var i=0;i<data.length;i++){
                arrtmp.push(data[i].broadcastid); 
            }

             var param = {
                tgl:year+month+date,
                type:$scope.data.type,
                order: JSON.stringify(arrtmp)
            };
            //console.log(param);
            
            var jsonData = CRYPTO.encrypt(param);
            var url = 'http://'+$location.$$host+'/controlpanel/sendBroadcast.php';
            
            $http({method: 'POST',url:url, data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                if( 'OK'==respone.message )
                {
                    $uibModalInstance.dismiss('cancel');
                } else if ('Tdk'==respone.message){
                    console.log("hahaha") ;
                }


                else{
                    alert(respone.message);
                }
            })
            .error(function (respone, status, headers, config){
                alert('Unable to send broadcast messages ' );
            });
            
        }
            
       
    }
    
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //$scope.getTransaction();
}]);



angular.module('app')
.controller('QRCtrl', ['$scope', '$uibModalInstance', 'code', '$timeout',
 function ($scope, $uibModalInstance, code, $timeout) {
     $scope.qrcode={};
     $scope.id=code;
    $scope.init = function() {
            //alert("asd "+code);f
        $scope.qrcode = new QRCode(document.getElementById("qrcode_id"), {width : 100,height : 100});
        //$scope.qrcode = new QRCode(document.getElementById("qrcode_id"), code);
        $scope.qrcode.makeCode(code);
    }
    $timeout(function(){
            $scope.init();
    },100);
    
 }]);
