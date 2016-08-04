/*
* Represents an encapsulated Query object in JavaScript
*/

var Query = {
    SPSite : "",
    SearchAPIPath : "/_api/search/query",
    //This is required if using the RequestExecutor for CrossDomain calls
    ScriptBase : "/_layouts/15/",
    QueryText : "",
    SourceId : "",
    SortFields : "",
    SelectProperties : "",
    Properties : "",
    GraphQuery : "",
    Refiners : "",
    RefinementFilters: [],
    RankingModelId: "",
    StartRow: 0,
    RowLimit: 10,
    EnableStemming: "true",
    EnablePhonetic: "true",
    EnableFQL: "false",
    EnableQueryRules: "true",

    RequestMethod: "GET",
    RequestContentType: "application/json;odata=verbose" 
}

function BuildQuery (queryParams) {

        var queryExpr = "querytext='" + queryParams.QueryText.trim() + "'";
        queryExpr += "&selectproperties='" + queryParams.SelectProperties + "'";
        queryExpr += "&refiners='" + queryParams.Refiners + "'";

        if (queryParams.SourceId != "") queryExpr += "&sourceid='" + queryParams.SourceId + "'";

        if (queryParams.Properties != "") queryExpr += "&properties='" + queryParams.Properties + "'";

        if (queryParams.SortFields != null && queryParams.SortFields != "") queryExpr += "&sortlist='" + queryParams.SortFields + "'";

        if (queryParams.RefinementFilters.length > 0) {
            var refinementStr = "&refinementFilters='";
            for (var i = 0; i < queryParams.RefinementFilters.length; i++) {
                if (queryParams.RefinementFilters.length > 1 && i == 0) refinementStr += "and(";
                if (i > 0) refinementStr += ",";
                refinementStr += queryParams.RefinementFilters[i].PropertyName + ":ends-with(\"" + queryParams.RefinementFilters[i].GetDisplayString(RefinementFilters[i].FilterValue) + "\")";
            }
            if (queryParams.RefinementFilters.length > 1) refinementStr += ")";
            queryExpr += refinementStr + "'";
        }

        queryExpr += "&startrow=" + queryParams.StartRow;
        queryExpr += "&rowlimit=" + queryParams.RowLimit;
        queryExpr += "&enablefql=" + queryParams.EnableFQL;
        queryExpr += "&enablequeryrules=" + queryParams.EnableQueryRules;
        queryExpr += "&enablephonetic=" + queryParams.EnablePhonetic;
        queryExpr += "&enablestemming=" + queryParams.EnableStemming;

        return queryExpr;
    }  

exports.SPQuery = Query;
exports.BuildQuery = BuildQuery;