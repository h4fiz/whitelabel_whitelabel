angular.module('app')
.controller('zoomPartnerCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

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
			{ field: 'partnerid', displayName : 'ID'  },
			{ field: 'partner_name', displayName : 'Partner'  },
			{ field: 'partner_contact', displayName : 'Contact Person'  },
			{ field: 'partner_mobile' , displayName:'Mobile' },
			{ field: 'partner_mail', displayName : 'email' },
			{ name: 'actions', enableFiltering:false, field:'partnerid', cellClass: 'grid-align', cellTemplate:'<button  ng-click="grid.appScope.openPartnerModal(row.entity)">Edit</button>'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.reload= function(){
        $scope.getList();
    };

    $scope.getList = function(){

        var url = 'http://18.141.18.7/controlpanel/getPartnerList.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/getPartnerList.php";

		$scope.gridOptions.data = [];
        $http.get(url)		
		.success(function(respone) 
		{
			respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++)
			{
				respone.result[i].partnerid = decodeURIComponent(respone.result[i].partnerid) ;
				respone.result[i].partner_name= decodeURIComponent(respone.result[i].partner_name) ;
				respone.result[i].partner_contact= decodeURIComponent(respone.result[i].partner_contact) ;
				respone.result[i].partner_mobile= decodeURIComponent(respone.result[i].partner_mobile) ;
				respone.result[i].partner_mail= decodeURIComponent(respone.result[i].partner_mail) ;

				respone.result[i].basiccharge= decodeURIComponent(respone.result[i].basiccharge) ;
				respone.result[i].servicecharge= decodeURIComponent(respone.result[i].servicecharge) ;
				respone.result[i].storageandhandling= decodeURIComponent(respone.result[i].storageandhandling) ;
				respone.result[i].fuelsurcharge= decodeURIComponent(respone.result[i].fuelsurcharge) ;
				respone.result[i].suminsuredpercentage= decodeURIComponent(respone.result[i].suminsuredpercentage) ;
				respone.result[i].billingtype= decodeURIComponent(respone.result[i].billingtype) ;
				respone.result[i].partner_status= decodeURIComponent(respone.result[i].partner_status) ;
				respone.result[i].maxorderingroup= decodeURIComponent(respone.result[i].maxorderingroup) ;
				respone.result[i].maxdistanceingroup= decodeURIComponent(respone.result[i].maxdistanceingroup) ;
				respone.result[i].partner_address= decodeURIComponent(respone.result[i].partner_address) ;
				respone.result[i].partner_addressinfo= decodeURIComponent(respone.result[i].partner_addressinfo) ;
				respone.result[i].small= decodeURIComponent(respone.result[i].small) ;
				respone.result[i].medium= decodeURIComponent(respone.result[i].medium) ;
				respone.result[i].large= decodeURIComponent(respone.result[i].large) ;
			}
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
    };

    $scope.addPartner = function(){
        var data = {
            partnerid:0,
            partner_name:'',
            partner_contact:'',
            partner_mobile:'',
            partner_mail:'',
            partner_address:'',
            partner_addressinfo:'',
            maxorderingroup:0,
            maxdistanceingroup:0,
            basiccharge:'',
            servicecharge:'',
            storageandhandling:0,
            fuelsurcharge:0,
            suminsuredpercentage:'',
            billingtype:'',
            lat:0,
            lng:0,
			partnertype:'1',
            partnergroup:'1',
			small:0,
			medium:0,
            large:0,
            additionalfeeperkg:0
        }
        $scope.openPartnerModal(data);
    }

    $scope.openPartnerModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'PartnerModal.html',
            controller: 'PartnerModalCtrl',
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
.controller('PartnerModalCtrl', ['$scope', '$uibModalInstance', 'dataPartner', '$http', '$uibModal', function ($scope, $uibModalInstance, dataPartner, $http, $uibModal) {
    $scope.dataPartner = dataPartner; 
    $scope.billing=[];
    $scope.billingdescription = '';
    
	$scope.partnertype = [];
    $scope.partnergroup = [];
    $scope.input = {
        id:0,
        partner:'',
        contact:'',
        mobile:'',
        email:'',
        address:'',
        addressInfo:'',
        maxOrderGroup:0,
        maxDistanceGroup:0,
        basicCharge:0,
        serviceCharge:0,
        storageandhandling:0,
        fuelsurcharge:0,
        suminsuredpercentage:0,
        billingType:'',
		smallSpace:2,
		mediumSpace:3,
		largeSpace:9,
        lat:0,
        lng:0,
		partnertype:'0',
        partnergroup:'1',
        additonalFeePerKg: 0
    };
    
    //============INITIAL=============
    $scope.init = function(){
        $scope.getBillingType();
		$scope.getPartnerType();
        $scope.getPartnerGroup();
        
        $scope.input.id = $scope.dataPartner.partnerid;
        $scope.input.partner = $scope.dataPartner.partner_name;
        $scope.input.contact = $scope.dataPartner.partner_contact;
        $scope.input.mobile = $scope.dataPartner.partner_mobile;
        $scope.input.email = $scope.dataPartner.partner_mail;
        $scope.input.address = $scope.dataPartner.partner_address;
        $scope.input.addressInfo = $scope.dataPartner.partner_addressinfo;
        $scope.input.maxOrderGroup = $scope.dataPartner.maxorderingroup;
        $scope.input.maxDistanceGroup = $scope.dataPartner.maxdistanceingroup;
        $scope.input.basicCharge = $scope.dataPartner.basiccharge;
        $scope.input.serviceCharge = $scope.dataPartner.servicecharge;
        $scope.input.storageandhandling = $scope.dataPartner.storageandhandling;
        $scope.input.fuelsurcharge = $scope.dataPartner.fuelsurcharge;
        $scope.input.suminsuredpercentage = $scope.dataPartner.suminsuredpercentage;
        $scope.input.billingType = $scope.dataPartner.billingtype;
        $scope.input.lat = $scope.dataPartner.lat;
        $scope.input.lng = $scope.dataPartner.lng;

		//$scope.input.smallSpace = $scope.dataPartner.small;
        //$scope.input.mediumSpace = $scope.dataPartner.medium;
        //$scope.input.largeSpace = $scope.dataPartner.large;
		$scope.input.smallSpace = Math.round(10000/$scope.dataPartner.small)/100;
        $scope.input.mediumSpace = Math.round(10000/$scope.dataPartner.medium)/100;
        $scope.input.largeSpace = Math.round(10000/$scope.dataPartner.large)/100;
        $scope.input.partnertype = $scope.dataPartner.partnertype;
        $scope.input.partnergroup = $scope.dataPartner.partnergroup;
        $scope.input.additonalFeePerKg = $scope.dataPartner.additionalfeeperkg;
        $scope.changeDescription();
    }

    //============FUNCTION===========
    $scope.getBillingType= function(){

            var url = 'http://18.141.18.7/controlpanel/getBillingType.php';
            if(usingDevelopment)
                url = serverDevelopment+"/controlpanel/getBillingType.php";

            $http.get(url)
            .success(function(respone)
            {
                    respone = CRYPTO.decrypt(respone.data);
                    $scope.billing= respone.result;
                    $scope.changeDescription();
            })
            .error(function ()
            {
                    alert('Unable to get Billing list ' );
            });
    };
	$scope.getPartnerType= function(){

            var url = 'http://18.141.18.7/controlpanel/getPartnerType.php';
            if(usingDevelopment)
                url = serverDevelopment+"/controlpanel/getPartnerType.php";

            $http.get(url)
            .success(function(respone)
            {
                    respone = CRYPTO.decrypt(respone.data);
                    $scope.partnertype= respone.result;
                    //$scope.changeDescription();
            })
            .error(function ()
            {
                    alert('Unable to get Billing list ' );
            });
    };
    $scope.getPartnerGroup= function(){

            var url = 'http://18.141.18.7/controlpanel/getPartnerGroup.php';
            if(usingDevelopment)
                url = serverDevelopment+"/controlpanel/getPartnerGroup.php";

            $http.get(url)
            .success(function(respone)
            {
                    respone = CRYPTO.decrypt(respone.data);
                    $scope.partnergroup= respone.result;
                    //$scope.changeDescription();
            })
            .error(function ()
            {
                    alert('Unable to get Billing list ' );
            });
    };
    $scope.changeDescription = function(){
        for(var i=0, length=$scope.billing.length;i<length;i++){
            if($scope.input.billingType == $scope.billing[i].billingid){
                $scope.billingdescription = $scope.billing[i].description;
                break;
            }
        }
        
    }
	$scope.changeType = function(){
        if($scope.input.partnertype == '1' || $scope.input.partnertype == '2' )
        {
            $scope.input.partnergroup = '1';
        }
    }
    $scope.submit = function(){
        
        /*if($scope.input.address == ""){
            alert('Please input '+$scope.typeEdit+' address');
            return false;
        }*/
        

        var data = {
            partnerid:$scope.input.id,
            partner:$scope.input.partner,
            name:$scope.input.contact,
            mobile:$scope.input.mobile,
            email:$scope.input.email,
            address:$scope.input.address,
            info:$scope.input.addressInfo,
            lat:$scope.input.lat,
            lng:$scope.input.lng,
            maxgroup:$scope.input.maxOrderGroup,
            maxdistance:$scope.input.maxDistanceGroup,
            basiccharge:$scope.input.basicCharge,
            servicecharge:$scope.input.serviceCharge,
            storageandhandling:$scope.input.storageandhandling,
            fuelsurcharge:$scope.input.fuelsurcharge,
            suminsuredpercentage:$scope.input.suminsuredpercentage,
            billingtype:$scope.input.billingType,
			//small:$scope.input.smallSpace,
            //medium:$scope.input.mediumSpace,
            //large:$scope.input.largeSpace,
			small: Math.round(100000/$scope.input.smallSpace)/1000,
            medium:Math.round(100000/$scope.input.mediumSpace)/1000,
            large:Math.round(100000/$scope.input.largeSpace)/1000,
            partnertype:$scope.input.partnertype,
            partnergroup:$scope.input.partnergroup,
            additionalfeeperkg: $scope.input.additonalFeePerKg
        };
        
        var jsonData = CRYPTO.encrypt(data);
        
        var url = 'http://18.141.18.7/controlpanel/editPartner.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/editPartner.php";
        if($scope.input.id == 0){
            url = 'http://18.141.18.7/controlpanel/addPartner.php';
            if(usingDevelopment)
                url = serverDevelopment+"/controlpanel/addPartner.php";
        }
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            //respone = CRYPTO.decrypt(respone.data);
            if(respone.message.toUpperCase() == "OK"){
                
                alert('Success.');
                //$scope.getDetail($scope.deliveryEdit.rootid);
                $uibModalInstance.close($scope.typeEdit);
                
            }else{
                alert(respone.message.toUpperCase());
                alert('Saving Rejected by server');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Saving Failed. Please try again');
        });
    }

    $scope.openMapModal = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'MapModal.html',
            controller: 'MapModalCtrl',
            size: 'lg',
            resolve: {
                dataInput: function () {
                    return data;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.input.address = returnValue.address;
            $scope.input.lat = returnValue.lat;
            $scope.input.lng = returnValue.lng;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }


    $scope.openAddessModal = function(){
        var modalInstanceAddress = $uibModal.open({
            animation: true,
            templateUrl: 'PartnerAddressModal.html',
            controller: 'PartnerAddressModalCtrl',
            size: 'lg',
            resolve: {
                dataInput: function () {
                    return $scope.input;
                },
            },
            scope: $scope
        });

        modalInstanceAddress.result.then(function (returnValue) {
            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
	$scope.openWeightModal = function(){
        var modalInstanceAddress = $uibModal.open({
            animation: true,
            templateUrl: 'PartnerWeightModal.html',
            controller: 'PartnerWeightModalCtrl',
            size: 'lg',
            resolve: {
                dataInput: function () {
                    return $scope.input;
                },
            },
            scope: $scope
        });

        modalInstanceAddress.result.then(function (returnValue) {
            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
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
.controller('PartnerWeightModalCtrl', ['$scope', '$uibModalInstance', 'dataInput', '$http', '$uibModal', '$location',
function ($scope, $uibModalInstance, dataInput, $http, $uibModal, $location) {
	$scope.data= dataInput;
	$scope.items=[];
	$scope.addSpec = function() {
		var temp={from:0, to:0,price:0};
		$scope.items.push(temp);
	};
	$scope.submit = function() {
		var arr=[];
		for(var i=0, length=$scope.items.length;i<length;i++) {
			if( $scope.items[i].to>0 && $scope.items[i].price>0 ){
				arr.push($scope.items[i]);
			}
		}
		console.log(arr);
		var data = {
			vendorid:dataInput.id,
			items:arr
		};
		var jsonData = CRYPTO.encrypt(data);
		var url = 'http://'+$location.$$host+'/controlpanel/setPartnerWeight.php';
		$http({method: 'POST',url: url, data:{'data':jsonData},  
		headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
			if(respone.message == "OK"){
				alert('Submit Weight Success');
				$uibModalInstance.dismiss('cancel');
			}else{
				alert('Submit Weight fail.');
			}
		}).error(function (respone, status, headers, config){
			alert('Request Failed');
		});
	}
	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
	$scope.loadSpec = function() {
		var url = 'http://'+$location.$$host+'/controlpanel/getPartnerWeight.php?vendorid='+dataInput.id;
		$http.get(url).success(function(respone)
		{
			respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++) {
				for ( var temp in respone.result[i] ) {
					respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
					respone.result[i][temp] = Number(respone.result[i][temp]);
				}
			}
				$scope.items= respone.result;
		}).error(function ()
		{
			alert('Unable to get Billing list ' );
		});
	};
	$scope.loadSpec();
}]);

angular.module('app')
.controller('PartnerAddressModalCtrl', ['$scope', '$uibModalInstance', 'dataInput', '$http', '$uibModal', 
function ($scope, $uibModalInstance, dataInput, $http, $uibModal) {
    $scope.dataPartnerAddress = dataInput;
    $scope.listAddress = [];

    $scope.inputAddress = {
        address:'',
        lat:0,
        lng:0,
        contact:'',
        telp:'',
    };

    $scope.gridAddressOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
			{ field: 'seq', displayName : 'No', width:70  },
			{ field: 'address', displayName : 'Address', cellTooltip: 
                function( row, col ) {
                    return 'Address : ' + row.entity.address;
                }  
            },
            { field: 'contact', displayName : 'Contact'  },
            { field: 'telp', displayName : 'Telp'  },
			{ name: 'actions', enableFiltering:false, width:100, field:'outletid', cellClass: 'grid-align', cellTemplate:'<button  ng-click="grid.appScope.deleteAddress(row.entity)">Delete</button>'}
        ],
    };

    $scope.getListAddress = function(){
        
        var data = {
            partnerid: $scope.dataPartnerAddress.id,
        };
        var jsonData = CRYPTO.encrypt(data);

        var url = 'http://18.141.18.7/controlpanel/getListPartnerOutletAddress.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/getListPartnerOutletAddress.php";
        
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}})
        .success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            
            $scope.listAddress = respone.records;
            $scope.gridAddressOptions.data = respone.records;
              
        }).error(function (respone, status, headers, config){
            alert('Get Partner Address Failed. Please try again');
        });
    }

    $scope.openMapAddressModal = function(data){
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'MapModal.html',
            controller: 'MapModalCtrl',
            size: 'lg',
            resolve: {
                dataInput: function () {
                    return data;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            
            $scope.inputAddress.address = returnValue.address;
            $scope.inputAddress.lat = returnValue.lat;
            $scope.inputAddress.lng = returnValue.lng;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    $scope.addAddress = function(dataPartner){
        var data = {
            partnerid: $scope.dataPartnerAddress.id,
            address: dataPartner.address,
            lat: dataPartner.lat,
            lng: dataPartner.lng,
            contact: dataPartner.contact,
            telp: dataPartner.telp,
        }

        var jsonData = CRYPTO.encrypt(data);
        var url = 'http://18.141.18.7/controlpanel/addPartnerOutletAddress.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/addPartnerOutletAddress.php";
        
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}})
        .success(function (respone, status, headers, config) 
        {
            //respone = CRYPTO.decrypt(respone.data);
            if(respone.status.toLowerCase() == "ok"){
                alert('Add Address Success');
                $scope.inputAddress.address = "";
                $scope.inputAddress.lat = "";
                $scope.inputAddress.lng = "";
                $scope.inputAddress.contact = "";
                $scope.inputAddress.telp = "";

            }else{
                alert('Add Address Failed. Error : '+respone.message);
            }
            $scope.getListAddress();
        }).error(function (respone, status, headers, config){
            alert('Add Partner Address Failed. Please try again');
        });
    }
    $scope.deleteAddress = function(outletData){
        var data = {
            outletid: outletData.outletid,
        };
        var jsonData = CRYPTO.encrypt(data);
        var url = 'http://18.141.18.7/controlpanel/deletePartnerOutletAddress.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/deletePartnerOutletAddress.php";
        
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}})
        .success(function (respone, status, headers, config) 
        {
            //respone = CRYPTO.decrypt(respone.data);
            
            if(respone.status.toLowerCase() == "ok"){
                alert('Delete Address Success');

            }else{
                alert('Delete Address Failed. Error : '+respone.message);
            }
            $scope.getListAddress();
        }).error(function (respone, status, headers, config){
            alert('Delete Partner Address Failed. Please try again');
        });
    }

    /*$scope.ok = function () {    
        $uibModalInstance.close(null); //close return something
    };*/

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.init = function(){
        $scope.getListAddress();
    }
    $scope.init();

}]);
