var args = arguments[0] || {};

// a list of all available accounts
var accountsCollection = args.accounts || false;
// the currently selected account
var accountModel       = accountsCollection.first();
// the currently selected website
var siteModel          = null;
// A list of all available reports
var reportsCollection  = Alloy.createCollection('piwikReports');
// the currently selected report
var reportModel        = null;
// the fetched statistics that belongs to the currently selected report
var statisticsModel    = Alloy.createModel('piwikProcessedReport');

var currentMetric = null;
var flatten       = 0;

function doChooseAccount()
{
    var accounts = Alloy.createController('accounts', {accounts: accountsCollection});
    accounts.on('accountChosen', onAccountChosen);
    accounts.open();
}

function onReportListFetched(reportsCollection)
{
    if (!reportModel || !reportsCollection.containsAction(reportModel)) {
	// request statistics using same report if website supports this report
	reportModel = reportsCollection.getEntryReport();
    }

    refresh();

    if (OS_IOS && require('alloy').isTablet) {
	reportList.updateReports(reportsCollection, siteModel);
    }
}

function onWebsiteChosen(site)
{
    siteModel = site;
    $.index.setTitle(siteModel.getName());

    reportsCollection.fetch({
	account: accountModel,
	params: {idSites: siteModel.id},
	success : onReportListFetched,
	error : function(model, resp) {
	    // TODO what should we do in this case?
	    statisticsModel.trigger('error', {type: 'loadingReportList'});
	}
    });
}

function onAccountChosen(account)
{
    accountModel            = account;
    var entrySiteCollection = Alloy.createCollection('piwikWebsites');
    entrySiteCollection.fetch({
	params: {limit: 1},
	account: accountModel,
	success: function (entrySiteCollection) {
	    onWebsiteChosen(entrySiteCollection.getEntrySite());
	}
    });
}

var reportRowsCtrl = null;
function onStatisticsFetched(processedReportModel)
{
    showReportContent();

    $.reportGraphCtrl.update(processedReportModel, accountModel);

    if (reportRowsCtrl) {
	$.reportRowsContainer.remove(reportRowsCtrl.getView());
    }

    reportRowsCtrl = Alloy.createController('reportrows', {report: processedReportModel});
    $.reportRowsContainer.add(reportRowsCtrl.getView());
}

function showReportContent()
{
    $.loading.hide();
    $.content.show();
}

function showLoadingMessage()
{
    $.loading.show();
    $.content.hide();
}

function refresh() {

    showLoadingMessage();

    var module = "MultiSites"
    var action = "getAll";
    var metric = reportModel.getSortOrder("nb_visits");

    statisticsModel.setSortOrder(metric);

    statisticsModel.fetch({
	account: accountModel,
	params: {
	    period: 'day',
	    date: 'today',
	    idSite: siteModel.id,
	    sortOrderColumn: metric,
	    filter_sort_column: metric,
	    apiModule: module,
	    apiAction: action
	},
	error: function () {
	    statisticsModel.trigger('error', {type: 'loadingProcessedReport'});
	},
	success: onStatisticsFetched
    });
}

statisticsModel.on('error', function () {
    // TODO what should we do in this case?
    showReportContent();
});

exports.open = function () {
    onAccountChosen(accountModel);
    $.index.open();
};