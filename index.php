<?php
    session_start();
    require_once('menu.php');
    if( $_SESSION['valid']==false || (time()-$_SESSION['timeout'])>1200 || !isset($_SESSION['valid']) || !isset($_SESSION['timeout']) )
      {
            header('Refresh: 0; URL = login.php');
            exit;   
      }
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>ZOOM Control Panel</title>

    <!-- Bootstrap -->
    <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="node_modules/angular-ui-grid/ui-grid.min.css" rel="styleSheet"/>
      
    <link href="css/font-awesome.css" rel="stylesheet">
    <link href="css/font.css" rel="stylesheet">
    <link href="css/styles.css" rel="stylesheet">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script src="node_modules/angular/angular.min.js"></script>
    <script src="plugins/angular-animate-1.5.5.min.js"></script>
    <script src="node_modules/angular-ui-router/release/angular-ui-router.min.js"></script>
    <script src="node_modules/angular-ui-grid/ui-grid.min.js"></script>
    <script src="plugins/ui-bootstrap-tpls-1.3.3.min.js"></script>
      
    <!--<script src="http://maps.googleapis.com/maps/api/js"></script>-->
    <script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDz7sg8zo6HUcVcvXnOIQ0BwYMQ3GAWwbM"></script>
    <script src="js/markerwithlabel.js"></script>
    <script src="js/aes.js"></script>
    <script src="js/aes-ctr.js"></script>
    <script src="js/BigInteger.min.js"></script>
    <script src="js/crypto.js"></script>
    <script type="text/javascript" src="js/ng-file-upload.min.js"></script>
    <script type="text/javascript" src="js/csv.js"></script>
    <script type="text/javascript" src="js/pdfmake.min.js"></script>
    <script type="text/javascript" src="js/vfs_fonts.js"></script> 
    <script type="text/javascript" src="js/qrcode.min.js"></script>
    <script type="text/javascript" src="js/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery-barcode.min.js"></script>
    <script src="js/config.js"></script>
    <script src="js/app.js?v=20190629"></script>
    <script src="js/controllers/appCtrl.js?v=20170906"></script>
    <script src="js/controllers/homeCtrl.js"></script>
    <script src="js/controllers/dashboardCtrl.js"></script>
    <script src="js/controllers/ScanDataHistoryCtrl.js"></script>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['accesslist'] ) { ?>
    <script src="js/controllers/zoomAccessCtrl.js?v=20181008"></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['orderlist'] ) { ?>
    <script src="js/controllers/orderListCtrl.js?v=20180907"></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['orderreservation'] ) { ?>
    <script src="js/controllers/orderReservationCtrl.js?v=20180418" charset="iso-8859-1"></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['preassignment'] ) { ?>
    <script src="js/controllers/preassignmentCtrl.js?v=20180905" ></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['orderondelivery'] ) { ?>
    <script src="js/controllers/orderOnDeliveryCtrl.js?v=20171218"></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['orderhistory'] ) { ?>
    <script src="js/controllers/orderHistoryCtrl.js"></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['ordersla'] ) { ?>
    <script src="js/controllers/orderSLACtrl.js"></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['orderpreschedule'] ) { ?>
    <script src="js/controllers/orderPrescheduleCtrl.js"></script>
<?php } ?>
    <script src="js/controllers/orderDetailCtrl.js"></script>
    <script src="js/controllers/pickupAndDeliveryTimeCtrl.js"></script>
    <script src="js/controllers/suspiciousOrderCtrl.js"></script>
    <script src="js/controllers/orderUnsuccessfulCtrl.js"></script>
    <script src="js/controllers/posLajuUnsuccessfulCtrl.js"></script>
    <script src="js/controllers/orderUnsuccessfulHistoryCtrl.js"></script>
    <script src="js/controllers/orderTrackingCtrl.js"></script> 
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['zoompartner'] ) { ?>
    <script src="js/controllers/zoomPartnerCtrl.js"></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['zoompartnerlogin'] ) { ?>
    <script src="js/controllers/zoomPartnerLoginCtrl.js"></script>
<?php } ?>
    <script src="js/controllers/zoomerListCtrl.js"></script>
    <script src="js/controllers/zoomerFreelanceCtrl.js"></script>
    <script src="js/controllers/zoomerParttimeCtrl.js?v=20190629"></script>                                                      
    <script src="js/controllers/zoomPendingCtrl.js"></script>
    <script src="js/controllers/zoomBroadcastCtrl.js"></script>
    <script src="js/controllers/zoomBroadcastHistoryCtrl.js"></script>
    <script src="js/controllers/paymentListCtrl.js"></script>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['autogrouporder'] ) { ?>
    <script src="js/controllers/groupOrderCtrl.js"></script>
    <script src="js/controllers/autoGroupOrderCtrl.js"></script>
    <script src="js/controllers/groupOrderPlusCtrl.js"></script>
<?php } ?>
    <script src="js/controllers/acceptanceOrder.js"></script>
    <script src="js/controllers/historyacceptance.js"></script>
    <script src="js/controllers/zoomerRatingCtrl.js"></script>
    <script src="js/controllers/zoomerTomorrowAttendanceCtrl.js"></script>
    <script src="js/controllers/zoomitRegistrationListCtrl.js"></script>


    <script src="js/controllers/reportOrderCtrl.js"></script>
    <script src="js/controllers/reportLoginCtrl.js"></script>
    <script src="js/controllers/reportStatusCtrl.js?v20170825"></script>                                                       
    <script src="js/controllers/reportDeliveryZoomerCtrl.js?v20170318"></script>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['reportrevenue'] ) { ?>
    <script src="js/controllers/reportRevenueCtrl.js?v20170318"></script>
<?php } ?>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['reportincentive'] ) { ?>
    <script src="js/controllers/reportInsentiveCtrl.js?"></script>
<?php } ?>
    <script src="js/controllers/report1To3DaysCtrl.js?v20180815"></script>
    <script src="js/controllers/reportSummaryMarketplaceCtrl.js?v=20180906"></script>
    <script src="js/controllers/reportSummaryMarketplaceEditCtrl.js"></script>
<?php   if($_SESSION["zoom_access"] & $MENU_NAV['cod'] ) { ?>
    <script src="js/controllers/codCtrl.js"></script>
<?php } ?>
    <script src="js/controllers/aboutCtrl.js"></script>

    <script src="js/controllers/modalAddBroadcastCtrl.js"></script>
    <!--<script src="js/controllers/distributedIncomeDataListCtrl.js"></script>
    <script src="js/controllers/distributedIncomeDataFormCtrl.js"></script>
    <script src="js/controllers/distributedIncomeOptionListCtrl.js"></script>
    <script src="js/controllers/distributedIncomeOptionFormCtrl.js"></script>
    <script src="js/controllers/individualKYCInputAmendmentListCtrl.js"></script>
    <script src="js/controllers/individualKYCInputAmendmentFormCtrl.js"></script>-->
    <script src="js/controllers/reportOnPercentagePayoutCtrl.js"></script>
    <script src="js/controllers/zoomScanbarcodeCtrl.js"></script>
    <script src="js/controllers/scanDataCtrl.js"></script> 
    <!-- <script src="js/controllers/orderHistoryCtrl.js"></script> -->
  </head>
  <body ng-app="app" ng-controller="appCtrl">
    
    <div ng-include="'templates/header.html'"></div>
    <!--  <div ng-include="'templates/nav.html?v=123'"></div> -->
    <div ng-include="'templates/nav.php'"></div>
    <div ui-view class="container-fluid" ></div>

    <!-- SCRIPT MODAL-->
    <script type="text/ng-template" id="DetailOrderModal.html">
        <div class="modal-header">
            <h3 class="modal-title">Detail Order</h3>
        </div>
        <div class="modal-body">
            <div>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label for="pickupAddress" class="col-sm-2 control-label">Pickup Address</label>
                        <div class="col-sm-10">
                            {{order.pickup_address}}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="pickupDetail" class="col-sm-2 control-label">Pickup Detail</label>
                        <div class="col-sm-10">
                            {{order.pickup_detail}}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="pickupName" class="col-sm-2 control-label">Pickup Name</label>
                        <div class="col-sm-10">
                            {{order.pickup_name}}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="pickupPhone" class="col-sm-2 control-label">Pickup Phone</label>
                        <div class="col-sm-10">
                            {{order.pickup_phone}}
                        </div>
                    </div>
                    <div class="form-group" ng-show="order.status.toLowerCase() == 'available'">
                        <label for="pickupEdit" class="col-sm-2 control-label">&nbsp;</label>
                        <div class="col-sm-10">
                            <button type="button" class="btn btn-success" ng-click="doEditPickup()">Edit Pickup</button>
                        </div>
                    </div>
                </form>
            </div>
            <div id="gridDetailOrders" ui-grid="gridDetailOrdersOptions" class="grid" ui-grid-resize-columns ui-grid-auto-resize ui-grid-pinning style="height:250px;"></div>
        </div>
        <div class="modal-footer">
            <!--<button class="btn btn-primary" type="button" ng-click="ok()">Reassign</button>-->
            <button class="btn btn-warning" type="button" ng-click="cancel()">Close</button>
        </div>
    </script>
    <script type="text/ng-template" id="EditOrderModal.html">
        <div class="modal-header">
            <h3 class="modal-title">Edit Order {{typeEdit}}</h3>
        </div>
        <div class="modal-body">
            <div>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label for="address" class="col-sm-2 control-label">{{typeEdit}} Address</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="address" placeholder="Address" ng-model="input.address" style="width:90%; display:inline;" readonly>&nbsp;<button type="button" ng-click="openMapModal(input)">...</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="addressDetail" class="col-sm-2 control-label">{{typeEdit}} Detail</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="addressDetail" placeholder="Address Detail" ng-model="input.detail">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="addressName" class="col-sm-2 control-label">{{typeEdit}} Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="addressName" placeholder="Name" ng-model="input.name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="addressPhone" class="col-sm-2 control-label">{{typeEdit}} Phone</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="addressPhone" placeholder="Phone" ng-model="input.phone">
                        </div>
                    </div>
                    <div class="form-group" ng-show="typeEdit == 'Delivery'">
                        <label for="cod" class="col-sm-2 control-label">COD Amount</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="cod" placeholder="COD Amount" ng-model="input.cod">
                        </div>
                    </div>
                    <div class="form-group" ng-show="typeEdit == 'Delivery'">
                        <label for="instruction" class="col-sm-2 control-label">Delivery Instruction</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="instruction" placeholder="Delivery Instruction" ng-model="input.instruction">
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" type="button" ng-click="doEdit()">Submit</button>
            <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
        </div>
    </script>
    <script type="text/ng-template" id="MapModal.html">
        <div class="modal-header">
            <h3 class="modal-title">Pick Address</h3>
        </div>
        <div class="modal-body" ng-init="init()">
            <div>
                <div style="width:100%;">
                    <input type="text" class="form-control" ng-model="map.addressFormatted" ng-change="startAutocomplete()">
                </div>
                <div style="width:100%;" ng-show="map.mapTab">
                    <div id="map" style="margin:0px; width:100%; height:400px;"></div>
                </div>
                <div style="width:100%;" ng-show="!map.mapTab">
                    <div ng-repeat="item in map.list" ng-click="chooseAddress(item)" class="requestAddress" ng-show="!map.loading">
                        {{item.description}}
                    </div>
                    <div style="padding:20px; text-align:center;" ng-show="map.loading">
                        <img ng-src="images/loading.gif" style="width:100px; height:100px;">
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" type="button" ng-click="doPickAddress()">Pick Address</button>
            <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
        </div>
    </script>
    </script>
        <script type="text/ng-template" id="MapGroupModal.html">
        <div class="modal-header">
            <h3 class="modal-title">Group Orders</h3>
        </div>
        <div class="modal-body" ng-init="init()">
            <div>
                <div style="width:100%;" ng-show="map.mapTab">
                    <div id="map" style="margin:0px; width:100%; height:400px;"></div>
                </div>               
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button>
        </div>
    </script>
    <script type="text/ng-template" id="BroadcastModal.html">
        <div class="modal-header">
            <h3 class="modal-title">List of Zoomeer</h3>
        </div>
        <div class="modal-body">
            <div>
                <table>
                    <tr>
                        <td style="background-color:#4CAF50;color: white;padding-left:5px;">Timestamp</td>
                        <td style="background-color:#F2f2f2;padding-left:5px;">{{Data.timestamp}}</td>
                        <td style="background-color:#4CAF50;color: white;padding-left:5px;">Date</td>
                        <td style="background-color:#F2f2f2;padding-left:5px;">{{Data.date}}</td>
                    </tr>
                    <tr>
                        <td style="background-color:#4CAF50;color: white;padding-left:5px;">Qty</td>
                        <td style="background-color:#F2f2f2;padding-left:5px;">{{Data.qty}}</td>
                        <td style="background-color:#4CAF50;color: white;padding-left:5px;">Type</td>
                        <td style="background-color:#F2f2f2;padding-left:5px;">{{Data.type}}</td>
                    </tr>
                </table>
                </br>
                <table style="border: 1px solid grey;border-collapse: collapse;padding: 5px;">
                    <tr>
                        <td style="background-color:#4CAF50;color: white;text-align:center;">No</td>
                        <td style="background-color:#4CAF50;color: white;text-align:center;">Zoomer</td>
                        <td style="background-color:#4CAF50;color: white;text-align:center;">Timestamp</td>
                    </tr>
                    <tr ng-repeat="x in zoomers" style="border: 1px solid grey;border-collapse: collapse;padding: 5px;">
                        <td style="border: 1px solid grey;border-collapse: collapse;padding: 5px;">{{x.no}}</td>
                        <td style="border: 1px solid grey;border-collapse: collapse;padding: 5px;">{{x.zoomer}}</td>
                        <td style="border: 1px solid grey;border-collapse: collapse;padding: 5px;">{{x.timestamp}}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="modal-footer">            
            <button class="btn btn-warning" type="button" ng-click="cancel()">Close</button>
        </div>
    </script>
    </script>
    <!-- END SCRIPT MODAL-->

    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <!-- <script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script> -->
  </body>
</html>
