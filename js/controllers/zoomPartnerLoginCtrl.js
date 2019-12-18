angular.module('app')
.controller('zoomPartnerLoginCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

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
        enableColumnResizing: true,
        columnDefs:[
            { field: 'userid', displayName : 'Loginid'  },
            { field: 'partner_name', displayName : 'Partner'  },
            { field: 'partner_status', displayName : 'Status' },
			{ name: 'actions', enableFiltering:false, field:'userid', cellTemplate:'<button  ng-click="grid.appScope.resetPassword(row.entity)">Reset Password</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.reload= function(){
        $scope.getList();
    };

    $scope.getList = function(){
        $http.get('http://18.141.18.7/controlpanel/getPartnerLoginList.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++){
                respone.result[i].partnerid= decodeURIComponent(respone.result[i].partnerid) ;
                respone.result[i].partner_name= decodeURIComponent(respone.result[i].partner_name) ;
                respone.result[i].partner_status= decodeURIComponent(respone.result[i].partner_status) ;
                respone.result[i].userid= decodeURIComponent(respone.result[i].userid) ;
			}
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner login' );
		});
    };

    $scope.addLogin = function(){
        $scope.openPartnerLoginModal(null);
    }

    $scope.openPartnerLoginModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'PartnerLoginModal.html',
            controller: 'PartnerLoginModalCtrl',
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
    }

    $scope.resetPassword = function(data){
        var param = {
            loginId:data.userid,
            password:'',
            partner:data.partnerid
        }
        $scope.openResetPasswordModal(param);
    }
    $scope.openResetPasswordModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'PartnerLoginResetPasswordModal.html',
            controller: 'PartnerLoginResetPasswordModalCtrl',
            size: 'md',
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
        },15000));
    };
    $scope.init();
}]);

angular.module('app')
.controller('PartnerLoginModalCtrl', ['$scope', '$uibModalInstance', 'stateParam', '$http', '$uibModal', function ($scope, $uibModalInstance, stateParam, $http, $uibModal) {
    $scope.dataLogin = stateParam; 
    $scope.partners=[];
    
    $scope.input = {
        id:0,
        loginId:'',
        password:'',
        partner:'',
    };
    
    //============INITIAL=============
    $scope.init = function(){
        $scope.getPartners();
        
        $scope.input.id = 0;
        $scope.input.loginId = '';
        $scope.input.password = '';
        $scope.input.partner = '';

        if($scope.dataLogin != null){
            $scope.input.id = $scope.dataLogin.id;
            $scope.input.loginId = $scope.dataLogin.loginId;
            $scope.input.password = $scope.dataLogin.password;
            $scope.input.partner = $scope.dataLogin.partner;    
        }

    }

    //============FUNCTION===========
    $scope.getPartners= function(){
        $http.get('http://18.141.18.7/controlpanel/getPartnerList.php')           
		.success(function(respone) 
		{
			respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++){
                respone.result[i].partnerid = decodeURIComponent(respone.result[i].partnerid) ;
                respone.result[i].partner_name= decodeURIComponent(respone.result[i].partner_name) ;
                respone.result[i].partner_contact= decodeURIComponent(respone.result[i].partner_contact) ;
                respone.result[i].partner_mobile= decodeURIComponent(respone.result[i].partner_mobile) ;
                respone.result[i].partner_mail= decodeURIComponent(respone.result[i].partner_mail) ;
                respone.result[i].basiccharge= decodeURIComponent(respone.result[i].basiccharge) ;
                respone.result[i].servicecharge= decodeURIComponent(respone.result[i].servicecharge) ;
                respone.result[i].billingtype= decodeURIComponent(respone.result[i].billingtype) ;
                respone.result[i].partner_status= decodeURIComponent(respone.result[i].partner_status) ;
                respone.result[i].maxorderingroup= decodeURIComponent(respone.result[i].maxorderingroup) ;
                respone.result[i].maxdistanceingroup= decodeURIComponent(respone.result[i].maxdistanceingroup) ;
                respone.result[i].partner_address= decodeURIComponent(respone.result[i].partner_address) ;
                respone.result[i].partner_addressinfo= decodeURIComponent(respone.result[i].partner_addressinfo) ;
            }
			$scope.partners = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
    };

    $scope.submit = function(){
        
        if($scope.input.loginId == ""){
            alert('Please input Login Id');
            return false;
        }
        if($scope.input.password == ""){
            alert('Please input Password');
            return false;
        }
        if($scope.input.partner == ""){
            alert('Please Select Partner');
            return false;
        }
        

        var data = {
            'partnerid':$scope.input.partner,
            'user':$scope.input.loginId,
            'password':$scope.input.password};
                
        var jsonData = CRYPTO.encrypt(data);
        
        var url = 'http://18.141.18.7/controlpanel/addPartnerLogin.php';
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            //respone = CRYPTO.decrypt(respone.data);
            if(respone.message.toUpperCase() == "OK"){
                
                alert('Success.');
                //$scope.getDetail($scope.deliveryEdit.rootid);
                $uibModalInstance.close('');
            }else{
                
                alert('Saving Rejected by server');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Saving Failed. Please try again');
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

angular.module('app')
.controller('PartnerLoginResetPasswordModalCtrl', ['$scope', '$uibModalInstance', 'stateParam', '$http', '$uibModal', function ($scope, $uibModalInstance, stateParam, $http, $uibModal) {
    $scope.dataLogin = stateParam; 
    $scope.partners=[];
    
    $scope.input = {
        loginId:'',
        password:'',
        partner:'',
    };
    
    //============INITIAL=============
    $scope.init = function(){
        
        $scope.input.loginId = '';
        $scope.input.password = '';
        $scope.input.partner = '';

        if($scope.dataLogin != null){
            $scope.input.loginId = $scope.dataLogin.loginId;
            $scope.input.password = $scope.dataLogin.password;
            $scope.input.partner = $scope.dataLogin.partner;    
        }

    }

    //============FUNCTION===========
    

    $scope.submit = function(){
        
        if($scope.input.password == ""){
            alert('Please input Password');
            return false;
        }
        
        var data = {
            'partnerid':$scope.input.partner,
            'user':$scope.input.loginId,
            'password':$scope.input.password};
                
        var jsonData = CRYPTO.encrypt(data);
        
        var url = 'http://18.141.18.7/controlpanel/resetPartnerPassword.php';
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            if(respone.message.toUpperCase() == "OK"){
                
                alert('Success.');
                $uibModalInstance.close('');
            }else{
                
                alert('Saving Rejected by server');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Saving Failed. Please try again');
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

