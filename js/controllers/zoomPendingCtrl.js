angular.module('app')
.controller('zoomPendingCtrl', ['$scope', '$http', '$interval', '$uibModal', 'uiGridConstants',  function($scope, $http, $interval, $uibModal, uiGridConstants){
	/*----------*//*-----VARIABLES-----*//*----------*/
	$scope.myData = [];
	 
    /*----------*//*-----SETTING-----*//*----------*/ 
	$scope.gridOptions = {
        data : $scope.myData,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
			{ field: 'contact_name', displayName : 'Contact Name'  },
			{ field: 'contact_mobile', displayName : 'Contact Mobile'  },
			{ field: 'contact_email', displayName : 'Contact Email'  },
			{ field: 'business_name' , displayName:'Business Name' },
			{ field: 'business_address', displayName : 'Business Address' },
			{ field: 'item_detail', displayName : 'Item Detail' },
			{ field: 'registertime', displayName : 'Timestamp' },
			{ name: 'actions', enableFiltering:false, field:'id', cellClass: 'grid-align', cellTemplate:'<button  ng-click="grid.appScope.openEditModal(row.entity)">Detail</button>'}
        ],
    };
	
	/*----------*//*-----FUNCTION-----*//*----------*/
	 $scope.getPartnerList = function(){
		$http.get('http://18.141.18.7/controlpanel/getNewPartnerList.php')		
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
			$scope.gridOptions.data = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
    };    
    
    $scope.showMe = function(data){
       $scope.requestDriver(data);       
    }
	
	$interval(function(){
        $scope.getPartnerList();    
    },95000);
    $scope.getPartnerList();   
    
    $scope.getHeight = function(){
        var height = $scope.screen.height - 120;
        if(height < 150) height = 150;
        return height; 
    }

   	$scope.openEditModal= function (rawData) {
		var editInstance = $uibModal.open({
		  animation: true,
		  templateUrl: 'editContent.html',
		  controller: 'editInstanceCtrl',
		  size: 'lg',
			resolve: {
		selectedRow: rawData
		}
		});

            editInstance.result.then(function (selectedItem) {
		if( selectedItem=='OK')
		{
			$scope.getPartnerList();
		}
            }, function () {
              console.log('Modal dismissed at: ' + new Date());
            });
    };
}]);

angular.module('app')
.controller('editInstanceCtrl', ['$scope', '$uibModalInstance', '$http', '$uibModal', 'selectedRow', function ($scope, $uibModalInstance, $http, $uibModal, selectedRow) {
    $scope.isbusy=false;
	$scope.data = {};
	$scope.data.id=selectedRow.id; 
	$scope.data.loginpass=''; 
	$scope.data.loginid=''; 
	$scope.billing={};
	$scope.dataPickup=[];
	$scope.getDetailInfo = function(){
		$http.get('http://18.141.18.7/controlpanel/getDetailNewPartner.php?id='+$scope.data.id)		
		.success(function(respone) 
		{
			respone = CRYPTO.decrypt(respone.data);
			for ( var temp in respone.result )
			{
				$scope.data[temp] = decodeURIComponent(respone.result[temp]);
			}
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
    };
	$scope.getPickupInfo = function(){
		$http.get('http://18.141.18.7/controlpanel/getNewPartnerPickup.php?id='+$scope.data.id)		
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
			$scope.dataPickup = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
    };
	$scope.getBillingType= function(){
		$http.get('http://18.141.18.7/controlpanel/getBillingType.php')
		.success(function(respone)
		{
			  respone = CRYPTO.decrypt(respone.data);
			  $scope.billing= respone.result;
		})
		.error(function ()
		{
			  alert('Unable to get Billing list ' );
		});
	};
	$scope.accPartner = function(accType)
	{
		var dataParameter = {'id':$scope.data.id, 'loginid':$scope.data.loginid, 'password':$scope.data.loginpass, 'type':accType, 'billingid':$scope.data.billingtype};
		var jsonData = CRYPTO.encrypt(dataParameter);
		$http({method: 'POST',url:'http://18.141.18.7/controlpanel/accPartner.php', data:{'data' : jsonData},
		headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config)
		{
			if(respone.message == "OK"){
				alert('Request Success');
				$uibModalInstance.close('OK');
			}
			$scope.isbusy=false;
		}).error(function (respone, status, headers, config)
		{
			console.log('error on add partner')
		});
	};
	$scope.accept = function()
	{
		if( $scope.isbusy)
		{
			alert('Please try again in 1 minute');
			return ;
		}
		var r = confirm(  "Are you sure want to accept it?");
        if (r == true) 
		{
			$scope.isbusy=true;
			if($scope.data.billingtype!=undefined )
			{
				if( $scope.data.loginid!=undefined)
				{
					if( $scope.data.loginid.length>3 )
					{
						if( $scope.data.loginpass!=undefined)
						{
							if( $scope.data.loginpass.length>3 )
							{
								$http.get('http://18.141.18.7/controlpanel/checkLogin.php?loginid='+$scope.data.loginid)
								.success(function(respone)
								{
									if( respone.valid=="TRUE")
									{
										$scope.accPartner("A");
										alert("Login Accepted");
									}else{									
										alert("Login already exist");
									}
									$scope.isbusy=false;
								})
								.error(function ()
								{
									$scope.isbusy=false;
									alert("Problem with connection");
								});
								alert("OK");
							} else 
							{
								$scope.isbusy=false;
								alert("Password minimum 4 character");
							}
						} else
						{
							$scope.isbusy=false;
							alert("Invalid Password");
						}
					} else
					{
						$scope.isbusy=false;
						alert("Loginid minimum 4 character");
					}
				} else
				{
					$scope.isbusy=false;
					alert("Invalid Loginid");				
				}
			}else
			{
				$scope.isbusy=false;
				alert("Please select Billing Type");
			}
		}
	};
	$scope.cancel = function()
	{
		if( $scope.isbusy)
		{
			alert('Please try again in 1 minute');
			return ;
		}
		var r = confirm(  "Are you sure want to reject it?");
        if (r == true) 
		{
			$scope.isbusy=true;
			$scope.accPartner("R");
			$uibModalInstance.dismiss('cancel');
		}
	};
	$scope.addPartner= function(){
		var dataParameter = {'partnerid':$scope.data.partnerid, 'partner':$scope.data.partner, 'name':$scope.data.name, 'mobile':$scope.data.mobile, 'email':$scope.data.email, 'address':$scope.data.address ,'info' : $scope.data.info, 'basiccharge':$scope.data.basiccharge, 'servicecharge':$scope.data.servicecharge, 'billingtype':$scope.data.billingtype, 'maxgroup':$scope.data.maxorderingroup , 'maxdistance':$scope.data.maxdistanceingroup, 'lat': $scope.data.lat , 'lng':$scope.data.lng };
		var jsonData = CRYPTO.encrypt(dataParameter);
		if( $scope.data.lat!=0 && $scope.data.lng!=0 )
		{
			$http({method: 'POST',url:'http://18.141.18.7/controlpanel/editPartner.php', data:{'data' : jsonData},
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config)
			{
				if(respone.message == "OK"){
					alert('Request Success');
					$uibModalInstance.close('OK');
				}
			}).error(function (respone, status, headers, config)
			{
				console.log('error on add partner')
			});

		} else 
		{
			alert("invalid address");
		}
	};
	$scope.getDetailInfo();
	$scope.getBillingType();
	$scope.getPickupInfo ();
}]);