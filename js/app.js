
angular.module('app', ['ui.router','ui.bootstrap','ui.grid','ui.grid.resizeColumns','ui.grid.cellNav','ui.grid.autoResize','ngAnimate', 'ngFileUpload','ui.grid.pinning', 'ui.grid.edit', 'ui.grid.treeView', 'ui.grid.grouping', 'ui.grid.exporter', 'ui.grid.selection'])
.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
    .state('app', {
        url: '/',
        abstract: true,
        templateUrl: 'templates/nav.html',
        controller: 'appCtrl'
    })
    .state('home', {
        url: '/home',
        params: {
            dataId:null  
        },
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
    })
    .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
    })
    .state('accesslist', {
        url: '/accesslist',
        templateUrl: 'templates/zoomAccess.html',
        controller: 'zoomAccessCtrl'
    })
    .state('orderlist', {
        url: '/orderlist',
        templateUrl: 'templates/orderList.html',
        controller: 'orderListCtrl'
    })
    .state('orderreservation', {
        url: '/orderreservation',
        templateUrl: 'templates/orderReservation.html',
        controller: 'orderReservationCtrl'
    })
    .state('preassignment', {
        url: '/preassignment',
        templateUrl: 'templates/preassignment.html?v=20180905',
        controller: 'preassignmentCtrl'
    })
    
    .state('orderondelivery', {
        url: '/orderondelivery',
        templateUrl: 'templates/orderOnDelivery.html',
        controller: 'orderOnDeliveryCtrl'
    })
    .state('orderhistory', {
        url: '/orderhistory',
        templateUrl: 'templates/orderHistory.html',
        controller: 'orderHistoryCtrl'
    })
    .state('paymentList', {
        url: '/paymentList',
        templateUrl: 'templates/paymentList.html',
        controller: 'paymentListCtrl'
    })
	.state('acceptanceList', {
        url: '/acceptanceList',
        templateUrl: 'templates/acceptanceorder.html',
        controller: 'acceptanceOrderCtrl'
    })
	.state('historyacceptanceList', {
        url: '/historyacceptanceList',
        templateUrl: 'templates/acceptanceHistory.html',
        controller: 'acceptanceHistoryCtrl'
    })
	.state('ordersla', {
        url: '/ordersla',
        templateUrl: 'templates/orderSLA.html',
        controller: 'orderSLACtrl'
    })
    .state('orderpreschedule', {
        url: '/orderpreschedule',
        templateUrl: 'templates/orderPreschedule.html',
        controller: 'orderPrescheduleCtrl'
    })
	.state('tracking', {
        url: '/tracking',
        templateUrl: 'templates/orderTracking.html',
        controller: 'orderTrackingCtrl'
    })
    /*.state('orderdetail', {
        url: '/orderdetail',
        templateUrl: 'templates/orderDetail.html',
        controller: 'orderDetailCtrl'
    })*/
    .state('pickupanddeliverytime', {
        url: '/pickupanddeliverytime',
        templateUrl: 'templates/pickupAndDeliveryTime.html',
        controller: 'pickupAndDeliveryTimeCtrl'
    })
    .state('zoompartnerpending', {
        url: '/zoompartnerpending',
        templateUrl: 'templates/zoompending.html',
        controller: 'zoomPendingCtrl'
    })
    .state('zoompartner', {
        url: '/zoompartner',
        templateUrl: 'templates/zoomPartner.html',
        controller: 'zoomPartnerCtrl'
    })
    .state('zoompartnerlogin', {
        url: '/zoompartnerlogin',
        templateUrl: 'templates/zoomPartnerLogin.html',
        controller: 'zoomPartnerLoginCtrl'
    })
    .state('zoomerlist', {
        url: '/zoomerlist',
        templateUrl: 'templates/zoomerList.html',
        controller: 'zoomerListCtrl'
    })
	.state('zoomerfreelance', {
        url: '/zoomerfreelance',
        templateUrl: 'templates/zoomerList.html',
        controller: 'zoomerFreelanceCtrl'
    })
	.state('zoomerparttime', {
        url: '/zoomerparttime',
        templateUrl: 'templates/zoomerList.html',
        controller: 'zoomerParttimeCtrl'
    })
	.state('zoombroadcast', {
        url: '/zoombroadcast',
        templateUrl: 'templates/zoomBroadcast.html',
        controller: 'zoomBroadcastCtrl'
    })
    .state('zoombroadcasthistory', {
        url: '/zoombroadcasthistory',
        templateUrl: 'templates/zoomBroadcastHistory.html',
        controller: 'zoomBroadcastHistoryCtrl'
    })
    .state('grouporder', {
        url: '/grouporder',
        templateUrl: 'templates/groupOrder.html',
        controller: 'groupOrderCtrl'
    })	
	.state('autogrouporder', {
        url: '/autogrouporder',
        templateUrl: 'templates/autoGroupOrder.html',
        controller: 'autoGroupOrderCtrl'
    })
    .state('grouporderplus', {
        url: '/grouporderplus',
        templateUrl: 'templates/groupOrderPlus.html',
        controller: 'groupOrderPlusCtrl'
    })
    .state('cod', {
        url: '/cod',
        templateUrl: 'templates/cod.html',
        controller: 'codCtrl'
    })
    .state('reportorder', {
        url: '/reportorder',
        templateUrl: 'templates/reportOrder.html',
        controller: 'reportOrderCtrl'
    })
	.state('reportstatus', {
        url: '/reportstatus',
        templateUrl: 'templates/reportStatus.html',
        controller: 'reportStatusCtrl'
    }) 
    .state('reportlogin', {
        url: '/reportlogin',
        templateUrl: 'templates/reportLogin.html',
        controller: 'reportLoginCtrl'
    })
    .state('reportdeliveryzoomer', {
        url: '/reportdeliveryzoomer',
        templateUrl: 'templates/reportDeliveryZoomer.html',
        controller: 'reportDeliveryZoomerCtrl'
    })
    .state('reportrevenue', {
        url: '/reportrevenue',
        templateUrl: 'templates/reportRevenue.html',
        controller: 'reportRevenueCtrl'
    })
	.state('reportincentive', {
        url: '/reportincentive',
        templateUrl: 'templates/reportInsentive.html',
        controller: 'reportInsentiveCtrl'
    })
    .state('suspiciousorder', {
        url: '/suspiciousorder',
        templateUrl: 'templates/suspiciousOrder.html',
        controller: 'suspiciousOrderCtrl'
    })
    .state('zoomerrating', {
        url: '/zoomerrating',
        templateUrl: 'templates/zoomerRating.html',
        controller: 'zoomerRatingCtrl'
    })
    .state('zoomertomorrowattendance', {
        url: '/zoomertomorrowattendance',
        templateUrl: 'templates/zoomerTomorrowAttendance.html',
        controller: 'zoomerTomorrowAttendanceCtrl'
    })
    .state('orderunsuccessful', {
        url: '/orderunsuccessful',
        templateUrl: 'templates/orderUnsuccessful.html',
        controller: 'orderUnsuccessfulCtrl'
    }).state('posLajuUnsuccessful', {
        url: '/poslajuunsuccessful',
        templateUrl: 'templates/posLajuUnsuccessful.html',
        controller: 'posLajuUnsuccessfulCtrl' 
    })
    .state('orderunsuccessfulhistory', {
        url: '/orderunsuccessfulhistory',
        templateUrl: 'templates/orderUnsuccessfulHistory.html',
        controller: 'orderUnsuccessfulHistoryCtrl'
    })
    .state('zoomitregistrationlist', {
        url: '/zoomitregistrationlist',
        templateUrl: 'templates/zoomitRegistrationList.html',
        controller: 'zoomitRegistrationListCtrl'
    })
    .state('report1to3days', {
        url: '/report1to3days',
        templateUrl: 'templates/report1To3Days.html',
        controller: 'report1To3DaysCtrl'
    })
    .state('reportSummaryMarketplace', {
        url: '/reportSummaryMarketplace',
        templateUrl: 'templates/reportSummaryMarketplace.html',
        controller: 'reportSummaryMarketplaceCtrl'
    }).state('reportSummaryMarketplaceEdit', {
        url: '/reportSummaryMarketplaceEdit',
        templateUrl: 'templates/reportSummaryMarketplaceEdit.html',
        params: {
            data:null
        },
        controller: 'reportSummaryMarketplaceEditCtrl'
    })
    .state('reportOnPercentagePayout', {
        url: '/reportOnPercentagePayout',
        templateUrl: 'templates/reportOnPercentagePayout.html',
        controller: 'reportOnPercentagePayoutCtrl'
    })
    .state('scanbarcode', {
        url: '/scanbarcode',
        templateUrl: 'templates/zoomScanbarcode.html',
        controller: 'zoomScanbarcodeCtrl'
    }) .state('scandata', {
        url: '/scandata',
        templateUrl: 'templates/ScanDataHistory.html',
        controller: 'ScanDataHistoryCtrl'
    });
}]);


// .state('scandata', {
//         url: '/scandata',
//         templateUrl: 'templates/scanData.html',
//         controller: 'scanDataCtrl'
//     });