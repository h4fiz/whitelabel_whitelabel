angular.module('app')
.controller('zoomerListCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', '$location', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, $location){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.list = [];
    $scope.listdrivertype = [];
    $scope.TypeName = "Full-Timer";
    
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
		exporterPdfTableStyle: {margin: [10, 10, 10, 5]},
		exporterPdfOrientation: 'landscape',
        columnDefs:[
            { field: 'zoomerid', displayName : 'ZoomerId'  },
            { field: 'fullname', displayName : 'Full Name'  },
            { field: 'nickname', displayName : 'Nick Name'  },
            { field: 'mobile_1', displayName : 'Mobile 1' },
            { field: 'mobile_2', displayName : 'Mobile 2' },
            { field: 'address', displayName : 'Address' },
            { field: 'email', displayName : 'Email' },
            { field: 'type', displayName : 'Type' },
            { field: 'active', displayName : 'Active', width:80 },
			{ name: 'actions', enableFiltering:false, field:'userid', cellClass: 'grid-align', cellTemplate:'<button  ng-click="grid.appScope.editZoomer(row.entity)">Edit</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.reload= function(){
        $scope.getList();
    };

    $scope.getList = function(){
        $http.get('http://'+$location.$$host+'/controlpanel/getZoomerList.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			 for(var i=0, length=respone.result.length;i<length;i++){
                    respone.result[i].driverid= decodeURIComponent(respone.result[i].driverid) ;
                    respone.result[i].zoomerid= decodeURIComponent(respone.result[i].zoomerid) ;
                    respone.result[i].fullname= decodeURIComponent(respone.result[i].fullname) ;
                    respone.result[i].address= decodeURIComponent(respone.result[i].address) ;
                    respone.result[i].mobile_1= decodeURIComponent(respone.result[i].mobile_1) ;
                    respone.result[i].mobile_2= decodeURIComponent(respone.result[i].mobile_2) ;
                    respone.result[i].active= decodeURIComponent(respone.result[i].active) ;
                    respone.result[i].email= decodeURIComponent(respone.result[i].email) ;
                    respone.result[i].image= decodeURIComponent(respone.result[i].image) ;
                    respone.result[i].nickname= decodeURIComponent(respone.result[i].nickname);
                    respone.result[i].active= decodeURIComponent(respone.result[i].active);
                    respone.result[i].type= decodeURIComponent(respone.result[i].type);
                    respone.result[i].typeid= decodeURIComponent(respone.result[i].typeid);
			}
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner login' );
		});
    };
	
    $scope.getDriverType = function(){
        $http.get('http://apps.zoomitnow.co/controlpanel/getDriverType.php')        
        .success(function(respone) 
        {
            respone = CRYPTO.decrypt(respone.data);
             for(var i=0, length=respone.result.length;i<length;i++){
                    respone.result[i].drivertype= decodeURIComponent(respone.result[i].drivertype) ;
                    respone.result[i].description= decodeURIComponent(respone.result[i].description) ;
            }
            $scope.listdrivertype = respone.result;
        })
        .error(function () 
        {
            alert('Unable to get driver type' );
        });
    }

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
            active:'Y',
            type: '1',
            listdrivertype : $scope.listdrivertype
        }
        $scope.openZoomerModal(param);
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
            active: data.active,
            type : data.typeid,
            listdrivertype : $scope.listdrivertype
        }
        $scope.openZoomerModal(param);
    }

    $scope.openZoomerModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'ZoomerModal.html',
            controller: 'ZoomerModalCtrl',
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
        $scope.getDriverType();

        $rootScope.eventInit.push($interval(function(){
            $scope.getList();
            $scope.getDriverType();
        },15000));
    };
    $scope.init();
}]);

angular.module('app')
.controller('ZoomerModalCtrl', ['$scope', '$uibModalInstance', 'stateParam', '$http', '$uibModal','Upload', function ($scope, $uibModalInstance, stateParam, $http, $uibModal, Upload) {
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
        active:'Y',
        type: '1'
    };

    $scope.listtype = [];
    
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
            $scope.input.type = $scope.dataParam.type;
            $scope.listtype = $scope.dataParam.listdrivertype;
        }
    }

    //============FUNCTION===========
    $scope.editForm = function (files) {
		if(files) 
		{
			files.upload = Upload.upload({
				  url: 'http://apps.zoomitnow.co/controlpanel/editZoomer.php',
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
                  , 'active': $scope.input.active
                  , 'type': $scope.input.type}
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
        var url = 'http://apps.zoomitnow.co/controlpanel/addZoomer.php';
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
                , 'type':$scope.input.type
            };
        }else{

            url = 'http://apps.zoomitnow.co/controlpanel/editZoomer.php';
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
                , 'type':$scope.input.type
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
