angular.module('app')
.controller('zoomitRegistrationListCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$location', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $location){

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
		flatEntityAccess: true,		
		fastWatch: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'email', displayName : 'Email'  },
            { field: 'fullname', displayName : 'Full Name'  },
            { field: 'mobile1', displayName : 'Phone' },
            { field: 'vehicle', displayName : 'Vehicle' },
            { field: 'platnumber', displayName : 'Plat Number' },
            { field: 'register', displayName : 'Register' },
			{ name: 'actions', enableFiltering:false, field:'email', cellClass: 'grid-align', cellTemplate:'<button  ng-click="grid.appScope.processFreelancer(row.entity)">Process</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.reload= function(){
        $scope.getList();
    };

    $scope.getList = function(){
        $http.get('http://'+$location.$$host+'/controlpanel/getZoomitRegistrationList.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			 for(var i=0, length=respone.result.length;i<length;i++){
                    respone.result[i].email= decodeURIComponent(respone.result[i].email) ;
                    respone.result[i].fullname= decodeURIComponent(respone.result[i].fullname) ;
                    respone.result[i].mobile1= decodeURIComponent(respone.result[i].mobile1) ;
                    respone.result[i].vehicle= decodeURIComponent(respone.result[i].vehicle) ;
                    respone.result[i].platnumber= decodeURIComponent(respone.result[i].platnumber) ;
                    respone.result[i].register= decodeURIComponent(respone.result[i].register) ;
			}
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get zoomit registration' );
		});
    };

    $scope.addZoomer = function(){
        var param = {
            zoomerid:'',
            driverid:'',
            fullname:'',
            nickname:'',
            address:'',
            mobile1:'',
            mobile2:'',
            email:'',
            image:'',
            newImage:'',
            dataFile:'',
            active:'Y'
        }
        $scope.openZoomerModal(param);
    }

    $scope.processFreelancer = function(data){
    	$scope.openRegistrationProcessModal(data);
    	
    }

    $scope.openRegistrationProcessModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'RegistrationProcessModal.html',
            controller: 'RegistrationProcessModalCtrl',
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

    $scope.editZoomer = function(data){
        var param = {
            zoomerid: data.zoomerid,
            driverid: data.driverid,
            fullname: data.fullname,
            nickname: data.nickname,
            address: data.address,
            mobile1: data.mobile_1,
            mobile2: data.mobile_2,
            email: data.email,
            image: data.image,
            newImage: '',
            dataFile: '',
            active: data.active
        }
        $scope.openZoomerModal(param);
    }

    $scope.openZoomerModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ZoomerModal.html',
            controller: 'ZoomerParttimeModalCtrl',
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
.controller('RegistrationProcessModalCtrl', ['$scope', '$uibModalInstance', 'stateParam', '$http', '$uibModal','Upload', '$location', function ($scope, $uibModalInstance, stateParam, $http, $uibModal, Upload, $location) {
    $scope.data = stateParam; 
    
    $scope.driverType=[];
    $scope.input = {
        drivertype:'2'
    };
    
    //============INITIAL=============
    $scope.init = function(){
        $scope.getDriverType();
    }
    $scope.getDriverType = function(){
        $http.get('http://'+$location.$$host+'/controlpanel/getDriverType.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.driverType = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get zoomit registration' );
		});
    };

    //============FUNCTION===========
    
    $scope.submit = function(){
        
    	if($scope.input.drivertype == ''){
    		alert('Please choose driver type');
    		return false;
    	}

        var data = {};
        var url = 'http://'+$location.$$host+'/controlpanel/processZoomitRegistration.php';
        
        data = {
        	email: $scope.data.email,
        	drivertype : $scope.input.drivertype
        }
                
        var jsonData = CRYPTO.encrypt(data);
        
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            if(respone.message.toUpperCase() == "OK"){
                
                alert('Process Success');
                $uibModalInstance.close('');
            }else{
                
                alert('Process Failled. '+ respone.message);
            }
            
        }).error(function (respone, status, headers, config){
            alert('Saving Failed. Please try again');
        });
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.init();
}]);

angular.module('app')
.controller('ZoomerParttimeModalCtrl', ['$scope', '$uibModalInstance', 'stateParam', '$http', '$uibModal','Upload', '$location', function ($scope, $uibModalInstance, stateParam, $http, $uibModal, Upload, $location) {
    $scope.dataParam = stateParam; 
    $scope.partners=[];
    
    $scope.input = {
        zoomerid:'',
        driverid:'',
        fullname:'',
        nickname:'',
        address:'',
        mobile1:'',
        mobile2:'',
        email:'',
        password:'',
        image:'',
        newImage:'',
        dataFile:'',
        active:'Y'
    };
    
    //============INITIAL=============
    $scope.init = function(){
        if($scope.dataParam != null){
            $scope.input.zoomerid = $scope.dataParam.zoomerid;
            $scope.input.driverid = $scope.dataParam.driverid;
            $scope.input.fullname = $scope.dataParam.fullname;
            $scope.input.nickname = $scope.dataParam.nickname;
            $scope.input.address = $scope.dataParam.address;
            $scope.input.mobile1 = $scope.dataParam.mobile1;
            $scope.input.mobile2 = $scope.dataParam.mobile2;    
            $scope.input.email = $scope.dataParam.email;
            $scope.input.password = $scope.dataParam.password;
            $scope.input.image = $scope.dataParam.image;
            $scope.input.newImage = $scope.dataParam.newImage;
            $scope.input.dataFile = $scope.dataParam.dataFile;
            $scope.input.active = $scope.dataParam.active;
        }
    }

    //============FUNCTION===========
    $scope.editForm = function (files) {
		if(files) 
		{
			files.upload = Upload.upload({
				  url: 'http://'+$location.$$host+'/controlpanel/editZoomer.php',
				  method: 'POST',
				  data: {'file':files
                  , 'zoomerid':$scope.input.zoomerid
                  , 'driverid':$scope.input.driverid
                  , 'fullname':$scope.input.fullname
                  , 'address':$scope.input.address
                  , 'mobile_1':$scope.input.mobile1
                  , 'mobile_2':$scope.input.mobile2
                  , 'email':$scope.input.email
                  , 'nickname':$scope.input.nickname
                  , 'active': $scope.input.active}
			});
			files.upload.then(function (response) {
				$timeout(function () {
					files.result = response.data;
					if( response.data.message=="OK")
					{
						alert('Request Success');
						$uibModalInstance.dismiss('');
						
					}
				},100);
				
			}, function (response) {
				if (response.status > 0)
					$scope.errorMsg = response.status + ': ' + response.data;
			}, function (evt) {
				files.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			});
		} else
		{
			$scope.submit();
		}
		
	};
    $scope.submit = function(){
        
        /*if($scope.input.fullname == ""){
            alert('Please input Full Name');
            return false;
        }
        if($scope.input.nickname == ""){
            alert('Please input Nick Name');
            return false;
        }
        if($scope.input.mobile1 == ""){
            alert('Please Select Mobile 1');
            return false;
        }
        if($scope.input.password == ""){
            alert('Please Select Password');
            return false;
        }*/
        
        var data = {};
        var url = 'http://'+$location.$$host+'/controlpanel/addZoomer.php';
        if($scope.input.zoomerid=='' || $scope.input.zoomerid=='undefined' || $scope.input.zoomerid==null ){
            data = {
                'fullname':$scope.input.fullname
                , 'address':$scope.input.address
                , 'mobile_1':$scope.input.mobile1
                , 'mobile_2':$scope.input.mobile2
                , 'email':$scope.input.email
                , 'nickname':$scope.input.nickname
                , 'password':$scope.input.password
                , 'active':$scope.input.active
				, 'type':4
            };
        }else{

            url = 'http://'+$location.$$host+'/controlpanel/editZoomer.php';
            data = {
                'zoomerid':$scope.input.zoomerid
                , 'driverid':$scope.input.driverid
                , 'fullname':$scope.input.fullname
                , 'address':$scope.input.address
                , 'mobile_1':$scope.input.mobile1
                , 'mobile_2':$scope.input.mobile2
                , 'email':$scope.input.email
                , 'nickname':$scope.input.nickname
                , 'password':$scope.input.password
                , 'active':$scope.input.active
            };
        }
        
                
        var jsonData = CRYPTO.encrypt(data);
        
        
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            if(respone.message.toUpperCase() == "OK"){
                
                alert('Request Success');
                //$scope.getDetail($scope.deliveryEdit.rootid);
                $uibModalInstance.close('');
            }else{
                
                alert('Request Rejected by server');
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
