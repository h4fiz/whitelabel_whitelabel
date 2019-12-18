<?php
session_start();
require_once('../menu.php');	
?>
<div class="web-navcol" ng-class="{'navcol-show':isMenuShow}">
    <ul class="navigation">
        <!-- <li role="presentation" ng-click="toogleMenuCol()"><a ui-sref="home"><img src="images/icon-home.png"></img> Home</a></li> -->
        <li role="presentation" ng-click="toogleMenuCol()"><a><img src="images/icon-home.png"></img> Home</a></li>
        <li role="presentation" ng-click="toogleMenuCol()" class="small" ><a ui-sref="home"><!-- <img src="images/icon-home.png"></img> --> Map</a></li>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="dashboard">Dashboard</a></li>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['orderlist'] ) { ?>
		<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="scanbarcode">Task Assigment</a></li>	
       <!--  <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="orderlist">Order List</a></li>
		<?php 	}  ?> -->
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['orderondelivery'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="orderondelivery">Order on Delivery</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['orderreservation'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="orderreservation">Order Submitted</a></li>
		<?php 	}  ?>
		<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="posLajuUnsuccessful">Order Unsuccesful</a></li>
		<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="scandata">Order Data</a></li>
	
	
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['accesslist'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="accesslist">Access List</a></li>
		<?php 	}  ?>
		
        <!--<li role="presentation" ng-click="toogleMenuCol()"><a ui-sref="about">About</a></li>-->
        <!-- Setting MENU -->
        <li role="presentation" ng-click="toogleMenuCol()"><a><img src="images/icon-setting.png"></img> Setting</a></li>
		<!-- <?php 	if($_SESSION["zoom_access"] & $MENU_NAV['zoompartnerpending'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoompartnerpending">Zoom Pending Partner</a></li>
		<?php 	}  ?> -->
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['zoompartner'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoompartner">Add Partner</a></li>
		<?php 	}  ?>
		
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['zoompartnerlogin'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoompartnerlogin">Edit Partner Login</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['zoomerlist'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoomerlist">Add/Edit Delivery Agent</a></li>
		<?php 	}  ?>
		<!-- <?php 	if($_SESSION["zoom_access"] & $MENU_NAV['zoomerparttime'] ) { ?>
	<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoomerparttime">Zoomer Part-Timer</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['zoomerfreelance'] ) { ?>
	<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoomerfreelance">Zoomer Freelancer</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['zoomerrating'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoomerrating">Zoomer Rating</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['zoomertomorrowattendance'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoomertomorrowattendance">Zoomer Attendance</a></li>
		<?php 	}  ?> -->
        <!--<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoombroadcast">Zoomer Pre-booking</a></li>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="zoombroadcasthistory">Zoomer Pre-booking History</a></li>-->
        <!-- Report MENU -->
        <li role="presentation" ng-click="toogleMenuCol()"><a><img src="images/icon-report.png"></img> Report</a></li>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['reportorder'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="reportorder">Order Report</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['reportstatus'] ) { ?>
	<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="reportstatus">Partner Summary Report</a></li>
		<?php 	}  ?>
		<!-- <?php 	if($_SESSION["zoom_access"] & $MENU_NAV['report1to3days'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="report1to3days">1-3 Days Summary Report</a></li>		
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['reportSummaryMarketplace'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="reportSummaryMarketplace">Marketplace Summary Report</a></li>       																															
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['reportlogin'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="reportlogin">Zoomer Login Report</a></li>
		<?php 	}  ?> -->
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['reportdeliveryzoomer'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="reportdeliveryzoomer">Delivery agent / Day Report</a></li>
		<?php 	}  ?>
		<!-- <?php 	if($_SESSION["zoom_access"] & $MENU_NAV['reportrevenue'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="reportrevenue">Zoomer Revenue Report</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['reportincentive'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="reportincentive">Zoomer Incentive Report</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['acceptanceList'] ) { ?>
	<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="acceptanceList">Consignment Consolidation</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['historyacceptanceList'] ) { ?>
	<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="historyacceptanceList">Consignment Consolidation History</a></li>
		<?php 	}  ?>
		<?php 	if($_SESSION["zoom_access"] & $MENU_NAV['historyacceptanceList'] ) { ?>
	<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="reportOnPercentagePayout">Broadcast Percentage Payout Report</a></li>
		<?php 	}  ?> -->
		 
        <!-- Report MENU -->
		<!-- <?php 	if($_SESSION["zoom_access"] & $MENU_NAV['cod'] ) { ?>
        <li role="presentation" ng-click="toogleMenuCol()"><a ui-sref="cod"><img src="images/icon-cod.png"></img> C.O.D</a></li>
		<?php 	}  ?>
		
		<li role="presentation" ng-click="toogleMenuCol()"><a ui-sref="scanbarcode"><img src="images/icon-barcode.png"></img> Zoom Barcode</a></li>
		
		
		<li role="presentation" ng-click="toogleMenuCol()" class="small"><a ui-sref="posLajuUnsuccessful">POSLAJU Unsuccessful</a></li> -->
        <!-- Report MENU -->
        <li role="presentation" ng-click="toogleMenuCol()"><a href="logout.php"><img src="images/icon-logout.png"></img> Logout</a></li>
    </ul>
    <!--<hr class="separator-navigation"/>
    <ul class="navigation">
      <li role="presentation" ng-click="toogleMenuCol()"><a ui-sref="home">Logout</a></li>
    </ul>-->
</div>
<div class="overlay" ng-show="isMenuShow" ng-click="toogleMenuCol()"></div>


