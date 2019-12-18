angular.module('app')
.controller('zoomerTomorrowAttendanceCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.orders = [];
    $scope.driverlist = {
        available:[]
    }
    $scope.info = {
        yes:0,
        no:0,
        total:0
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
            { field: 'driver', displayName : 'Driver', width:100 },
            { field: 'name' , displayName:'Name', width:150 },
            { field: 'answer' , displayName:'Answer', width:100 },
            { field: 'actual' , displayName:'Actual', width:150 },
            { field: 'remark' , displayName:'Remark', width:400 },
            { name: 'actions', enableFiltering:false, field:'driver', cellTemplate:'<button class="btn btn-primary btn-sm" ng-show="row.entity.close == \'-\'" ng-click="grid.appScope.openSetActual(row.entity)">Set Actual</button>'}
        ],
    };
    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.open = function() {
        $scope.datepicker.isOpen = true;
    };
    $scope.refresh= function(){
        $scope.datepicker.chooseDate = $scope.datepicker.requestDate;
        $scope.getAttendanceList();
    };

    $scope.close = function(){
        var date = $scope.datepicker.chooseDate.getDate();
        var month =$scope.datepicker.chooseDate.getMonth();
        var year = $scope.datepicker.chooseDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);

        if(confirm('Are you sure you would like to confirm attendance for \''+year+'-'+month+'-'+date+'\' ?')){
            var data = {
                fordate:year+'-'+month+'-'+date,
            };
        
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/closeActualAttendance.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                
                if(respone.message == "SUCCESS"){
                    alert('Data '+respone.fordate+' closed');
                    $scope.getAttendanceList();
                }else{
                    console.log(respone.message );
                    alert(respone.message);
                }
                
            }).error(function (respone, status, headers, config){
                alert('Submit Failed');
            });
        }
    }

    $scope.getAttendanceList = function(){
        var date = $scope.datepicker.chooseDate.getDate();
        var month =$scope.datepicker.chooseDate.getMonth();
        var year = $scope.datepicker.chooseDate.getFullYear();
        
        date = ((parseInt(date) + 100).toString()).substr(1);
        month = ((parseInt(month) + 101).toString()).substr(1);
        
        //console.log(year+month+date);
        
        $http.get('http://18.141.18.7/controlpanel/getDriverAttendance.php?date='+year+month+date)		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
            console.log(respone);
            /*for(var i=0, length=respone.result.length;i<length;i++){
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
            $scope.info.collected = parseFloat(respone.totalcollected).toFixed(2);*/
            $scope.gridOptions.data = respone.records;
            $scope.info.yes = respone.yes;
            $scope.info.no = respone.no;
            $scope.info.total = parseInt(respone.yes) + parseInt(respone.no);
		})
		.error(function () 
		{
			alert('Unable to get attendance list ' );
		});
    };

    $scope.openSetActual = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'attendanceSetActualModal.html',
            controller: 'attendanceSetActualModalCtrl',
            size: 'lg',
            resolve: {
                dataAttendance: function () {
                    return data;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getAttendanceList();
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
        
        $scope.getAttendanceList();
        
       
        $rootScope.eventInit.push($interval(function(){
            $scope.getAttendanceList();
        },30000));
    };
    $scope.init();
}]);

angular.module('app')
.controller('attendanceSetActualModalCtrl', ['$scope', '$uibModalInstance', 'dataAttendance', '$http', function ($scope, $uibModalInstance, dataAttendance, $http) {
    
    $scope.data = dataAttendance;
    $scope.input = {
    	actual : dataAttendance.actual,
        remark: dataAttendance.remark
    }
    
    
    $scope.submit = function () {
	       
        if(confirm('Are your sure want to submit?')){
            
            var data = {
                driverid:$scope.data.driverid,
                fordate:$scope.data.fordate,
                actual:$scope.input.actual,
                remark :  $scope.input.remark
            };
  		
            var jsonData = CRYPTO.encrypt(data);
            
            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/setActualAttendance.php', data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                //console.log(respone);
                if(respone.message == "SUCCESS"){
                    alert('Attendance Submitted');
                    $uibModalInstance.close('');
                }else{
					console.log(respone.message );
					alert(respone.message);
                }
                
            }).error(function (respone, status, headers, config){
                alert('Submit Failed');
            });
        }
	
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);