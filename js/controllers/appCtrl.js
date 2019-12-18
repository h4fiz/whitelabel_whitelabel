angular.module('app')
.controller('appCtrl', ['$state', '$scope', '$rootScope', '$interval', '$http', '$location' , function($state, $scope, $rootScope, $interval, $http, $location){
    
    /*---------*//*------PUBLIC VARIABLE------*//*---------*/
    $scope.isMenuShow = false;
    
    $scope.toogleMenuCol = function(){
        $scope.isMenuShow = !$scope.isMenuShow;
    }
    $rootScope.eventInit = [];
    
    /*---------*//*------DATEPCIKER SETTING------*//*---------*/
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    /*---------*//*------SCREEN------*//*---------*/
    $scope.screen = {
        width:window.innerWidth,
        height:window.innerHeight
    }

    /*---------*//*------EVENT------*//*---------*/
    $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams, options){ 
        //event.preventDefault(); 
        // transitionTo() promise will be rejected with 
        // a 'transition prevented' error
        for(var i=0, length=$scope.eventInit.length; i< length;i++){
            //console.log('deleting event');
            $interval.cancel($scope.eventInit[i]);
        }
    });

    $rootScope.$on('$viewContentLoading', 
    function(event, viewConfig){ 
        // Access to all the view config properties.
        // and one special property 'targetView'
        // viewConfig.targetView
        var url = 'http://'+$location.$$host+'/controlpanel/getSession.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/getSession.php";

        $http.get(url)		
		.success(function(respone) {
            
            respone = CRYPTO.decrypt(respone.data);
            if (respone.status === 'NO') {
                window.location.replace("logout.php");
            }
        })
        .error(function(err) {
            console.log(err);
        });
    });

    /*---------*//*------GLOBAL FUNCTION------*//*---------*/
    
}]);

angular.module('app')
.controller('DetailOrderModalCtrl', ['$scope', '$uibModalInstance', 'orderId', '$http', '$uibModal', '$location', function ($scope, $uibModalInstance, orderId, $http, $uibModal, $location) {
    $scope.orderId = orderId;    
    $scope.detailOrders = [];
    $scope.order = {};

    //===========INITIAL===========
    $scope.gridDetailOrdersOptions = {
        data : $scope.detailOrders,
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'sortkey', displayName : 'No', enableFiltering:false, width:60 }, 
            { field: 'zoom_orderid' , displayName:'Order ID', width:100 },
            { field: 'rootid' , displayName:'Group ID', width:100 },
            { field: 'delivery_contact' , displayName:'Receiver Name', width:150 }, 
            { field: 'delivery_address' , displayName:'Delivery Address', width:250 },
            { field: 'delivery_phone' , displayName:'Delivery Phone', width:100 },
            { field: 'delivery_instruction' , displayName:'Delivery Instruction', width:250 },
            { field: 'cod' , displayName:'COD Amount', width:90 },
            { field: 'sum_insured' , displayName:'Sum Insured', width:120 },
            { field: 'weight', displayName:'Weight', width:150},
            { field: 'status', displayName:'Status', width:150}, 
			{ field: 'trackingid', displayName:'TrackingID', width:150}, 
            // { name: 'actions', enableFiltering:false, field:'sortkey', width:150}
            { name: 'actions', enableFiltering:false, field:'sortkey', width:250, cellTemplate:'<button class="btn btn-sm btn-info" ng-click="grid.appScope.pod(row.entity)" ng-show="row.entity.status.toLowerCase() == \'delivered\' "  >POD</button>'}
            // { name: 'actions', enableFiltering:false, field:'sortkey', width:250, cellTemplate:' <button class="btn btn-sm btn-danger" ng-show="row.entity.status.toLowerCase() == \'available\'" ng-click="grid.appScope.doCancelOrder(row.entity)">Cancel</button> <button class="btn btn-sm btn-info" ng-click="grid.appScope.pod(row.entity)" ng-show="row.entity.status.toLowerCase() == \'delivered\' "  >POD</button>'}
        ], 
    }; 
    
    //============FUNCTION============
    $scope.getDetail = function(){
        var data = {'rootid':$scope.orderId};
        jsonData = CRYPTO.encrypt(data);

        var url = 'http://'+$location.$$host+'/controlpanel/getOrderGroupDetail.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/getOrderGroupDetail.php";

        $http({method: 'POST',url:url, data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
	    for(var i=0, length=respone.result.length;i<length;i++){ 
                                for ( var temp in respone.result[i] ) 
                {
                        respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
                }
                        }

            for(var i = 0, length = respone.result.length;i<length;i++){
                respone.result[i].cod = parseFloat(respone.result[i].cod).toFixed(2);
            }
            $scope.order = respone.result[0];
            $scope.detailOrders = respone.result;
            $scope.gridDetailOrdersOptions.data = respone.result;
            console.log(respone.result);
            // ini yang adalah yang paling penting
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }

    $scope.doEditPickup = function(){
        $scope.doEditOrder($scope.order, 'Pickup');
    }
	$scope.pod = function(data){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/PODModal.html?v=3',
            controller: 'PODModalCtrl',
            size: 'lg',
            resolve: {
                dataOrder: function () {
                    return data;
                }
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getDetail();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
    $scope.doEditOrder = function(data, type){
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'EditOrderModal.html',
            controller: 'EditOrderModalCtrl',
            size: 'lg',
            resolve: {
                dataOrder: function () {
                    return data;
                },
                typeEdit : function () {
                    return type;
                },
            },
            scope: $scope
        });

        modalInstance.result.then(function (returnValue) {
            $scope.getDetail();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });  
    }
	$scope.doUnsuccessful = function(data){   
        
		if( (data.status!="Delivered" && data.status!="Canceled") ) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'templates/unsuccessfulModalForm.html',
				controller: 'unsuccessfulModalFormCtrl',
				size: 'lg',
				resolve: {
					rootId: function () {
						return data.rootid;
					},
					orderId: function () {
						return data.zoom_orderid;
					},
					address: function () {
						return data.delivery_address;
					},
					contact: function () {
						return data.delivery_contact;
					}
				},
				scope: $scope
			});

			modalInstance.result.then(function (returnValue) {
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
			/*	
			if(confirm('Are your sure want set order '+data.zoom_orderid+' to be Unsuccessful ?')) {
				var data = {
					zoomorderid:data.zoom_orderid,
					rootid:data.rootid,
				};
				var jsonData = CRYPTO.encrypt(data);
				var url = "http://18.141.18.7/controlpanel/setUnsuccessfulOrder.php";
				if(usingDevelopment)
					url = serverDevelopment+"/controlpanel/setUnsuccessfulOrder.php";
				
				$http({method: 'POST',url:url, data:{'data':jsonData},  
					headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
				{
					respone = CRYPTO.decrypt(respone.data);
					if(respone.message.toUpperCase() == "OK"){
						alert('Unsuccessful Order Success.');
						$scope.getDetail();                    
					}else{
						alert('Unsuccessful Order rejected');                    
					}
				}).error(function (respone, status, headers, config){
					alert('Cancel Order Failed. Please try again');
				});
			}  */ 
		} else {
			alert('Invalid Order '+data.zoom_orderid+ ', status : '+data.status );
		}
	}
    $scope.doCancelOrder = function(data){
        if(confirm('Are your sure want to cancel order '+data.rootid+', No. '+data.sortkey+'?')){
            var data = {
                zoomorderid:data.zoom_orderid,
            };
            var jsonData = CRYPTO.encrypt(data);

            var url = 'http://'+$location.$$host+'/controlpanel/setCancelOrder.php';
            if(usingDevelopment)
                url = serverDevelopment+"/controlpanel/setCancelOrder.php";
            
            $http({method: 'POST',url:url, data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                if(respone.message.toUpperCase() == "OK"){
                    alert('Cancel Order Success.');
                    $scope.getDetail();                    
                }else{
                    alert('Cancel Order reject by order');                    
                }
            }).error(function (respone, status, headers, config){
                alert('Cancel Order Failed. Please try again');
            });
        }
    }


    /*$scope.ok = function () {    
        $uibModalInstance.close(null); //close return something
    };*/

    $scope.cancel = function () {
        //$uibModalInstance.dismiss('cancel');
        $uibModalInstance.close(null); //close return something
    };

    $scope.getDetail();
}]);

angular.module('app').controller('PODModalCtrl', ['$scope', '$uibModalInstance', 'dataOrder', '$location', '$http', '$uibModal', 
function ($scope, $uibModalInstance, dataOrder, $location, $http, $uibModal) {
	$scope.data={};
	$scope.data.orderid='';
	$scope.data.name = '';
	$scope.data.phone = '';
	$scope.data.address = '';
	$scope.data.detail = '';
	$scope.data.driverid = '';
	$scope.data.timestamp = '';
	$scope.data.signaturenotes = '';
	$scope.init = function(){
        
        var url = 'http://'+$location.$$host+'/controlpanel/getPOD.php?zoomorderid='+dataOrder.zoom_orderid;
        
        $http({method: 'POST',url:url, data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
		}).success(function (respone, status, headers, config) {
            respone = CRYPTO.decrypt(respone.data);
			$scope.data.orderid = decodeURIComponent(respone.zoomorderid);
			$scope.data.name = decodeURIComponent(respone.Delivery_Name);
			$scope.data.phone = decodeURIComponent(respone.Delivery_Phone);
			$scope.data.address = decodeURIComponent(respone.Delivery_Address);
			$scope.data.detail = decodeURIComponent(respone.Delivery_detail);
			$scope.data.driverid = decodeURIComponent(respone.driverid);
			$scope.data.timestamp = decodeURIComponent(respone.delivered);
			$scope.data.signaturenotes = decodeURIComponent(respone.signaturenotes);
			$scope.data.pic = $location.$$host+'/zoom/foto/'+decodeURIComponent(respone.picturefile);
			$scope.data.signature = $location.$$host+'/zoom/signature/'+decodeURIComponent(respone.signaturefile);
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
	$scope.init();
}]);

angular.module('app')
.controller('unsuccessfulModalFormCtrl', ['$scope', '$uibModalInstance', 'rootId', 'orderId','address', 'contact', '$http', '$uibModal', '$location', function ($scope, $uibModalInstance, rootId, orderId, address, contact, $http, $uibModal, $location) {
	$scope.Orderid = orderId;
	$scope.DeliveryAddress = address;
	$scope.DeliveryName = contact;
	$scope.rootid = rootId;
	$scope.notes='';
    $scope.selectReason = '';
    $scope.reasonList = [];

    $scope.getUnsuccessfullReason = function(){
        var url = 'http://'+$location.$$host+'/controlpanel/getUnsuccessfulReason.php';
        $http({method: 'POST',url:url, data:{'data': ''},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            if(respone.message.toUpperCase() == "OK"){
                $scope.reasonList = respone.records;
                
            }else{
                alert(respone.message);                    
            }
        }).error(function (respone, status, headers, config){
            alert('Cancel Order Failed. Please try again');
        });
    }
    $scope.getUnsuccessfullReason();
    
	
	$scope.cancel = function () {
        $uibModalInstance.close(null); //close return something
    };
	$scope.ok = function () {
        /*if($scope.notes.length<=2){
            $scope.notes = $scope.selectReason;
        }*/

		if( $scope.notes.length>2  ) {
			if(confirm('Are your sure want set order '+$scope.Orderid+' to be Unsuccessful ?')) {
				var data = {
					zoomorderid:$scope.Orderid,
					rootid:$scope.rootid,
                    reason: $scope.selectReason,
					notes:encodeURIComponent($scope.notes),

				};
				var jsonData = CRYPTO.encrypt(data);
				var url = 'http://'+$location.$$host+'/controlpanel/setManualUnsuccessful.php';
				
				$http({method: 'POST',url:url, data:{'data':jsonData},  
					headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
				{
					respone = CRYPTO.decrypt(respone.data);
					if(respone.message.toUpperCase() == "OK"){
						alert('Unsuccessful Order Success.');
						$uibModalInstance.close(null);                
					}else{
						alert('Unsuccessful Order rejected');                    
					}
				}).error(function (respone, status, headers, config){
					alert('Cancel Order Failed. Please try again');
				});
			}
		} else {
			alert ("Please input the remarks");	
		}
	};
}]);

angular.module('app')
.controller('EditOrderModalCtrl', ['$scope', '$uibModalInstance', 'dataOrder', 'typeEdit', '$http', '$uibModal', '$location', function ($scope, $uibModalInstance, dataOrder, typeEdit, $http, $uibModal, $location) {
    $scope.dataOrder = dataOrder;    
    $scope.typeEdit = typeEdit;
    $scope.input = {
        address:'',
        detail:'',
        name:'',
        phone:'',
        cod:'',
        instruction:'',
        lat:0,
        lng:0,
    };
    
    //============INITIAL=============
    $scope.init = function(){
        //console.log($scope.dataOrder);
        if($scope.typeEdit == 'Delivery'){
            $scope.input.address = $scope.dataOrder.delivery_address;
            $scope.input.detail = $scope.dataOrder.delivery_detail;
            $scope.input.name = $scope.dataOrder.delivery_contact;
            $scope.input.phone = $scope.dataOrder.delivery_phone;
            $scope.input.cod = $scope.dataOrder.cod;
            $scope.input.instruction = $scope.dataOrder.delivery_instruction;
            $scope.input.lat = $scope.dataOrder.delivery_lat;
            $scope.input.lng = $scope.dataOrder.delivery_lng;
        }else{
            $scope.input.address = $scope.dataOrder.pickup_address;
            $scope.input.detail = $scope.dataOrder.pickup_detail;
            $scope.input.name = $scope.dataOrder.pickup_name;
            $scope.input.phone = $scope.dataOrder.pickup_phone;
            $scope.input.cod = 0;
            $scope.input.instruction = '';
            $scope.input.lat = $scope.dataOrder.pickup_lat;
            $scope.input.lng = $scope.dataOrder.pickup_lng;
        }
    }

    //============FUNCTION============
    $scope.doEdit = function(){
        
        if($scope.input.address == ""){
            alert('Please input '+$scope.typeEdit+' address');
            return false;
        }
        if($scope.input.name == ""){
            alert('Please input '+$scope.typeEdit+' name');
            return false;
        }
        if($scope.input.phone == ""){
            alert('Please input '+$scope.typeEdit+' phone');
            return false;
        }
        if($scope.typeEdit=='Delivery'){
            if($scope.input.cod == ""){
                alert('Please input COD Amount');
                return false;
            }
            if(isNaN($scope.input.cod)){
                alert('Invalid COD Amount');
                return false;
            }    
        }

        var data = {
            zoomorderid:$scope.dataOrder.zoom_orderid,
            address:$scope.input.address,
            detail:$scope.input.detail,
            name:$scope.input.name,
            phone:$scope.input.phone,
            lat:$scope.input.lat,
            lng:$scope.input.lng,
            instruction:$scope.input.instruction,
            fmid:$scope.dataOrder.fmid,
            cod:$scope.input.cod,
        };
        console.log(data);
        var jsonData = CRYPTO.encrypt(data);
        
        var url = 'http://'+$location.$$host+'/controlpanel/editDelivery.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/editDelivery.php";

        if($scope.typeEdit!='Delivery'){
            url = 'http://'+$location.$$host+'/controlpanel/editPickup.php';
            if(usingDevelopment)
                url = serverDevelopment+"/controlpanel/editPickup.php";
        }
        $http({method: 'POST',url: url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            if(respone.message.toUpperCase() == "OK"){
                
                if($scope.typeEdit=='Delivery'){
                    alert('Edit Delivery Success.');
                    //$scope.getDetail($scope.deliveryEdit.rootid);
                    $uibModalInstance.close($scope.typeEdit);
                }
                else{
                    alert('Edit Pickup Success.');
                    //$scope.getBasketOrder();
                    $uibModalInstance.close($scope.typeEdit);
                }
                
            }else{
                if($scope.typeEdit == 'Delivery')
                    alert('Edit Delivery Rejected by server');
                else
                    alert('Edit Pickup Rejected by server');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Edit Delivery Failed. Please try again');
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
            console.log(returnValue);
            $scope.input.address = returnValue.address;
            $scope.input.lat = returnValue.lat;
            $scope.input.lng = returnValue.lng;
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
.controller('MapModalCtrl', ['$scope', '$uibModalInstance', 'dataInput', '$http', '$uibModal', '$timeout','$location', function ($scope, $uibModalInstance, dataInput, $http, $uibModal, $timeout, $location) {
    $scope.dataInput = dataInput;    
    
    $scope.address = {
        address:'',
        lat:0,
        lng:0,
    };
    $scope.map = {
        el:null,
        marker:null,
        address:'',
        addressFormatted:'',
        timeout:null,
        mapTab:true,
        loading:false,
        list:[]
    }
    
    //============INITIAL=============
    $scope.init = function(){
        $scope.address.address = $scope.dataInput.address;
        $scope.address.lat = $scope.dataInput.lat;
        $scope.address.lng = $scope.dataInput.lng;

        //console.log($scope.address);
        $scope.map.addressFormatted = $scope.address.address;
        
        //$timeout(function(){
            if($scope.map.el == null){
                $scope.map.el = new google.maps.Map(document.getElementById('map'), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 15
                });    
            }
        
            if($scope.map.marker == null){
                $scope.map.marker = new google.maps.Marker({
                    position: new google.maps.LatLng($scope.address.lat, $scope.address.lng),
                    draggable:true,
                });
                $scope.map.marker.addListener('dragend',function(event) {
                    
                    var latM = event.latLng.lat(),
                        lonM = event.latLng.lng();

                    $http.get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBWEiz4_ES0zYe8v5dJ7YV1YhBHt32Zsk4&latlng=' + latM +','+ lonM)
                        .success(function(response) {
                            if (response.status === 'OK') {
                                $scope.map.address = response.results[0];
                                $scope.map.addressFormatted = response.results[0].formatted_address;
                                
                                var deliverylat = typeof $scope.map.address.geometry.location.lat == 'function' ? $scope.map.address.geometry.location.lat() : $scope.map.address.geometry.location.lat;
                                var deliverylng = typeof $scope.map.address.geometry.location.lng == 'function' ? $scope.map.address.geometry.location.lng() : $scope.map.address.geometry.location.lng;
                                
                                $scope.map.el.setCenter(new google.maps.LatLng(deliverylat, deliverylng));

                                $timeout(function(){
                                    google.maps.event.trigger($scope.map.el,'resize');
                                },200);
                            }
                        })
                        .error(function(err) {
                            console.log(err);
                        });
                }); 
                $scope.map.marker.setMap($scope.map.el);
            }else{
                $scope.map.marker.setPosition(new google.maps.LatLng( $scope.address.lat, $scope.address.lng ));
            }
            $scope.map.el.setCenter(new google.maps.LatLng($scope.address.lat, $scope.address.lng));

            var tmp = {
                formatted_address : $scope.dataInput.address,
                geometry:{
                    location:{
                        lat:$scope.address.lat,
                        lng:$scope.address.lng
                    }
                }
            };
            $scope.map.address = tmp;
            
            $timeout(function(){
                google.maps.event.trigger($scope.map.el,'resize');
                $scope.map.el.setCenter(new google.maps.LatLng($scope.address.lat, $scope.address.lng));
            },1000);
        //},300);
    }


    //============FUNCTION============
    $scope.startAutocomplete = function(){
        if($scope.map.timeout != null){
            $timeout.cancel($scope.map.timeout);
            $scope.map.timeout = null;
        }

        $scope.map.mapTab = false;
        $scope.map.loading = true;
        
        $scope.map.timeout = $timeout(function(){
            var data = {
                input:$scope.map.addressFormatted,
            };
            var jsonData = CRYPTO.encrypt(data);

            var url = 'http://'+$location.$$host+'/controlpanel/requestAddress.php';
            if(usingDevelopment)
                url = serverDevelopment+"/controlpanel/requestAddress.php";

            $http({method: 'POST',url:url, data:{'data':jsonData},  
                headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
            {
                respone = CRYPTO.decrypt(respone.data);
                
                if(respone.status.toLowerCase() == "ok"){
                    $scope.map.list = respone.predictions;
                    $scope.map.mapTab = false;
                    $scope.map.loading = false;
                }else if(respone.status.toLowerCase() == "zero_results"){
                    $scope.map.list = respone.predictions;
                    $scope.map.mapTab = false;
                    $scope.map.loading = false;
                }else{
                    console.log(respone);
                }

                $scope.map.timeout = null;
                
            }).error(function (respone, status, headers, config){
                alert('Error request address : '+status);
                $scope.map.timeout = null;
            });
        },500);
    }

    $scope.chooseAddress = function(data){
        //$scope.mapData.address = data;
        //$scope.mapData.addressFormatted = data.description;

        var data = {
            placeid:data.place_id,
        };
        var jsonData = CRYPTO.encrypt(data);
        var lat =0;
        var lng=0;

        var url = 'http://'+$location.$$host+'/controlpanel/requestAddressDetail.php';
        if(usingDevelopment)
            url = serverDevelopment+"/controlpanel/requestAddressDetail.php";

        $http({method: 'POST',url:url, data:{'data':jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
            
            if(respone.status.toLowerCase()=="ok"){
                //console.log(respone);
                $scope.map.address = respone.result;
                $scope.map.addressFormatted = respone.result.formatted_address;
                $scope.map.mapTab = true;

                 lat = respone.result.geometry.location.lat;
                 lng = respone.result.geometry.location.lng;

                 $scope.map.lat = lat;
                 $scope.map.lng = lng;

                 if($scope.map.marker == null){
                    $scope.map.marker = new google.maps.Marker({
                        position: new google.maps.LatLng(lat, lng),
                        draggable:true,
                    });
                    $scope.map.marker.addListener('dragend',function(event) {
                        
                        var latM = event.latLng.lat(),
                            lonM = event.latLng.lng();
                        //console.log("lat : "+latM+" | lng : "+ lonM);

                        $http.get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBWEiz4_ES0zYe8v5dJ7YV1YhBHt32Zsk4&latlng=' + latM +','+ lonM)
                            .success(function(response) {
                                if (response.status === 'OK') {
                                    $scope.map.address = response.results[0];
                                    $scope.map.addressFormatted = response.results[0].formatted_address;
                                    
                                    var deliverylat = typeof $scope.map.address.geometry.location.lat == 'function' ? $scope.mapData.address.geometry.location.lat() : $scope.mapData.address.geometry.location.lat;
                                    var deliverylng = typeof $scope.map.address.geometry.location.lng == 'function' ? $scope.mapData.address.geometry.location.lng() : $scope.mapData.address.geometry.location.lng;

                                    //console.log("lat : "+deliverylat+" | lng : "+ deliverylng);
                                    
                                    $scope.map.el.setCenter(new google.maps.LatLng(deliverylat, deliverylng));

                                    $timeout(function(){
                                        google.maps.event.trigger($scope.map.el,'resize');
                                    },200);
                                }
                            })
                            .error(function(err) {
                                console.log(err);
                            });
                    }); 
                    $scope.map.marker.setMap($scope.map.el);
                    
                 }else{
                    $scope.map.marker.setPosition(new google.maps.LatLng( lat, lng ));
                 }
                $scope.map.el.setCenter(new google.maps.LatLng(lat, lng));
                // To add the marker to the map, call setMap();
                
                $timeout(function(){
                    google.maps.event.trigger($scope.map.el,'resize');
                },500);

            }else{
                alert('Got No Result from google');
            }
            
        }).error(function (respone, status, headers, config){
            alert('Error on request address detail');
            $scope.map.mapTab = true;
        });

    }

    $scope.doPickAddress = function(){
        //console.log('do pickup');
        //console.log($scope.map);

        if($scope.map.addressFormatted == ""){
            alert('Please input address');
            return false;
        }
        
        var data = {
            address:$scope.map.addressFormatted,
            lat:$scope.map.address.geometry.location.lat,
            lng:$scope.map.address.geometry.location.lng,
        };
        $uibModalInstance.close(data);
    }

    /*$scope.ok = function () {    
        $uibModalInstance.close(null); //close return something
    };*/

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //$scope.init();
}]);
