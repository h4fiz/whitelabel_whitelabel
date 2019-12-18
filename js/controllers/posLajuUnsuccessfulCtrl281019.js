angular.module('app')
.controller('posLajuUnsuccessfulCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$window', '$location',  function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $window, $location, $uibModalInstance){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    $scope.listAllDriver=[];
    $scope.selected=[];
    $scope.info = {
        total:0,
    }
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : $scope.orders,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },

        //enableRowSelection: true,
        //enableSelectAll: true,
        //multiSelect: true,
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        exporterPdfTableStyle: {margin: [10, 10, 10, 5]},
        exporterPdfOrientation: 'landscape',
        columnDefs:[
            { displayName: '', field: 'isPicked', width:40, pinnedLeft:true, cellTemplate: '<input type="checkbox" checked ng-show="row.entity.isPicked" ng-click="grid.appScope.pick(row.entity)"/><input type="checkbox" ng-show="!row.entity.isPicked" ng-click="grid.appScope.pick(row.entity)"/>'  },
            // { name: ' ',headerCellClass: 'text-center', enableFiltering:false,width:30, pinnedLeft:true,cellTemplate:'<input type="checkbox" class="btn btn-sm btn-primary"  ng-model="data.valueport" ng-click="grid.appScope.cekboxs(row.entity.zoomorderid)" style="margin-right:5px; height:25px">'},
            { field: 'zoomorderid', displayName : 'ID', width:100, pinnedLeft:true  }, //cellTemplate:'<div class="ui-grid-cell-contents"><button class="btn btn-primary btn-xs" ng-click="grid.appScope.openDetailOrderModal(row.entity.zoomorderid)">+</button>&nbsp;&nbsp;{{ row.entity.zoomorderid }}</div>'
            { field: 'unsuccessfultime' , displayName:'Unsuccessful Datetime', width:160,  pinnedLeft:true },
            { field: 'status' , displayName:'Status', width:100,  pinnedRight:true },
            { field: 'reason' , displayName:'Reason', width:200 },
            { field: 'remark' , displayName:'Remark', width:300 },
            { field: 'partnername' , displayName:'Vendor', width:150 },
            /*{ field: 'Delivery_Shift', displayName:'Delivery Shift', width:150},*/
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
            /*{ name: 'actions', enableFiltering:false, field:'Ticketid', width:200, pinnedRight:true, 
                cellTemplate:'<button class="btn btn-success btn-sm" ng-click="grid.appScope.openEdit(row.entity, \'Delivery\')">Edit</button> <button class="btn btn-primary btn-sm" ng-click="grid.appScope.doConfirm(row.entity)">Confirm</button> <button class="btn btn-warning btn-sm" ng-click="grid.appScope.doManual(row.entity)">Manual</button>'}*/
            { name: 'actions', enableFiltering:false, field:'Ticketid', width:80, pinnedRight:true, 
                cellTemplate:'<button class="btn btn-warning btn-sm" ng-click="grid.appScope.cancelModal(row.entity)">Cancel</button>'}
                // cellTemplate:'<button class="btn btn-warning btn-sm" ng-click="grid.appScope.edit(row.entity)">Cancel</button>'}
        ],
    };

    $scope.checkArray = [];
   
    // $scope.cekboxs= function(item){
    //     $scope.checkArray.map((idx, val) =>{
    //         console.log(idx)
    //         if(idx != item){
    //             $scope.checkArray.filter(function(it){
    //                 item != it
    //             });
    //         } else {
    //             $scope.checkArray.push(item);
    //         }
    //     })
    //     console.log(item)
    //     console.log($scope.checkArray)
    // }

    // ini
    // $scope.cekboxs= function(item){
    //     $scope.checkArray.push(item);
    //     console.log($scope.checkArray)
    // }
    // ini

    $scope.pick = function(data){
        //console.log($scope.orders );
        for(var i=0;i<$scope.orders.length;i++){
            // console.log($scope.orders[i]);
            if($scope.orders[i].zoomorderid == data.zoomorderid ){
                // console.log($scope.orders[i].isPicked)
                $scope.orders[i].isPicked = !$scope.orders[i].isPicked;
                // console.log($scope.orders[i].isPicked)
                break;
            }
        }
        $scope.gridOptions.data = $scope.orders;
       // setTimeout(function(){$scope.$apply();},300)
        
    }
    
    
    // $scope.$apply();
    // $scope.ok = function(){
    
    //     var tmp = [];
    //     //console.log(listDetail)
    //     console.log($scope.orders );
    //     for(var i=0;i<$scope.orders .length;i++){
    //         console.log($scope.orders [i]);
    //         if($scope.orders [i].isPicked){
    //             tmp.push($scope.orders [i]);
    //         }
    //     }
    //     console.log(tmp);
    //     $uibModalInstance.close(tmp);
        
    // }




    
    
    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.getDriver = function()
    {
        $http.get('http://18.141.18.7/controlpanel/getDriverFullAndFreelancer.php')        
        .success(function(respone) 
        {
            respone = CRYPTO.decrypt(respone.data);
            $scope.listAllDriver = respone.records;

            $scope.listAllDriver.available=[];
            for(var idx=0;idx<respone.records.length;idx++)
            {
                //if(respone.records[idx].status=="1")
                    $scope.listAllDriver.available.push(respone.records[idx]);
            }
        })
        .error(function () 
        {
            console.log('Unable to get Driver' );
        });
    };

    $scope.getOrderList = function(){
        $http({method: 'POST',url:'http://'+$location.$$host+'/controlpanel/getposLajuUnsuccessful.php', data:{'data':''},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            console.log(respone);
            $scope.info.total = respone.total;
            for(var i=0, length=respone.records.length;i<length;i++){
                for ( var temp in respone.records[i] )
                {
                        respone.records[i][temp] = decodeURIComponent(respone.records[i][temp]);
                }
                var arr = respone.records[i].timestamp.split(", ");
                
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
/*
                if( respone.records[i].timeout=='Y' )
                {
                    respone.records[i].status='Timeout';
                }
*/
                respone.records[i].pickup_date = date[2]+"/"+month+"/"+date[0];
                respone.records[i].isPicked = false;
   
            }
            $scope.orders = respone.records;
            $scope.gridOptions.data =  $scope.orders;
            
        }).error(function (respone, status, headers, config){
            console.log('error on get zoomer reject')
        });
    };

    $scope.cancelAll = function(data) {  
        //$scope.info.onloading = true; 
//console.log(data);  
        if(confirm('Are you sure want to cancel all?') ==true ) {

            var pass = prompt("Insert Password To Cancel This","");

            if ( pass == "2" ) {
                

                //  $scope.data = data.zoomorderid;
             $http.get('http://18.141.18.7/controlpanel/updatePosLajuUnsuccessfulDeleteAll.php?data='+$scope.data)      
        .success(function(response) 
        { 
            
            console.log(response);
            $scope.info.onloading = false;     
            $scope.getOrderList();        
            // for(var i=0; i< respose.result.length;i++){
                
            // }
        $scope.gridOptions.data = response.result; 
        })
        .error(function () 
        {
            $scope.info.onloading = false;
            alert('Unable to get data ' );
        }); 

            } else {
                alert("Password Not Found");
            }
           
     } else {
        return false; 
    }
    }

    $scope.edit = function(data) {  
        //$scope.info.onloading = true; 
        //console.log(data);  
        if(confirm('Are you sure want to cancel? ? [' + data.zoomorderid + ']?') ==true ) {

            var pass = prompt("Insert Password To Cancel This","");

            if ( pass == "" ) {

                 $scope.data = data.zoomorderid;
             $http.get('http://18.141.18.7/controlpanel/updatePosLajuUnsuccessful.php?data='+$scope.data)      
        .success(function(response) 
        { 
            
            console.log(response);
            $scope.info.onloading = false;     
            $scope.getOrderList();        
            for(var i=0; i< respose.result.length;i++){
                
            }
        $scope.gridOptions.data = response.result; 
        })
        .error(function () 
        {
            $scope.info.onloading = false;
            alert('Unable to get data ' );
        }); 

            } else {
                alert("Password Not Found");
            }
           
     } else {
        return false; 
    }
    } 
    
    $scope.cancelModal = function (rawData) {
        var modalReset = $uibModal.open({
          animation: true,
          templateUrl: 'insertPasword.html',
          controller: 'insertPaswordCtrl',
          size: 'sm',
          resolve: {
            selectedRow: rawData
            }
        });
        
        modalReset.result.then(function (selectedItem) {
          //$scope.selected = selectedItem;
        }, function () {
        $scope.init();
        //$scope.getList(); 
        //console.log('Modal dismissed at: ' + new Date());
        });
        console.log(rawData);
    };

    $scope.cancelAllModal = function (rawData) {
        
        var tmp = [];
        
        // console.log($scope.orders );
        for(var i=0;i<$scope.orders.length;i++){
            // console.log($scope.orders [i]);
            if($scope.orders[i].isPicked){
                tmp.push($scope.orders[i]);
            }
        }
        // console.log(tmp);
        $scope.selected = tmp;
        // console.log($scope.selected);
        
        var modalReset = $uibModal.open({
          animation: true,
          templateUrl: 'insertPaswordCancelAll.html',
          controller: 'insertPaswordCancelAllCtrl',
          size: 'sm',
          resolve: {
            selectedRow: function(){return tmp;}
            }
        });
        
        modalReset.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
        $scope.init();
        //$scope.getList(); 
        //console.log('Modal dismissed at: ' + new Date());
        });
        // console.log(rawData);
    };
    // modal

    $scope.init = function(){
        
        $scope.getOrderList();
        $scope.getDriver();
              
        $rootScope.eventInit.push($interval(function(){
            // $scope.getOrderList();
            $scope.getDriver();
        },15000));
    };
    $scope.getOrderList();
    $scope.init();
}]);

angular.module('app').controller('insertPaswordCtrl', function ($scope, $uibModalInstance, $http, $timeout, selectedRow, Upload) {
    $scope.dataed =[];
        $scope.dataed.zoomorderid=selectedRow.zoomorderid;
        $scope.dataed.Password='';
    $scope.data =[];
    console.log($scope.dataed);
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    $scope.cancelOrder = function(data) {   
            if ($scope.dataed.Password == "zoomitnow3368") {
                $scope.data = $scope.dataed.zoomorderid;
                $http.get('http://18.141.18.7/controlpanel/updatePosLajuUnsuccessful.php?data='+$scope.data)      
        .success(function(response) 
        { 
            if(response.message == "OK"){
				alert('Request Success');
                $uibModalInstance.dismiss('OK');    
            }
            console.log(response);
        })
        .error(function () 
        {
            $scope.info.onloading = false;
            alert('Unable to get data ' );
        }); 

            } else {
                alert("Password Not Found");
            }
    } 

});

angular.module('app').controller('insertPaswordCancelAllCtrl', function ($scope, $uibModalInstance, $http, $timeout, selectedRow, Upload) {
    $scope.dataed =[];
        // $scope.dataed.zoomorderid=$scope.selected.zoomorderid;
        // $scope.dataed.zoomorderid=selectedRow.zoomorderid;
        // var array = selectedRow;
        // console.log(selectedRow);
        // for (let i = 0; i < selectedRow.length; i++) {
        //     $scope.dataed.zoomorderid = array[i].zoomorderid;
            
        // }
        $scope.dataed.Password='';
    $scope.data =[];
    // console.log($scope.dataed);
    // console.log(array);
        
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.cancelOrderAll = function() {  
            if ( $scope.dataed.Password == "" ) {
                var array = selectedRow;
                console.log(array);    
                var jsonData = CRYPTO.encrypt(array);
                $http({
                    method: 'POST',
                    url:'http://18.141.18.7/controlpanel/updatePosLajuUnsuccessfulDeleteAll.php',data:{'data' : jsonData},  
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
                    {
                        if(respone.message == "OK"){
                        $uibModalInstance.dismiss('OK');
                        alert('Request succes!');
                    }
                }).error(function (respone, status, headers, config) 
                {
                    console.log('error')
                });    
            } else {
                alert("Password Not Found");
            }
        }
        // $scope.cancelOrderAll = function() {  
        //     if ( $scope.dataed.Password == "" ) {
        //          $http.get('http://18.141.18.7/controlpanel/updatePosLajuUnsuccessfulDeleteAll.php?data='+$scope.data)      
        //         .success(function(response) 
        //         {
        //             if(response.message == "OK"){
        //                 alert('Request Success');
        //                 $uibModalInstance.dismiss('OK');    
        //             }      
        //             console.log(response);  
        //         })
        //         .error(function () 
        //         {
        //             $scope.info.onloading = false;
        //             alert('Unable to get data ' );
        //         }); 
        //     } else {
        //         alert("Password Not Found");
        //     }
        // }

});