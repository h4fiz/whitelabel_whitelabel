angular.module('app')
.controller('autoGroupOrderCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', 'uiGridGroupingConstants', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope, uiGridGroupingConstants){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.list = [];
	$scope.enableMerge = false;
	$scope.OptType='1';
	$scope.OptTypeList=[];
    $scope.partnerList = [];
	$scope.groupid='';
	$scope.groupedList = [];
    $scope.data = {
        partnerid:'',
    }
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
		treeRowHeaderAlwaysVisible: false,
        enableSorting: false,
        enableGridMenu: true,
        enableFiltering: true,
        enableColumnResizing: true,
        columnDefs:[
	    { name: '', enableFiltering:false, field:'chk', width:30, pinnedLeft:true, cellClass: 'grid-align', cellTemplate:'<input type="checkbox" ng-model="row.entity.chk">'},
            { field: 'zoomorderid', displayName : 'Order Number', width:100  },
            { field: 'deliveryshift', displayName : 'Delivery Shift', width:100  },
            { field: 'name', displayName : 'Reciever', width:200 , cellTemplate:'<div class="ui-grid-cell-contents ng-scope ng-binding" style="background-color:{{row.entity.bgstatus}}">{{row.entity.name }}</div>' },
            { field: 'partnername', displayName : 'Vendor', width:200 },
            { field: 'pickup', displayName : 'Pickup Address', width:800  },  
			{ field: 'address', displayName : 'Delivery Address', width:800  },  
			{ field: 'postcode', displayName : 'Postcode', width:100  },  
			{ field: 'instruction', displayName :'Instruction' , width:150 },
            { field: 'root', displayName : 'GroupID' , width:100  },
            { field: 'sort', displayName : 'Number', width:80   },
			{ field: 'distance', displayName : 'Distance', width:80   },
			{ field: 'itemsize', displayName : 'Size', width:80   },
			{ field: 'area', displayName : 'Zone', width:250 , visible:false ,  treeAggregationType: uiGridGroupingConstants.aggregation.COUNT,
			  cellTemplate: '<div ng-if="row.treeNode.aggregations[0].rendered>0" class="ui-grid-cell-contents">{{row.entity.area + " (Σ : " + row.treeNode.aggregations[0].rendered +" / "+(row.entity.sumsize/100)+"  )"}}</div>', customTreeAggregationFinalizerFn: function( aggregation ) { aggregation.rendered = aggregation.value+1; } },			
			{ field: 'deliverylat', displayName :'deliverylat', visible:false  , width:100 },
			{ field: 'deliverylng', displayName :'deliverylng', visible:false , width:100 },
			{ field: 'pickuplat', displayName :'pickuplat', visible:false , width:100  },
			{ field: 'pickuplng', displayName :'pickuplng' ,visible:false , width:100 },
			{ field: 'trackingid', displayName:'TrackingID', width:150},
			{ field: 'notes1', displayName:'Note 1', width:150},
			{ field: 'notes2', displayName:'Note 2', width:150},
			{ field: 'notes3', displayName:'Note 3', width:150},
			{ field: 'weight', displayName:'Weight', width:100},
			{ name: 'actions', enableFiltering:false, field:'root', width:200 ,pinnedRight:true, cellClass: 'grid-align', cellTemplate:'<button  ng-show="(row.entity).root==(row.entity).zoomorderid" ng-click="grid.appScope.groupOrder(row.entity)">Group {{(row.entity).root}}</button> &nbsp; <button  ng-show="(row.entity).root==(row.entity).zoomorderid" ng-click="grid.appScope.showLocation(row.entity)">MAP</button>'}
			
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    
    $scope.reload= function(){
        $scope.getList();
    };

    $scope.getList = function(){
        var data = {
                partnerid:$scope.data.partnerid,
				partnertype:$scope.OptType
            };
            var jsonData = CRYPTO.encrypt(data);
			var url='';
			if ( '1'==$scope.OptType || '2'==$scope.OptType || '4'==$scope.OptType) {
				var url = 'http://18.141.18.7/controlpanel/getAutoGroupOrder.php';
				$scope.enableMerge =false;
				$scope.gridOptions.columnDefs[11].visible = false;
			} else {
				url = 'http://18.141.18.7/controlpanel/getCumulative.php';
				$scope.enableMerge =true;
				$scope.gridOptions.columnDefs[11].visible = true;
			}
            $http({method: 'POST',url:url, data:{'data':jsonData},  
				headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
			{
				var zone='';
                respone = CRYPTO.decrypt(respone.data);
				for(var i=0, lengthI=respone.result.length;i<lengthI;i++)
				{
					for ( var temp in respone.result[i] )
					{
							respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
							
					}
					if ( '3'==$scope.OptType ) {
						if( respone.result[i].area!=zone )
						{
								respone.result[i].$$treeLevel = 0;
								zone = respone.result[i].area;
						}else if( respone.result[i].root==respone.result[i].zoomorderid )
						{
								respone.result[i].$$treeLevel = 0;
						}
					}
					respone.result[i].chk=false;
				}
                $scope.gridOptions.data = respone.result;
				$scope.list =respone.result;
				if ( '3'==$scope.OptType ) {
					 $timeout(function(){
						$scope.gridApi.treeBase.expandAllRows();
					},500);					
				}
            })
            .error(function (respone, status, headers, config){
                alert('Unable to get order list ' );
            });
			$scope.getGroupList();
    };

	$scope.showLocation = function(data){		
		var modalInstanceAddress = $uibModal.open({
            animation: true,
            templateUrl: 'MapGroupModal.html',
            controller: 'MapGroupModalCtrl',
            size: 'lg',
            resolve: {
                GroupOrders: function () {
                    return $scope.list;
                },
				activeRow: function () {
                    return data;
                },
            },
            scope: $scope
        });

        modalInstanceAddress.result.then(function (returnValue) {
            
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
		
	}
	$scope.calculateDistance = function( th1,  ph1,  th2,  ph2)
	{
		var R=6371;
		var TO_RAD=(3.1415926536 / 180);
		var dx=0; 
		var dy=0; 
		var dz=0;
		ph1 -= ph2;
		ph1 *= TO_RAD; 
		th1 *= TO_RAD;
		th2 *= TO_RAD;
		dz = Math.sin(th1) - Math.sin(th2);
		dx = Math.cos(ph1) * Math.cos(th1) - Math.cos(th2);
		dy = Math.sin(ph1) * Math.cos(th1);
		return Math.asin(Math.sqrt(dx * dx + dy * dy + dz * dz) / 2) * 2 * R;
	}
	
	$scope.merge = function(data){	
		if ( $scope.groupid!=''){
			if(confirm('Are your sure want to merge selected order(s) with groupid '+ $scope.groupid +' ?')) {	
				var temp=[];
				var partnertid='';
				var pickuplat;
				var pickuplng;
				var shift;
				var errCode=0;
				var cnt_chk =0;
				for(var i=0 ;i<$scope.gridOptions.data.length;i++) {
					if( true==$scope.gridOptions.data[i].chk ) {
						temp.push($scope.gridOptions.data[i]);
						if( partnertid!='' ) {
							
						} else {
							partnertid = $scope.gridOptions.data[i].partnername;
							pickuplat = $scope.gridOptions.data[i].pickuplat;
							pickuplng = $scope.gridOptions.data[i].pickuplng;
							shift = $scope.gridOptions.data[i].deliveryshift;
						}
						cnt_chk++;
					}
				}
				if( cnt_chk<1)
				{
					errCode=1;
				}
					
				if( errCode==0 )
				{
					var sort=1;
					var lastLat=0;
					var lastLng=0;
					var minIdx=0;
					if(temp.length>0) {
						for(var j=0 ;j<temp.length;j++)	{
							 temp[j].sort=0 ;
						}
						
						for(var i=0 ;i<temp.length;i++)	{
							// set distance
							for(var j=0 ;j<temp.length;j++)	{
								if( temp[j].sort==0 ) {
									temp[j].root = $scope.calculateDistance( pickuplat,  pickuplng,  temp[j].deliverylat,  temp[j].deliverylng);
								} else {
									temp[j].root = $scope.calculateDistance( lastLat,  lastLng,  temp[j].deliverylat,  temp[j].deliverylng);
								}
							}
							minIdx=0;
							// find min distance
							for(var j=0 ;j<temp.length;j++)	{
								if( temp[j].sort==0 ) {
									if( temp[j].root < temp[minIdx].root ) {
										minIdx = j;
									}
								}								
							}
							// set delivery number
							if( 0==temp[minIdx].sort ) {
								temp[minIdx].sort = sort;
								sort++;
							}						
						}
						// append to buffer order by sort
						minIdx=1;
						var orders=[];
						while( minIdx<sort){
							for(var j=0 ;j<temp.length;j++)	{
								if( temp[j].sort == minIdx )
								{
									orders.push(temp[j].zoomorderid);
									minIdx++;
									break;
								}
							}
						}
						//alert (JSON.stringify(orders)); 
						// send selected order to server
						var data = {
							orders:orders,
							groupid:$scope.groupid,							
							partnertypeid:$scope.OptType
						};
						var jsonData = CRYPTO.encrypt(data);

						var url = 'http://18.141.18.7/controlpanel/addGroupOrder.php';
						
						$http({method: 'POST',url: url, data:{'data':jsonData},  
						headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
						{
							if(respone.message == "OK"){
								alert('Group Order Success');
								$scope.getList(); 
							}else{
								alert('Group Order fail.');
							}
							
						}).error(function (respone, status, headers, config){
							alert('Request Failed');
						});
					} else {
						alert('No data selected');
					} 
				} else {
					if( errCode==1 )
						alert('Please select the order to merge');
				}	
			}
		} else {
			alert('Please select groupid to merge');
		}
	};			 
	$scope.groupSelected = function(data){	
		if(confirm('Are your sure want to group selected order(s) ?')) {	
			var temp=[];
			var partnertid='';
			var pickuplat;
			var pickuplng;
			var shift;
			var errCode=0;
			for(var i=0 ;i<$scope.gridOptions.data.length;i++) {
				if( true==$scope.gridOptions.data[i].chk ) {
					temp.push($scope.gridOptions.data[i]);
					if( partnertid!='' ) {
						if( '3'!=$scope.OptType )
						{
							if( partnertid != $scope.gridOptions.data[i].partnername ) {
								errCode=1;
								break;
							} else if( pickuplat != $scope.gridOptions.data[i].pickuplat ) {
								errCode=2;
								break;
							} else if( pickuplng != $scope.gridOptions.data[i].pickuplng ) {
								errCode=2;
								break;
							} 
							/* 
							else if( shift != $scope.gridOptions.data[i].deliveryshift ) {
								errCode=3;
								break;
							}
							*/
						}
					} else {
						partnertid = $scope.gridOptions.data[i].partnername;
						pickuplat = $scope.gridOptions.data[i].pickuplat;
						pickuplng = $scope.gridOptions.data[i].pickuplng;
						shift = $scope.gridOptions.data[i].deliveryshift;
					}
				}
			}
			if( errCode==0 )
			{
				var sort=1;
				var lastLat=0;
				var lastLng=0;
				var minIdx=0;
				if(temp.length>0) {
					for(var j=0 ;j<temp.length;j++)	{
						 temp[j].sort=0 ;
					}
					
					for(var i=0 ;i<temp.length;i++)	{
						// set distance
						for(var j=0 ;j<temp.length;j++)	{
							if( temp[j].sort==0 ) {
								temp[j].root = $scope.calculateDistance( pickuplat,  pickuplng,  temp[j].deliverylat,  temp[j].deliverylng);
							} else {
								temp[j].root = $scope.calculateDistance( lastLat,  lastLng,  temp[j].deliverylat,  temp[j].deliverylng);
							}
						}
						minIdx=0;
						// find min distance
						for(var j=0 ;j<temp.length;j++)	{
							if( temp[j].sort==0 ) {
								if( temp[j].root < temp[minIdx].root ) {
									minIdx = j;
								}
							}								
						}
						// set delivery number
						if( 0==temp[minIdx].sort ) {
							temp[minIdx].sort = sort;
							sort++;
						}						
					}
					// append to buffer order by sort
					minIdx=1;
					var orders=[];
					while( minIdx<sort){
						for(var j=0 ;j<temp.length;j++)	{
							if( temp[j].sort == minIdx )
							{
								orders.push(temp[j].zoomorderid);
								minIdx++;
								break;
							}
						}
					}
					//alert (JSON.stringify(orders)); 
					// send selected order to server
					var data = {
						orders:orders,
						partnertypeid:$scope.OptType
					};
					var jsonData = CRYPTO.encrypt(data);

					var url = 'http://18.141.18.7/controlpanel/addGroupOrder.php';
					
					$http({method: 'POST',url: url, data:{'data':jsonData},  
					headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
					{
						if(respone.message == "OK"){
							alert('Group Order Success');
							$scope.getList(); 
						}else{
							alert('Group Order fail.');
						}
						
					}).error(function (respone, status, headers, config){
						alert('Request Failed');
					});
				} else {
					alert('No data selected');
				} 
			} else {
				if( errCode==1 )
					alert('Multiple partner in selected list');
				if( errCode==2 )
					alert('Multiple pickuppoint in selected list');
				if( errCode==3 )
					alert('Multiple delivery shift in selected list');
			}
		}
	};
    $scope.groupOrder = function(data){	
		if(confirm('Are your sure want to group this order ( GroupID '+ data.root +')?')) {	
			var temp=[];		
			var totalorder=0;
			for(var i=0 ;i<$scope.gridOptions.data.length;i++)
			{
				if( $scope.gridOptions.data[i].root==data.root )
				{
					var detail=[];
					detail.push($scope.gridOptions.data[i].zoomorderid);
					detail.push($scope.gridOptions.data[i].sort);
					temp.push(detail);				
					totalorder++;
				}
			}
			var orders=[];
			var urut=1;
			var idx=0;
			while (urut<=totalorder)
			{
				if( temp[idx][1]==urut)
				{
					orders.push(temp[idx][0]);
					idx=0;
					urut++;
					continue;
				}
				idx++;
				if( idx>temp.length)
				{
					break; 
				}
			}
						   
			var data = {
				orders:orders
			};
			var jsonData = CRYPTO.encrypt(data);

			var url = 'http://18.141.18.7/controlpanel/addGroupOrder.php';
			
			$http({method: 'POST',url: url, data:{'data':jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
			{
				if(respone.message == "OK"){
					alert('Group Order Success');
					$scope.getList(); 
				}else{
					alert('Group Order fail.');
				}
				
			}).error(function (respone, status, headers, config){
				alert('Request Failed');
			});
		}
    }
    $scope.selectall = function() {
		
		for(var i=0 ;i<$scope.gridOptions.data.length;i++) {
			$scope.gridOptions.data[i].chk=false;
		}		
		$scope.filteredRows = $scope.gridApi.core.getVisibleRows($scope.gridApi.grid);
		for(var i=0 ;i<$scope.filteredRows.length;i++) {
			$scope.filteredRows[i].entity.chk=true;
		}
	}
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    //$scope.checkUAC(20);
	$scope.getPartnerType= function(){
		var url = 'http://18.141.18.7/controlpanel/getPartnerType.php';		

		$http.get(url)
		.success(function(respone)
		{
			respone = CRYPTO.decrypt(respone.data);
			$scope.OptTypeList= respone.result;
		})
		.error(function ()
		{
			alert('Unable to get Billing list ' );
		});
    };
	$scope.getGroupList= function(){
		var url = 'http://18.141.18.7/controlpanel/getGroupList.php';
		$http.get(url)
		.success(function(respone)
		{
			respone = CRYPTO.decrypt(respone.data);
			$scope.groupedList= respone.result;
		})
		.error(function ()
		{
			alert('Unable to get Billing list ' );
		});
    };
    $scope.init = function(){
		$scope.getPartnerType();
/*		
        var arr = $scope.currentUAC.split(":");
        if($scope.currentUAC == "" || arr[1] != "1"){
            $state.go($scope.defaultPage);
            return;			
        } 			
		*/
    };
    $scope.init();
}]);
angular.module('app')
.controller('MapGroupModalCtrl', ['$scope', '$uibModalInstance', 'GroupOrders','activeRow', '$http', '$uibModal', '$timeout', function ($scope, $uibModalInstance, GroupOrders, activeRow, $http, $uibModal, $timeout) {
    $scope.GroupOrders = GroupOrders;    
	$scope.activeRow = activeRow;    
	//alert (JSON.stringify($scope.GroupOrders[1])); 

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
    };
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;
	directionsDisplay.setMap($scope.map.el);
    //============INITIAL=============
    $scope.init = function(){
		
        //$scope.address.address = $scope.dataInput.address;
        $scope.address.lat = $scope.activeRow.deliverylat;
        $scope.address.lng = $scope.activeRow.deliverylng;
               
        //$timeout(function(){
            if($scope.map.el == null){
                $scope.map.el = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 3.123372, lng: 101.576639},
                zoom: 12
                });    
            }
			
			var poly = new google.maps.Polyline({
			  strokeColor: '#FF0000',
			  strokeOpacity: 1.0,
			  strokeWeight: 3
			});
			poly.setMap($scope.map.el);
			$scope.map.marker = new google.maps.Marker({
				position: new google.maps.LatLng($scope.activeRow.pickuplat, $scope.activeRow.pickuplng),
				label: '(Pickup)',
				draggable: false
			});
			$scope.map.marker.setMap($scope.map.el);	
			var path = poly.getPath();			
			var waypts = [];
			var lastLatLng={};
			for(var i=0 ;i<$scope.GroupOrders.length;i++)
			{
				if( $scope.GroupOrders[i].root==$scope.activeRow.root )
				{
					$scope.map.marker = new google.maps.Marker({
						position: new google.maps.LatLng($scope.GroupOrders[i].deliverylat, $scope.GroupOrders[i].deliverylng),
						label: '('+$scope.GroupOrders[i].sort+')'+ $scope.GroupOrders[i].name,
						draggable: false
					});
					//path.push( new google.maps.LatLng($scope.GroupOrders[i].deliverylat, $scope.GroupOrders[i].deliverylng));
					waypts.push({
						location: new google.maps.LatLng($scope.GroupOrders[i].deliverylat, $scope.GroupOrders[i].deliverylng),
						stopover: true
					  });
					lastLatLng = new google.maps.LatLng($scope.GroupOrders[i].deliverylat, $scope.GroupOrders[i].deliverylng);
					$scope.map.marker.setMap($scope.map.el);
				}
			}
			directionsService.route({
				origin: new google.maps.LatLng($scope.activeRow.pickuplat, $scope.activeRow.pickuplng), 
				destination: lastLatLng,
				waypoints: waypts,
				optimizeWaypoints: true,
				travelMode: 'DRIVING'
			  }, function(response, status) {
				if (status === 'OK') {
				  directionsDisplay.setDirections(response);
				  var route = response.routes[0];
					for (var i = 0; i < route.legs.length; i++) {
						for( var j = 0; j < route.legs[i].steps.length; j++)
							for( var k = 0; k < route.legs[i].steps[j].path.length; k++)
								path.push(route.legs[i].steps[j].path[k]);
				  }
				}
			  });
								  
            $timeout(function(){
                google.maps.event.trigger($scope.map.el,'resize');
                $scope.map.el.setCenter(new google.maps.LatLng($scope.address.lat, $scope.address.lng));
            },1000);
        //},300);
    }
    
 
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    //$scope.init();
}]);
