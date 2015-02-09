'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

var hostweburl = "";
var appweburl = "";

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {    //Get the URI decoded URLs. 
    hostweburl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
    appweburl = decodeURIComponent(getQueryStringParameter("SPAppWebUrl"));

    RunSearch();
});

function RunSearch() {

    $('#status').html("Running search...");
    var searchQuery = new Query();

    CaptureFormParameters(searchQuery);

    searchQuery.SPSite = appweburl;
    //searchQuery.QueryText = "*";
    //searchQuery.Properties = "GraphQuery:ACTOR(ME\\, action\\:1003)";
    var results = null;
    searchQuery.RunSearch(
        RenderResults,
        function (error) {
            $('#status').html("<h2>Error with the query</h2>");
            $('#results').html("");
        }
   );
}

function CaptureFormParameters(searchQuery) {
    var queryText = $('#querytext').val();

    if (queryText == null || queryText.length <= 0) {
        queryText = "*";
    }
    searchQuery.QueryText = queryText;

    var graphQueryText = $('#graphquerytext').val();

    if (graphQueryText == null) {
        graphQueryText = "";
    }
    searchQuery.Properties += graphQueryText;
}

function RenderResults(data) {
    var primaryrowcountthreshold = 5;
    if (data.Results == null || data.Results.length <= 0) {
        $('#results').append("<h2>No results found for this query</h2");
    }
    else {
        var htmlStr = "";
        for (var i = 0; i < data.Results.length; i++) {

            var docId = data.Results[i].fields["DocId"];
            var docTitle = data.Results[i].fields["Title"];
            htmlStr += "<table id=\"Result_" + docId + "\" class=\"resulttable\"><tr>";
            
            if (docTitle == null || docTitle.length <= 0) {
                docTitle = docId;
            }
            
            htmlStr += "<td class=\"rowheader\" colspan=\"2\">" + docTitle + "<a style=\"margin-left:10px;font-size:12px;\" href=\"javascript:expandProperties('" + docId + "')\">See All Properties</a></td></tr>"
            var rowclass = "primaryrow";
            var counter = 0;
            for (var key in data.Results[i].fields) {
                if (counter > primaryrowcountthreshold) {
                    rowclass = "secondaryrow";
                }
                //This will repeat the docid and/or title even if they're displayed above
                htmlStr += "<tr class=\"" + rowclass + "\">";
                htmlStr += "<td>" + key + ": </td><td>" + data.Results[i].fields[key] + "</td>";
                htmlStr += "</tr>";
                counter++;
            }
            htmlStr += "</table>";
        }
        
        
        $('#results').html(htmlStr);

        $('#status').html("Search completed with " + data.TotalHits + " results returned");
    }
}

function expandProperties(docId) {
    $('#Result_' + docId).find('.secondaryrow').toggle();
}

function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}