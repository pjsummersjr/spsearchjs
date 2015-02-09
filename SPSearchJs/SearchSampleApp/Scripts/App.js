'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    var searchQuery = new Query();
    //Get the URI decoded URLs. 
    var hostweburl =
        decodeURIComponent(
            getQueryStringParameter("SPHostUrl")
    );
    var appweburl =
        decodeURIComponent(
            getQueryStringParameter("SPAppWebUrl")
    );
    searchQuery.SPSite = appweburl;
    searchQuery.QueryText = "*";
    searchQuery.Properties = "GraphQuery:ACTOR(ME\\, action\\:1003)";
    var results = null;
    searchQuery.RunSearch(
        RenderResults,
        function (error) {
            $('#results').html("<h2>Error with the query</h2>");
        }
        );

});

function RenderResults(data) {
    if (results.Results == null || results.Results.length <= 0) {
        $('#results').append("<h2>No results found for this query</h2");
    }
    else {
        var htmlStr = "<table>";
        for(var i=0; i < results.Results.length; i++){
            
            for (var j = 0; j < results.Results[i].fields.length; j++) {
                htmlStr += "<tr>";
                for(var key in results.Results[i].fields[j]){
                    htmlStr += "<td>" + key + ": </td><td>" + results.Results[i].fields[j][key] + "</td>";
                }
                htmlStr += "</tr>";
                
            }
        }
        htmlStr += "</table>";
        
        $('#results').append(htmlStr);
    }
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