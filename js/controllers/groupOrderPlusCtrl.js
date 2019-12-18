angular.module('app')
.controller('groupOrderPlusCtrl', ['$state', '$scope', '$timeout', '$interval', '$http', '$uibModal', '$q', '$rootScope', function($state, $scope, $timeout, $interval, $http, $uibModal, $q, $rootScope){

    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.list = [];
    $scope.partnerList = [];
    $scope.shiftList = [];
    $scope.itemList = [];
    $scope.data = {
        selectedOption:{},
        selectedItem:{},
        selectedShift:{}   
    }
    $scope.pickupLat =0;
    $scope.pickupLng = 0;
    $scope.request ={};
    
    /*----------*//*-----SETTING-----*//*----------*/    
    $scope.gridOptions = {
        data : [],
        onRegisterApi :function(gridApi){
            $scope.gridApi = gridApi;
        },
        enableSorting: true,
        enableGridMenu: true,
        enableFiltering: false,
        enableColumnResizing: true,
        columnDefs:[
            { field: 'zoomorderid', displayName : 'Order Number', width:100  },
            { field: 'name', displayName : 'Reciever', width:200  },
            { field: 'partnername', displayName : 'Vendor', width:200  },
            { field: 'pickup', displayName : 'Pickup Address'  },
            { field: 'address', displayName : 'Drop off Address'  },
            { field: 'groupid', displayName : 'groupid'  },
			{ field: 'sortid', displayName : 'sortid'  }
			//{ name: 'actions', enableFiltering:false, field:'chk', width:80, pinnedRight:true, cellClass: 'grid-align', cellTemplate:'<input type="checkbox" ng-model="row.entity.chk">'}
        ],
    };

    /*----------*//*-----FUNCTION-----*//*----------*/
    $scope.getUnGroupOrder= function(){
		if ( $scope.data.selectedOption.partnerid.length>0 )
		{
			var data = {
				partnerid:$scope.data.selectedOption.partnerid,
				shiftid:$scope.data.selectedShift.shiftid ,
				itemid:$scope.data.selectedItem.sizeid
			};
			$scope.request.itemid=data.itemid;
			var jsonData = CRYPTO.encrypt(data);

			$http({method: 'POST',url:'http://18.141.18.7/controlpanel/getNoGroupOrderShift.php', data:{'data':jsonData},  
					headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
			{
				respone = CRYPTO.decrypt(respone.data);
				$scope.gridOptions.data = respone.result;
				$scope.pickupLat=respone.pickup_lat;
				$scope.pickupLng=respone.pickup_lng;
			})
			.error(function (respone, status, headers, config){
				alert('Unable to get order list ' );
			});
		} 
		else
		{
			alert ("Please choose vendor first");
		}
	};
	
	$scope.getShortest = function( data, source_lat, source_lng)
	{
		var temp =data;
		var retVal={};
		retVal.index=-1;
		retVal.distance=0;
		for(var i=0;i<temp.length;i++)
		{
			if( temp[i].groupid.length==0 )
			{
				temp[i].distance = $scope.calcuateDistance(source_lat, source_lng, temp[i].lat, temp[i].lng);
				if( retVal.index==-1)
				{
					retVal.index=i;
					retVal.distance=temp[i].distance;
				} else 
				{
					if( temp[i].distance < retVal.distance )
					{
						retVal.index=i;
						retVal.distance=temp[i].distance;
					}
				}
			}
		}
		return retVal;
	};
	
	$scope.AutoGroup = function()
	{
		if( $scope.gridOptions.data.length>0 )
		{
			var tempData = $scope.gridOptions.data;
			var maxItems = 5;
			var source_lat = $scope.pickupLat;
			var source_lng = $scope.pickupLng;
			var ret={};
			var groupid="";
			var countOrder=1;
			var maxDistance=20;
			//console.log ("item : "+$scope.request.itemid);
			if( $scope.request.itemid == 'S' )
			{
				maxItems = 5;
			} else if ( $scope.request.itemid == 'M' )
			{
				maxItems = 3;
			} else
			{
				maxItems = 1;
			}
			for(var cnt=0 ; cnt < tempData.length ; cnt++)
			{
				ret = $scope.getShortest(tempData,source_lat,source_lng);
				//console.log("> "+cnt+" | "+ret.index+" |"+ ret.distance);
				if( groupid.length==0 )
				{
					groupid=tempData[ret.index].zoomorderid;
					//console.log("* > "+cnt+" | "+ret.index+" |"+ tempData[ret.index].zoomorderid);
				} 
				tempData[ret.index].groupid = groupid;
				tempData[ret.index].sortid = countOrder;
				source_lat=tempData[ret.index].lat;
				source_lng=tempData[ret.index].lng;
				countOrder++;
				if( countOrder>maxItems)
				{
					//console.log("_ > "+cnt+" | "+ret.index+" |"+ tempData[ret.index].zoomorderid);
					groupid='';
					countOrder=1;
					source_lat=$scope.pickupLat;
					source_lng=$scope.pickupLng;
				} else if( (ret.distance*10000)>maxDistance )
				{
					 console.log("**"+(ret.distance*1000)+" : "+ maxDistance);
					// ----- disable max distance -----
					 groupid='';
					 countOrder=1;
					 source_lat=$scope.pickupLat;
					 source_lng=$scope.pickupLng;
				}
			}
			$scope.gridOptions.data = tempData;
		}
	};
	
	$scope.deg2rad = function (angle) {
		return (angle * Math.PI / 180);
	};
	
	$scope.calcuateDistance = function(FromLat, FromLng, ToLat, ToLng)
	{
		var dist =0;
		var theta = FromLng - ToLng;
		dist = Math.sin($scope.deg2rad(FromLat)) * Math.sin($scope.deg2rad(ToLat)) +  Math.cos($scope.deg2rad(FromLat)) * Math.cos($scope.deg2rad(ToLat)) * Math.cos($scope.deg2rad(theta));
		dist = Math.acos(dist);
		dist = $scope.deg2rad(dist);
		return (dist * 60 * 1.1515 * 1.609344);
	};

    $scope.getPartners = function(){
        $http.get('http://18.141.18.7/controlpanel/getPartnerNoGroup.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.partnerList = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
    };


    $scope.getList = function(){
        if( $scope.data.partnerid.length>0 )
        {
            var data = {
                partnerid:$scope.data.partnerid
            };
            var jsonData = CRYPTO.encrypt(data);

            $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getNoGroupOrder.php', data:{'data':jsonData},  
                            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
                    {
                respone = CRYPTO.decrypt(respone.data);
                $scope.gridOptions.data = respone.result;
            })
            .error(function (respone, status, headers, config){
                alert('Unable to get order list ' );
            });
        } 
        else
        {
            alert ("Please choose vendor first");
        }
    };

    $scope.groupOrder = function()
    {
        var orders=[];
		for(var i=0 ;i<$scope.gridOptions.data.length;i++)
        {
			var order ={
				zoomorderid:$scope.gridOptions.data[i].zoomorderid,
				groupid:$scope.gridOptions.data[i].groupid,
				sortid:$scope.gridOptions.data[i].sortid
			}
			orders.push(order);
        }
        var data = {
            orders:orders
        };
        var jsonData = CRYPTO.encrypt(data);
        
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/addGroupOrderShift.php', data:{'data':jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
			if(respone.message == "OK"){
				alert('Group Order Success');
				$scope.getUnGroupOrder(); 
			}else{
				alert('Group Order fail.');
			}
            
        }).error(function (respone, status, headers, config){
            alert('Request Failed');
        });
    }
    $scope.getUnGroupPartner= function(){
		
        $http.get('http://18.141.18.7/controlpanel/getPartnerNoGroup.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.partnerList = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get partner list ' );
		});
		
    };
    $scope.getUnGroupShift= function(){
        $http.get('http://18.141.18.7/controlpanel/getShiftNoGroup.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.shiftList = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get Shift list ' );
		});
    };
	$scope.getUnGroupItem= function(){
        $http.get('http://18.141.18.7/controlpanel/getItemNoGroup.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
			$scope.itemList = respone.result;
		})
		.error(function () 
		{
			alert('Unable to get Item list ' );
		});
    };
    
        
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        
        $scope.getUnGroupPartner();

        /*$rootScope.eventInit.push($interval(function(){
            $scope.getList();
        },15000));*/
    };
    $scope.init();
}]);
