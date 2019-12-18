angular.module('app')
.controller('reportSummaryMarketplaceEditCtrl', ['$state', '$scope', '$timeout', '$interval', '$stateParams', '$http', '$uibModal', '$q', '$rootScope', 'uiGridConstants', function($state, $scope, $timeout, $interval, $stateParams, $http, $uibModal, $q, $rootScope, uiGridConstants){
    $scope.data = {
        date:'',
            id_market:'',
            partnername:'',
           zoomer:'',
            totalparcel:'',
           totalparceldelivered:'',
           totalcod:'',
            totalcodneedtocollect:'', 
            totalcancel:'',
           totalrevenue:'',
            revenuecod:''
    };
    $scope.save = function () { 
        //alert('123');
        //var jsonData = CRYPTO.encrypt($scope.data);
       // $scope.data.sensorparamlist = $scope.sensorparamlist;
        $http({
            method: "POST", 
            url: "http://18.141.18.7/controlpanel/editReportMarketPlace.php",
            data: { 'data': $scope.data },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        }).then(function mySuccess(response) {
            console.log(response);
            var data = response.data;
            console.log()
            if (data.status.toLowerCase() == 'ok') {
                alert('Data Saved');
                $state.go('reportSummaryMarketplace');
            } else {
                alert(data.message);
            }
        }, function myError(response) {
            console.log(response);
        });
        }

 
        $scope.getData = function () {
            $scope.gridIsLoading = true;
            $http({
                method: "POST", 
                url:"18.141.18.7/controlpanel/getReportSummaryMarketplace.php",
                data: { 'data': {'id_market' : $scope.data.id_market} },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
            }).then(function mySuccess(response) {
                $scope.gridIsLoading = false;
                //var data = CRYPTO.decrypt(response.data.data);
                var data = response.data;
                if (data.status.toLowerCase() == 'ok') {
            data.records = $scope.urlDecode(data.records);
            data.recordsGS = $scope.urlDecode(data.recordsGS);
            
            $scope.sensorlist = data.recordsGS;
            console.log($scope.sensorlist);
            
                    //$scope.gridOptions.data = data.records;
                    // console.log(data.records);
                    // $scope.data.vcode = data.records[0].vcode;
                    // $scope.data.parameter = data.records[0].parameter;
                    // $scope.data.parameterlimit = data.records[0].parameterlimit;
                    // $scope.data.sensortype = data.records[0].sensortype;
                    // $scope.data.dangervalue = data.records[0].dangervalue;
                    // $scope.data.uom = data.records[0].uom;
                    // $scope.data.remarks = data.records[0].remarks;
                    //$scope.data.street = data.records[0].street;
                } else {
                    alert(data.message);
                }
            }, function myError(response) {
                $scope.gridIsLoading = false;
                console.log(response.status);
            });
        };
    
   
    $scope.cancel = function () {
        $state.go('reportSummaryMarketplace');
    }
    
    
    /*----------*//*-----INITIAL-----*//*----------*/
    $scope.getHeight = function(pembagi){
        var height = $scope.screen.height - 160;
        if(height < 150) height = 150;
        return height; 
    }
    $scope.init = function(){
        console.log($stateParams);

      
        if ($stateParams.data != null) {
            //$stateParams.data.data = $scope.data.msn;
            $scope.data.date = $stateParams.data.data.date,
            $scope.data.id_market = $stateParams.data.data.id_market,
            $scope.data.partnername = $stateParams.data.data.partnername,
            $scope.data.zoomer = $stateParams.data.data.zoomer,
            $scope.data.totalparcel = $stateParams.data.data.totalparcel,
            $scope.data.totalparceldelivered = $stateParams.data.data.totalparceldelivered,
            $scope.data.totalcod = $stateParams.data.data.totalcod,
            $scope.data.totalcodneedtocollect = $stateParams.data.data.totalcodneedtocollect,
            $scope.data.totalcancel = $stateParams.data.data.totalcancel,
            $scope.data.totalrevenue = $stateParams.data.data.totalrevenue,
            $scope.data.revenuecod = $stateParams.data.data.revenuecod
            //console.log($scope.data.date);
            $scope.getData();
         } else {
             $state.go('reportSummaryMarketplaceEdit');
         }
      
    };
    $scope.init();
}]);
