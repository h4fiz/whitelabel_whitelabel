angular.module('app')
.controller('zoomScanbarcodeCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$location', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $location){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.list = [];
    $scope.driver = [];
    $scope.PartnerName = [];
    $scope.vehicle = [];
    $scope.input = {
        zoomer: '',
        barcode: '',
        vehicle: ''
    };
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : $scope.list,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        flatEntityAccess: true,     
        fastWatch: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'barcode', displayName : 'Barcode'  },
            { name: 'actions', enableFiltering:false, field:'id', cellClass: 'grid-align', cellTemplate:'<button  ng-click="grid.appScope.removeBarcode(row.entity)">Remove</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/

    $scope.checkKey = function(e){
        if(e.keyCode == 13){
            $scope.addBarcode();
        }
    }

    $scope.addBarcode = function(){
        if( $scope.input.barcode == ''){
            alert('Barcode must be filled');
            return false;
        }

        var same = false;
        for(var i =0; i< $scope.list.length;i++){
            if($scope.list[i].barcode == $scope.input.barcode){
                same = true;
                break;
            }
        }

        if(!same){
            $scope.list.push({ id:$scope.list.length, barcode: $scope.input.barcode, n_partnerid: $scope.input.n_partnerid });    
        }else {
            alert('This barcode already scanned');
        }
        
        $scope.input.barcode = '';

        document.getElementById('inputbarcode').focus();

    }

    $scope.removeBarcode = function(item){
        $scope.list.splice(item.id, 1);

        for(var i=0;i<$scope.list.length;i++){
            $scope.list[i].id = i;
        }
    }

    $scope.clearBarcode = function(){
        for(var i=0; i<$scope.list.length; i++){
            $scope.list.shift();
        }
        $scope.list = [];
        $scope.gridOptions.data = $scope.list;
        $scope.input.zoomer = '';
        $scope.input.partnername = '';
        document.getElementById('inputbarcode').focus();
    }

    $scope.submitBarcode = function(){
        if($scope.input.zoomer == ''){
            alert('Please pick driver to assign the orders');
            return false;
        }

        if($scope.input.partnername == ''){
            alert('Please pick');
            return false;
        }

        if($scope.list.length == 0){
            alert('Please scan barcode before submit');
            return false;
        }

        // console.log($scope.list);
        // return false;
        var data = {
            zoomerid: $scope.input.zoomer,
            
            partnername: $scope.input.partnername,
            lists: $scope.list
        };
        console.log(data);
        
        var jsonData = CRYPTO.encrypt(data);
        
        $http({method: 'POST',url:'http://'+$location.$$host+'/controlpanel/submitPosLaju.php', data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            if(respone.message == "OK"){
                alert('Submit Success');
                //$scope.getOrderList();
                $scope.clearBarcode();
            }else{
                alert('Submit Reject by server. Please Try Again.');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Submit Failed. Error : '+status);
        });
    }
    
    //===GET DRIVER======

    $scope.getDriver = function()
    {
        $http.get('http://'+$location.$$host+'/controlpanel/getDriver.php')        
        .success(function(respone) 
        {
            respone = CRYPTO.decrypt(respone.data);

            $scope.driver = respone.records;

            // console.log(respone.records);

          
        })
        .error(function () 
        {
            console.log('Unable to get Driver' );
        });
    };

    // ===== GET VEHICLE ======

    $scope.getVehicle = function()
    {
        $http.get('http://'+$location.$$host+'/controlpanel/getVehicles.php')        
        .success(function(respone) 
        {
            respone = CRYPTO.decrypt(respone.data);

            $scope.vehicle = respone.result;

            // console.log(respone.result);
            // console.log(respone);

          
        })
        .error(function () 
        {
            console.log('Unable to get Driver' );
        });
    };

    // ======== GET PARTNER NAME =======

     $scope.getPartnerName = function()
    {
        $http.get('http://'+$location.$$host+'/controlpanel/getPartnerName.php')        
        .success(function(respone) 
        {
            respone = CRYPTO.decrypt(respone.data);
            // console.log(respone);
           $scope.PartnerName = respone.records;
        })
        .error(function () 
        {
            console.log('Unable to get Partner Name' );
        });
    };
    //===================


    /*$scope.openZoomerModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ZoomerModal.html',
            controller: 'ZoomerFreelanceModalCtrl',
            size: 'lg',
            resolve: {
                stateParam : function () {
                    return data;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getList();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }*/

    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $scope.getDriver();
        $scope.getPartnerName();
        $scope.getVehicle();
        $rootScope.eventInit.push($interval(function(){
            $scope.getDriver();
            $scope.getPartnerName();
            $scope.getVehicle();
        },60000));
    };
    $scope.init();

}]);

