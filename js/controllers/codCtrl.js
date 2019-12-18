angular.module('app')
.controller('codCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.secret={
        key:''
    };
    $scope.myData = [];
    
    $scope.data = {
        listDriver:[],
        zoomer:'',
        cod:0,
        actual_cod:0,
        reported_cod:0,   
        chooseDate:new Date(),
        zoomerid:0,
    }
    $scope.header = {
        zoomer:'',
        name:''
    }
    
    /*----------*//*-----SETTING-----*//*----------*/  
    

    $scope.gridOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            //{ field: 'zoomer_name' , displayName:'Zoomer', width:150 },
            //{ field: 'driver_name' , displayName:'Name', width:250 },
            { field: 'formattedDate' , displayName:'Date', width:200 },
            { field: 'cod' , displayName:'COD', width:150 },
            { field: 'act_cod' , displayName:'Zoomer COD', width:150 },
            //{ field: 'report_cod', displayName:'Reported COD', width:150},
            /*{ name: 'actions', enableFiltering:false, field:'firstname', cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.rootid == row.entity.zoom_orderid" ng-click="grid.appScope.showMe(row.entity)">Request Zoomer</button>'}*/
            { name: 'actions', enableFiltering:false, field:'valid_date', width:150, pinnedRight:true , cellTemplate:'<button ng-click="grid.appScope.addReport(row.entity)">Report COD</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.formattingDate = function(rawDate, type){
        var date = rawDate.getDate();
        var month = rawDate.getMonth();
        
        var monthname = "";
        switch(month){
                case 0 : monthname = "January"; break;
                case 1 : monthname = "February"; break;
                case 2 : monthname = "March"; break;
                case 3 : monthname = "April"; break;
                case 4 : monthname = "May"; break;
                case 5 : monthname = "June"; break;
                case 6 : monthname = "July"; break;
                case 7 : monthname = "Augustus"; break;
                case 8 : monthname = "September"; break;
                case 9 : monthname = "October"; break;
                case 10 : monthname = "November"; break;
                case 11 : monthname = "December"; break;
        }
        var year = rawDate.getFullYear();
        if(type==1)
            return date+" "+monthname+" "+year;
        else
            return year+"-"+(month+101).toString().substr(1,2) +"-"+(date+100).toString().substr(1,2);
    }
    $scope.getDriver = function(){
        $http.get('http://18.141.18.7/controlpanel/getDriver.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
            $scope.data.listDriver = respone.records;
		})
		.error(function () 
		{
			alert('Unable to get Driver' );
		});
    }
    $scope.getListTransaction = function(){
        if( $scope.secret.key.length <6 )
        {
                alert("Without correct key, you can't proceed !!!");
                return ;
        }
	    
        var data = {
            'driverid': $scope.header.zoomer,
            'key': $scope.secret.key
        };
        var jsonData = CRYPTO.encrypt(data);
        
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getAccountTransaction.php', data:{'data' : jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            
            for(var i=0, length=respone.result.length;i<length;i++){
                respone.result[i].cod = parseFloat(respone.result[i].cod).toFixed(2);
                respone.result[i].act_cod = parseFloat(respone.result[i].act_cod).toFixed(2);
                
                var tmp = respone.result[i].valid_date;
                var arr = tmp.split(".");
                
                respone.result[i].formattedDate = $scope.formattingDate(new Date(arr[0],arr[1]-1,arr[2]), 1);
            }
			$scope.gridOptions.data = respone.result;
            $scope.myData = respone.result;
            
        }).error(function (respone, status, headers, config) 
		{
			console.log('error on add partner')
		});
    };  

    $scope.addReport = function(data){
        $scope.data.cod=0;
        $scope.data.actual_cod=0;
        $scope.data.reported_cod=0;
        $scope.data.zoomer="";
        
    
        for(var i=0, length=$scope.data.listDriver.length;i<length;i++){
            if($scope.header.zoomer == $scope.data.listDriver[i].n_id){
                $scope.data.zoomer = $scope.data.listDriver[i].driverid
                break;
            }
        }
        var arr = data.valid_date.split(".");
        $scope.data.chooseDate = new Date(arr[0],arr[1]-1,arr[2]);
        $scope.data.zoomerid = $scope.header.zoomer;
      
        /*$timeout(function(){
            $scope.getSummary();    
        },200);*/
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'DetailCodModal.html',
            controller: 'DetailCodModalCtrl',
            size: 'lg',
            resolve: {
                stateParam: function () {
                    return $scope.data;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getListTransaction();
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
                
        $scope.getDriver();
        /*$rootScope.eventInit.push($interval(function(){
            $scope.getList();
        },15000));*/
    };
    $scope.init();
}]);

angular.module('app')
.controller('DetailCodModalCtrl', ['$scope', '$uibModalInstance', 'stateParam', '$http', '$uibModal','Upload', function ($scope, $uibModalInstance, stateParam, $http, $uibModal, Upload) {
    $scope.dataParam = stateParam; 
    
    
    //============INITIAL=============
    $scope.init = function(){
        $scope.gridDetailOptions.data = [];
        if($scope.dataParam != null){
            $scope.getSummary();
        }
    }

    //============SETTING===========
    //=======DATE PICKER======
    $scope.format = 'dd-MMMM-yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];
    
    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };
    $scope.popup1 = {
        opened: false
      };
    $scope.open1 = function() {
        $scope.popup1.opened = true;
      };
    //=========================

    $scope.gridDetailOptions = {
        data : [],
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'ticket_id',  displayName : 'Order ID', width:100 },
            { field: 'deliveryname', displayName : 'Recipient', width:100  },
            { field: 'partner_name' , displayName:'Partner', width:150 },
            { field: 'formattedInputDate' ,  displayName:'Date', width:150 },
            { field: 'cod' , displayName:'COD',  width:120 },
            { field: 'actual_cod' , displayName:'Zoomer COD', width:120 },
            //{ field: 'report_cod', displayName:'Reported COD', width:150
                /*filter: {
                    term: '',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [ { value: true, label: 'true' }, { value: false, label: 'false' } ]
                }*/
            //},
            { name: 'actions', enableFiltering:false, field:'isPaid', cellTemplate:'<input type="checkbox" ng-model="row.entity.isPaid" ng-click="grid.appScope.recalculateTotal()" >'}
            //{ name: 'Reported COD', enableFiltering:false, field:'report_cod', width:100, pinnedRight:true , cellTemplate:'<input type="text" style="width:100%; height:100%; vertical-align:middle;" ng-keydown="grid.appScope.validateInput($event)"  ng-model="row.entity.cod">'}
        ],
    };

    //============FUNCTION===========
    $scope.formattingDate = function(rawDate, type){
        var date = rawDate.getDate();
        var month = rawDate.getMonth();
        
        var monthname = "";
        switch(month){
                case 0 : monthname = "January"; break;
                case 1 : monthname = "February"; break;
                case 2 : monthname = "March"; break;
                case 3 : monthname = "April"; break;
                case 4 : monthname = "May"; break;
                case 5 : monthname = "Juny"; break;
                case 6 : monthname = "July"; break;
                case 7 : monthname = "Augustus"; break;
                case 8 : monthname = "September"; break;
                case 9 : monthname = "October"; break;
                case 10 : monthname = "November"; break;
                case 11 : monthname = "December"; break;
        }
        var year = rawDate.getFullYear();
        if(type==1)
            return date+" "+monthname+" "+year;
        else
            return year+"-"+(month+101).toString().substr(1,2) +"-"+(date+100).toString().substr(1,2);
    }
    $scope.validateInput = function(event){
        if(event.keyCode != 8 && event.keyCode != 190){
            if(event.keyCode <48 || event.keyCode >57)
                event.preventDefault();
        } 
    };
    $scope.recalculateTotal = function(){
        
        $scope.dataParam.cod = parseFloat(0);
        $scope.dataParam.actual_cod = parseFloat(0);
        
        var tmp_cod = parseFloat(0);
        var tmp_actual_cod = parseFloat(0);
        
        for(var i=0, length=$scope.gridDetailOptions.data.length;i<length;i++){
            //console.log($scope.gridDetailOptions.data[i].isPaid);
            if($scope.gridDetailOptions.data[i].isPaid){

                tmp_cod  += parseFloat($scope.gridDetailOptions.data[i].cod);
                tmp_actual_cod  += parseFloat($scope.gridDetailOptions.data[i].actual_cod);
            }
        }
        $scope.dataParam.cod = parseFloat(tmp_cod).toFixed(2);
        $scope.dataParam.actual_cod = parseFloat(tmp_actual_cod).toFixed(2);
    }

    $scope.getSummary = function(){
        var data = {
            driverid: $scope.dataParam.zoomerid,
            chooseDate: $scope.formattingDate($scope.data.chooseDate, 2)
        };
        var jsonData = CRYPTO.encrypt(data);
        
        $scope.dataParam.cod = 0;
        $scope.dataParam.actual_cod = 0;
        var tmp_cod = parseFloat(0);
        var tmp_actual_cod = parseFloat(0);
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getSummaryCodDriver.php', data:{'data' : jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            respone = CRYPTO.decrypt(respone.data);
            
            for(var i=0, length=respone.result.length; i<length;i++){
                
                respone.result[i].cod = parseFloat(respone.result[i].cod).toFixed(2);
                respone.result[i].actual_cod = parseFloat(respone.result[i].actual_cod).toFixed(2);
                
                tmp_cod  += parseFloat(respone.result[i].cod);
                tmp_actual_cod  += parseFloat(respone.result[i].actual_cod);
                
                respone.result[i].isPaid = true;
                
                var tmp = respone.result[i].pickup_date;
                var arr = tmp.split(".");
                
                respone.result[i].formattedInputDate = $scope.formattingDate(new Date(arr[0],arr[1]-1,arr[2]), 1);
            }
            
            $scope.gridDetailOptions.data = respone.result;
            $scope.dataParam.cod = parseFloat(tmp_cod).toFixed(2);
            $scope.dataParam.actual_cod = parseFloat(tmp_actual_cod).toFixed(2);
            $scope.dataParam.reported_cod= parseFloat(0);
            
        }).error(function (respone, status, headers, config) 
		{
			console.log('error on add partner')
		});
    }
    
    $scope.submit = function(){
        var data = {
            zoomerid: $scope.dataParam.zoomerid,
            cod: $scope.dataParam.cod,
            zoomcod: $scope.dataParam.actual_cod,
            reportcod: $scope.dataParam.reported_cod,
            reportdate: $scope.formattingDate($scope.dataParam.chooseDate, 2),
            transactions: $scope.gridDetailOptions.data
        };

        var jsonData = CRYPTO.encrypt(data);
        
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/insertCod.php', data:{'data' : jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
            if(respone.message.toUpperCase() == "OK"){
                $scope.dataParam.cod=0;
                $scope.dataParam.actual_cod=0;
                $scope.dataParam.reported_cod=0;

                $uibModalInstance.close(null);
                //$scope.getListTransaction();
            }else{
                alert(respone.message);    
            }
        }).error(function (respone, status, headers, config) 
		{
            alert(respone.message);
			console.log('error on add partner')
		});
    }

    /*$scope.ok = function () {    
        $uibModalInstance.close(null); //close return something
    };*/

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.init();
}]);
