angular.module('app')
.controller('homeCtrl', ['$state', '$scope', '$stateParams', '$timeout', '$interval', '$http', '$uibModal', '$rootScope', function($state, $scope, $stateParams, $timeout, $interval, $http, $uibModal, $rootScope){
    
    /*----------*//*-----VARIABLES-----*//*----------*/
    $scope.map = null;
    $scope.zoomer = {
        list:null,
        marker:[],
        current:'',
        currentData:{},
        orderData:{}
    }
    $scope.default= {
        image : 'images/pp-default.jpg',
    }
    $scope.check ={
        available:true,
        offline:true,
        onroad:true,
        notupdate:true,
        freelanceonline:true,
        freelanceonroad:true,
        freelanceoffline:true,
        freelancenotavail:true,
        parttimeonline:true,
        parttimeonroad:true,
        parttimeoffline:true,
        parttimenotavail:true,
    }
    $scope.filter ={
        available:'tick-green.png',
        offline:'tick-green.png',
        onroad:'tick-green.png',
        notupdate:'tick-green.png',
        freelanceonline:'tick-green.png',
        freelanceonroad:'tick-green.png',
        freelanceoffline:'tick-green.png',
        freelancenotavail:'tick-green.png',
        parttimeonline:'tick-green.png',
        parttimeonroad:'tick-green.png',
        parttimeoffline:'tick-green.png',
        parttimenotavail:'tick-green.png',
    }
    $scope.deliveryStatus = {
        ontheway:false,
        pickup:false,
        delivered:false
    }

    /*----------*//*-----EVENTS-----*//*----------*/
    $scope.filterClick = function(index){
        if(index==0) {
            $scope.check.available = !$scope.check.available;
            if($scope.check.available) $scope.filter.available = 'tick-green.png';
            else $scope.filter.available = 'tick-grey.png';
        }
        else if(index==1) {
            $scope.check.offline = !$scope.check.offline;
             if($scope.check.offline) $scope.filter.offline = 'tick-green.png';
            else $scope.filter.offline = 'tick-grey.png';
        }
        else if(index==2){ 
            $scope.check.onroad = !$scope.check.onroad;
            if($scope.check.onroad) $scope.filter.onroad = 'tick-green.png';
            else $scope.filter.onroad = 'tick-grey.png';
        }
        else if(index==3) {
            $scope.check.notupdate = !$scope.check.notupdate;
            if($scope.check.notupdate) $scope.filter.notupdate = 'tick-green.png';
            else $scope.filter.notupdate = 'tick-grey.png';
        }
        else if(index==4) {
            $scope.check.freelanceonline = !$scope.check.freelanceonline;
            if($scope.check.freelanceonline) $scope.filter.freelanceonline = 'tick-green.png';
            else $scope.filter.freelanceonline = 'tick-grey.png';
        }
        else if(index==5) {
            $scope.check.freelanceoffline = !$scope.check.freelanceoffline;
            if($scope.check.freelanceoffline) $scope.filter.freelanceoffline = 'tick-green.png';
            else $scope.filter.freelanceoffline = 'tick-grey.png';
        }
        else if(index==6) {
            $scope.check.freelanceonroad = !$scope.check.freelanceonroad;
            if($scope.check.freelanceonroad) $scope.filter.freelanceonroad = 'tick-green.png';
            else $scope.filter.freelanceonroad = 'tick-grey.png';
        }
        else if(index==7) {
            $scope.check.freelancenotavail = !$scope.check.freelancenotavail;
            if($scope.check.freelancenotavail) $scope.filter.freelancenotavail = 'tick-green.png';
            else $scope.filter.freelancenotavail = 'tick-grey.png';
        }
        else if(index==8) {
            $scope.check.parttimeonline = !$scope.check.parttimeonline;
            if($scope.check.parttimeonline) $scope.filter.parttimeonline = 'tick-green.png';
            else $scope.filter.parttimeonline = 'tick-grey.png';
        }
        else if(index==9) {
            $scope.check.parttimeoffline = !$scope.check.parttimeoffline;
            if($scope.check.parttimeoffline) $scope.filter.parttimeoffline = 'tick-green.png';
            else $scope.filter.parttimeoffline = 'tick-grey.png';
        }
        else if(index==10) {
            $scope.check.parttimeonroad = !$scope.check.parttimeonroad;
            if($scope.check.parttimeonroad) $scope.filter.parttimeonroad = 'tick-green.png';
            else $scope.filter.parttimeonroad = 'tick-grey.png';
        }
        else if(index==11) {
            $scope.check.parttimenotavail = !$scope.check.parttimenotavail;
            if($scope.check.parttimenotavail) $scope.filter.parttimenotavail = 'tick-green.png';
            else $scope.filter.parttimenotavail = 'tick-grey.png';
        }
        $scope.showMarker();
    }
    
    /*----------*//*-----FUNCTIONs-----*//*----------*/
    $scope.mapRefresh = function(){
        $timeout(function(){
            if($scope.map != null)
                google.maps.event.trigger($scope.map,'resize');
        },200);
    }

    $scope.getZoomerList = function()
	{
		$http.get('http://18.141.18.7/controlpanel/getDriver.php')		
		.success(function(respone) 
		{
            respone = CRYPTO.decrypt(respone.data);
            $scope.zoomer.list = respone.records;

			for(var idx=0; idx<respone.records.length; idx++)
			{
                //$scope.zoomer.list[idx].locStatus = "";
                //if(respone.records[idx].timediff > 30 && respone.records[idx].status != "3" ) $scope.zoomer.list[idx].locStatus = "Location Not Updated";

                var isExist = false;
                for(var i=0;i<$scope.zoomer.marker.length;i++){
                    if($scope.zoomer.marker[i].id == respone.records[idx].n_id){
                        $scope.updateZoomerMarker(i, respone.records[idx].n_lat, respone.records[idx].n_lng, respone.records[idx]);
                        isExist = true;
                        break;
                    }
                }
                if(!isExist)
                    $scope.createDriverMarker(idx, respone.records[idx].n_lat, respone.records[idx].n_lng, respone.records[idx]);
			}

            //----validate if zoomer marker should be remove----
            var tmp = [];
            for(var i=0; i<$scope.zoomer.marker.length;i++){
                var exist = false;
                for(var j=0; j<respone.records.length; j++){
                    if($scope.zoomer.marker[i].id == respone.records[j].n_id)
                    {
                        exist = true;
                        break;
                    }
                }
                if(!exist){
                    $scope.zoomer.marker[i].setMap(null);
                    $scope.zoomer.marker[i] = null;   
                }else{
                    tmp.push($scope.zoomer.marker[i]);
                }
            }
            $scope.zoomer.marker = tmp;
            $scope.showMarker();
		})
		.error(function (data) 
		{
			console.log('Failed get driver list');
		});
	}

    $scope.createDriverMarker = function(idx, lat, lng, data)
	{
        var icon = "";
        if(data.drivertypeid == "1" || data.drivertypeid == ""){
            if(data.timediff > 30 && data.status != 3) icon = 'images/bike-purple.png';
            else{
                if(data.status == 1)
                    icon = 'images/bike-blue.png';
                else if(data.status == 4)
                    icon = 'images/bike-green.png';
                else icon = 'images/bike-black.png';
            }    
        }else if(data.drivertypeid == "2"){ //freelance

            if(data.timediff > 30 && data.status != 3) icon = 'images/car-purple.png';
            else{
                if(data.status == 1)
                    icon = 'images/car-blue.png';
                else if(data.status == 4)
                    icon = 'images/car-green.png';
                else icon = 'images/car-black.png';
            }
        }else if(data.drivertypeid == "4"){
            if(data.timediff > 30 && data.status != 3) icon = 'images/van-purple.png';
            else{
                if(data.status == 1)
                    icon = 'images/van-blue.png';
                else if(data.status == 4)
                    icon = 'images/van-green.png';
                else icon = 'images/van-black.png';
            }
        }
        
        var image = {
          url: icon,
          size: new google.maps.Size(35, 35),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 35),
          scale: new google.maps.Point(35, 35),
        };

		$scope.zoomer.marker[idx] = new MarkerWithLabel({
            id: data.n_id,
			position: {lat: parseFloat(lat), lng: parseFloat(lng)},
			icon: image,
            labelContent:data.driverid,
            labelClass:"google-marker-label", 
            labelAnchor:new google.maps.Point(35, 55),
            labelStyle: {opacity: 0.70},
            status : data.status,
            timediff : data.timediff,
            drivertype : data.drivertypeid
			//map:map
		});

        /*if($scope.currentBouncing == data.n_id){
            $scope.zoomer.marker[idx].setAnimation(google.maps.Animation.BOUNCE);
        }*/
        
        //$scope.zoomer.marker[idx].setMap(map);
        $scope.zoomer.marker[idx].addListener('click', function(){
            $scope.zoomer.current = data.n_id;
            $scope.getZoomerData(data.n_id);
            //$scope.toggleBounce(data.n_id);
        });
	}

    $scope.changeDriver = function(){
        $scope.getZoomerData($scope.zoomer.current);
    }

    $scope.updateZoomerMarker = function(i, lat, lng, data){
        var latlng = new google.maps.LatLng(lat, lng);
        $scope.zoomer.marker[i].setPosition(latlng);

        var icon = "";
        if(data.drivertypeid == 1){
            if(data.timediff > 30 && data.status != 3) icon = 'images/bike-purple.png';
            else{
                if(data.status == 1)
                     icon = 'images/bike-blue.png';
                else if(data.status == 4)
                    icon = 'images/bike-green.png';
                else icon = 'images/bike-black.png';
            }    
        }else if(data.drivertypeid == 2){ //freelance

            if(data.timediff > 30 && data.status != 3) icon = 'images/car-purple.png';
            else{
                if(data.status == 1)
                    icon = 'images/car-blue.png';
                else if(data.status == 4)
                    icon = 'images/car-green.png';
                else icon = 'images/car-black.png';
            }
        }else if(data.drivertypeid == 4){
            if(data.timediff > 30 && data.status != 3) icon = 'images/van-purple.png';
            else{
                if(data.status == 1)
                    icon = 'images/van-blue.png';
                else if(data.status == 4)
                    icon = 'images/van-green.png';
                else icon = 'images/van-black.png';
            }
        }
        var image = {
          url: icon,
          size: new google.maps.Size(35, 35),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 35),
          scale: new google.maps.Point(35, 35),
        };
        $scope.zoomer.marker[i].setIcon(image);
    }

    $scope.showMarker = function(){

        for(var i=0;i<$scope.zoomer.marker.length;i++ ){
            var data = $scope.zoomer.marker[i];
            
            if(data.drivertype == "1" || data.drivertype == ""){
                if(data.timediff > 30 && data.status != 3) {
                    if($scope.check.notupdate)
                        $scope.zoomer.marker[i].setMap($scope.map);
                    else
                        $scope.zoomer.marker[i].setMap(null);
                }
                else{
                    if(data.status == 1){
                        if($scope.check.available){
                            $scope.zoomer.marker[i].setMap($scope.map);
                            
                        }
                        else{
                            $scope.zoomer.marker[i].setMap(null);
                        }
                    }
                    else if(data.status == 4)
                    {
                        if($scope.check.onroad){
                            console.log('masuk');
                            $scope.zoomer.marker[i].setMap($scope.map);
                        }
                        else
                            $scope.zoomer.marker[i].setMap(null);
                    }
                    else {
                        if($scope.check.offline)
                            $scope.zoomer.marker[i].setMap($scope.map);
                        else
                            $scope.zoomer.marker[i].setMap(null);
                    }
                }   
            }else if(data.drivertype == "2"){
                if(data.timediff > 30 && data.status != 3) {
                    if($scope.check.freelancenotavail)
                        $scope.zoomer.marker[i].setMap($scope.map);
                    else
                        $scope.zoomer.marker[i].setMap(null);
                }
                else{
                    if(data.status == 1){
                        if($scope.check.freelanceonline){
                            $scope.zoomer.marker[i].setMap($scope.map);
                        }
                        else{
                            $scope.zoomer.marker[i].setMap(null);
                        }
                    }
                    else if(data.status == 4)
                    {
                        if($scope.check.freelanceonroad)
                            $scope.zoomer.marker[i].setMap($scope.map);
                        else
                            $scope.zoomer.marker[i].setMap(null);
                    }
                    else {
                        if($scope.check.freelanceoffline)
                            $scope.zoomer.marker[i].setMap($scope.map);
                        else
                            $scope.zoomer.marker[i].setMap(null);
                    }
                }
            }else if(data.drivertype == "4"){
                if(data.timediff > 30 && data.status != 3) {
                    if($scope.check.parttimenotavail)
                        $scope.zoomer.marker[i].setMap($scope.map);
                    else
                        $scope.zoomer.marker[i].setMap(null);
                }
                else{
                    if(data.status == 1){
                        if($scope.check.parttimeonline){
                            
                            $scope.zoomer.marker[i].setMap($scope.map);
                            
                        }
                        else{
                            $scope.zoomer.marker[i].setMap(null);
                        }
                    }
                    else if(data.status == 4)
                    {
                        if($scope.check.parttimeonroad)
                            $scope.zoomer.marker[i].setMap($scope.map);
                        else
                            $scope.zoomer.marker[i].setMap(null);
                    }
                    else {
                        if($scope.check.parttimeoffline)
                            $scope.zoomer.marker[i].setMap($scope.map);
                        else
                            $scope.zoomer.marker[i].setMap(null);
                    }
                }
            }
                 
            
            
        }
    }
    
    $scope.getZoomerData = function(id){
        var data = {'usr': id};
        var jsonData = CRYPTO.encrypt(data);
        
        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getDriverInfo.php', data:{'data' : jsonData},  
			headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
		{
			respone = CRYPTO.decrypt(respone.data);
            
            $scope.zoomer.currentData = respone;
            if(respone.image == '')
                $scope.zoomer.currentData.image = undefined;
            
            
            if($scope.zoomer.currentData.Active == "I")
                $scope.zoomer.currentData.statusdesc = "Offline";
            else{
                switch($scope.zoomer.currentData.status){
                        case "1" : $scope.zoomer.currentData.statusdesc = "Available"; break;
                        case "3" : $scope.zoomer.currentData.statusdesc = "Offline"; break;
                        case "4" : $scope.zoomer.currentData.statusdesc = "On Road"; break;
                        case "E" : $scope.zoomer.currentData.statusdesc = "Emergency"; break;
                }    
            }
            $scope.deliveryStatus = {
                ontheway:false,
                pickup:false,
                delivered:false
            }
            $scope.zoomer.currentData.statusdesc =$scope.zoomer.currentData.statusdesc.toUpperCase(); 

            $scope.map.setCenter(new google.maps.LatLng($scope.zoomer.currentData.n_lat, $scope.zoomer.currentData.n_lng));

            $http.get('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCiaOuiOBPxGlT6XVKb3i5cimDFuO1UboQ&latlng=' + $scope.zoomer.currentData.n_lat +','+ $scope.zoomer.currentData.n_lng)
            .success(function(response) {
                if (response.status === 'OK') {
                    $scope.zoomer.currentData.position = response.results[0].formatted_address;
                }
            })
            .error(function() {
                console.log('error on get position google maps');
            });
            
            if(respone.zoomorderid != ""){
                data = {'zoomorderid':respone.zoomorderid};
                jsonData = CRYPTO.encrypt(data);
                
                $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getOrderInfo.php', data:{'data' : jsonData},  
                    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
                {
                    respone = CRYPTO.decrypt(respone.data);
                    
                    
                    if(respone.orderStatus == "Available")
                        $scope.deliveryStatus.ontheway = true;
                    else if(respone.orderStatus == "Pickup")
                        $scope.deliveryStatus.pickup = true;
                    else if(respone.orderStatus == "Delivered")
                        $scope.deliveryStatus.delivered = true;
                    
                    $scope.zoomer.orderData = respone;
                    
                }).error(function (respone, status, headers, config) 
                {
                    console.log('error on get order data')
                });
            }else{
                $scope.zoomer.orderData = {};
            }
					
		}).error(function (respone, status, headers, config) 
		{
			console.log('error on get zoomer data')
		});
    }

    $scope.openOrderList = function(id){
        
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'HomeOrderListModal.html',
            controller: 'HomeOrderListModalCtrl',
            size: 'lg',
            resolve: {
                orderId: function () {
                    //return $scope.items;
                    return id;
                }
            },
            scope : $scope
        });

        modalInstance.result.then(function (returnValue) {
            //$scope.selected = selectedItem;
            //alert(returnValue);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

    /*$scope.toggleBounce = function(id) {
        if($scope.currentBouncing != "0")
            for(var i=0, length=$scope.zoomer.marker.length; i<length;i++)
                if($scope.zoomer.marker[i].id == $scope.currentBouncing){
                    $scope.zoomer.marker[i].setAnimation(null);
                    break;
                }
        
        for(var i=0, length=$scope.zoomer.marker.length; i<length;i++)
            if($scope.zoomer.marker[i].id == id){
                $scope.currentBouncing = id;
                $scope.zoomer.marker[i].setAnimation(google.maps.Animation.BOUNCE);
                break;
            }
    }*/

    /*----------*//*-----INITS-----*//*----------*/
    $scope.getMapHeight = function(){   //set height for map 
        return ($scope.screen.height - 210) + 'px';
    }
    
    $scope.getProfileHeight = function(){   //set height for profile container
        return ($scope.screen.height - 20) + 'px';
    }

    $scope.init = function(){
        var mapProperties = {
		  center:new google.maps.LatLng(3.1512150,101.60314),
		  zoom:14,
                  streetViewControl: false,
                //  disableDefaultUI: true,
		  mapTypeId:google.maps.MapTypeId.ROADMAP
		};
		$scope.map = new google.maps.Map(document.getElementById("googleMap"),mapProperties);
        $scope.mapRefresh();    //must refresh so all map loaded. if not the map sometimes just partial loaded

        $scope.getZoomerList();
        /*$interval(function(){
            $scope.getZoomerList();
        },30000);*/
        $rootScope.eventInit.push($interval(function(){
            $scope.getZoomerList();
        },30000));
    }

    $scope.init();
}]);

angular.module('app')
.controller('HomeOrderListModalCtrl', ['$scope', '$uibModalInstance', 'orderId', '$http', function ($scope, $uibModalInstance, orderId, $http) {
    $scope.orderId = orderId;
    $scope.detailOrders = [];

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
            { field: 'pickup_time' , displayName:'Pickup Time', width:90 },
            { field: 'status' , displayName:'Status', width:100 },
        ],
    };
    
    $scope.getDetail = function(){
        var data = {'rootid':$scope.orderId};
        jsonData = CRYPTO.encrypt(data);

        $http({method: 'POST',url:'http://18.141.18.7/controlpanel/getOrderGroupDetail.php', data:{'data' : jsonData},  
            headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},}).success(function (respone, status, headers, config) 
        {
            respone = CRYPTO.decrypt(respone.data);
			for(var i=0, length=respone.result.length;i<length;i++){
				for ( var temp in respone.result[i] )
                {
                        respone.result[i][temp] = decodeURIComponent(respone.result[i][temp]);
                }
			}
            $scope.detailOrders = respone.result;
            $scope.gridDetailOrdersOptions.data = respone.result;
            
        }).error(function (respone, status, headers, config) 
        {
            console.log('error on get order data')
        });
    }
    
    $scope.ok = function () {
        $uibModalInstance.close(''); //close return something
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.getDetail();
}]);
