angular.module('app')
.controller('zoomAccessCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.list = [];
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
	flatEntityAccess: true,
        fastWatch: true,
        enableColumnResizing: true,
        columnDefs:[
			{ field: 'user', displayName : 'User'  },
			{ field: 'active', displayName : 'Active'  },
			{ field: 'timestamp', displayName : 'Timestamp'  },
			{ name: 'actions', enableFiltering:false, field:'partnerid', cellClass: 'grid-align', cellTemplate:'<button  ng-click="grid.appScope.openPartnerModal(row.entity)">Edit</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.reload= function(){
        $scope.getList();
    };

    $scope.getList = function(){

        var url = 'http://18.141.18.7/controlpanel/getAccessList.php';
	$scope.gridOptions.data = [];
        $http.get(url)		
		.success(function(respone) 
		{
			respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++) {
                                for ( var temp in respone.result[i] ) {
                                        respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
				}
			}
			//console.log(respone.result);
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
    };

    $scope.addPartner = function(){
        var data = {
            user:'',
            active:'Y',
            access:0,
        }
        $scope.openPartnerModal(data);
    }

    $scope.openPartnerModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'AccessModal.html',
            controller: 'AccessModalCtrl',
            size: 'lg',
            resolve: {
                dataPartner : function () {
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
    }
    
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        $scope.getList();

        $rootScope.eventInit.push($interval(function(){
            $scope.getList();
        },90000));
    };
    $scope.init();
}]);

angular.module('app')
.controller('AccessModalCtrl', ['$scope', '$uibModalInstance', 'dataPartner', '$http', '$uibModal', function ($scope, $uibModalInstance, dataPartner, $http, $uibModal) {
    $scope.input= {}; 
    $scope.access=[];
    $scope.menunav={};
    //============INITIAL=============
    $scope.init = function(){
        $scope.input.user = dataPartner.user;
        $scope.input.password="";
        $scope.input.active= dataPartner.active;
        $scope.input.access= bigInt(dataPartner.access);
	$scope.getMenuNav();
	console.log($scope.input.access.value);
    }

    //============FUNCTION===========
    $scope.menuClick = function(val, idx) {
        if( $scope.access[idx] ) {
           $scope.input.access= bigInt($scope.input.access).add(val.menuid);
        } else {
           $scope.input.access = bigInt($scope.input.access).minus(val.menuid);
        }
        //console.log($scope.input.access.value);
        //console.log($scope.input.access);
    }
    $scope.checkedMenu = function(val ) {
        if( bigInt($scope.input.access).and(val.menuid)>0 ) {
          return true;
        } else {
          return false;
        }
    }
    $scope.getMenuNav= function () {

        $http({
            method: "POST",
            url: "http://18.141.18.7/controlpanel/getMenuNav.php",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        }).then(function mySuccess(response) {
	    response = CRYPTO.decrypt(response.data.data);
            for(var i=0, length=response.result.length;i<length;i++) {
                for ( var temp in response.result[i] ) {
                     response.result[i][temp] = decodeURIComponent(response.result[i][temp]);
                }
            }
	    //console.log(response.result);
            $scope.menunav= response.result;
        }, function myError(response) {
            console.log(response);
        });

    }
    $scope.submit = function(){
	if( $scope.input.user.length<3 ) 
	{
		alert ("Invalid User");
		return ;
	}
	if( true==confirm("Are you sure want to submit ?") ) {
        var data = {
            user:$scope.input.user,
            access:$scope.input.access.value,
            active:$scope.input.active,
            password:$scope.input.password,
        };
        var jsonData = CRYPTO.encrypt(data);
        
        var url = 'http://18.141.18.7/controlpanel/editAccess.php';
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
		console.log(respone);
            if(respone.message.toUpperCase() == "OK"){
                
                alert('Success.');
                $uibModalInstance.close($scope.typeEdit);
                
            }else{
                alert(respone.message.toUpperCase());
                alert('Saving Rejected by server');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Saving Failed. Please try again');
        });
	}
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.init();
}]);
