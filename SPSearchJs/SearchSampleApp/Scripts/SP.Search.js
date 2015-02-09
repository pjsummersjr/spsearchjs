function Query() {
    var self = this;
    self.SPSite = "";
    self.SearchApiPath = "/_api/search/query"

    self.QueryText = "";
    self.SourceId = "";

    self.SortFields = "";
    self.SelectProperties = "";
    self.Properties = "";
    self.GraphQuery = "";

    self.Refiners = "";
    self.RefinementFilters = [];

    self.RankingModelId = "";
    self.StartRow = 0;
    self.RowLimit = 10;

    self.EnableStemming = "true";
    self.EnablePhonetic = "true";
    self.EnableFQL = "false";

    self.EnableQueryRules = "true";

    self.RequestMethod = "GET";
    self.RequestContentType = "application/json;odata=verbose";

    self.BuildQuery = function () {

        var queryExpr = "querytext='" + self.QueryText.trim() + "'";
        queryExpr += "&selectproperties='" + self.SelectProperties + "'";
        queryExpr += "&refiners='" + self.Refiners + "'";

        if (self.SourceId != "") queryExpr += "&sourceid='" + self.SourceId + "'";

        if(self.Properties != "") queryExpr += "&Properties='" + self.Properties + "'";

        if (self.SortFields != null && self.SortFields != "") queryExpr += "&sortlist='" + self.SortFields + "'";

        if (self.RefinementFilters.length > 0) {
            var refinementStr = "&refinementFilters='";
            for (var i = 0; i < self.RefinementFilters.length; i++) {
                if (self.RefinementFilters.length > 1 && i == 0) refinementStr += "and(";
                if (i > 0) refinementStr += ",";
                refinementStr += self.RefinementFilters[i].PropertyName + ":ends-with(\"" + self.RefinementFilters[i].GetDisplayString(self.RefinementFilters[i].FilterValue) + "\")";
            }
            if (self.RefinementFilters.length > 1) refinementStr += ")";
            queryExpr += refinementStr + "'";
        }

        queryExpr += "&startrow=" + self.StartRow;
        queryExpr += "&rowlimit=" + self.RowLimit;
        queryExpr += "&enablefql=" + self.EnableFQL;
        queryExpr += "&enablequeryrules=" + self.EnableQueryRules;
        queryExpr += "&enablephonetic=" + self.EnablePhonetic;
        queryExpr += "&enablestemming=" + self.EnableStemming;

        return queryExpr;
    };

    self.RunSearch = function (successFunc, failureFunc) {
        var queryParamStr = self.BuildQuery();

        var searchUrl = self.SPSite + self.SearchApiPath + "?" + queryParamStr;

        $.ajax({
            url: searchUrl,
            type: self.RequestMethod,
            contentType: self.RequestContentType,
            headers: {
                "Accept": self.RequestContentType,
            },
            success: function (data) {
                var theSearchResults = new SearchResults();
                theSearchResults.RawJson = data;
                theSearchResults.BuildResultObject();
                successFunc(theSearchResults);
            },
            error: function (data, status, error) {
                failureFunc(data);
            }
        });
    };
}

function GQLActions() {
    self.PERSONAL_FEED = "1021";            //Private
    self.MODIFIED = "1003";                 //Public
    self.ORG_COLLEAGUES = "1015";           //Public
    self.ORG_DIRECT = "1014";               //Public
    self.ORG_MANAGER = "1013";              //Public
    self.ORG_SKIP_LEVEL_MANAGER = "1016";   //Public
    self.WORKING_WITH = "1019";             //Private
    self.TRENDING_AROUND = "1020";          //Public
    self.VIEWED = "1001";                   //Private
    self.WORKING_WITH_PUBLIC = "1033";      //Public
}

function SearchResults() {
    var self = this;
    self.RawJson = null;
    self.Refiners = null;
    self.Results = null;
    self.SecondaryResults = null;
    self.ElapsedTime = -1;
    self.TotalHits = -1;

    self.BuildResultObject = function () {
        if (self.RawJson == null) return null;

        self.GetMetaData();
        self.Refiners = self.GetRefiners(self.RawJson);
        self.Results = self.GetResults(self.RawJson);
        self.SecondaryResults = self.GetSecondaryResults(self.RawJson);
    };

    self.GetMetaData = function () {
        self.ElapsedTime = self.RawJson.d.query.ElapsedTime;
        if (self.RawJson.d.query.PrimaryQueryResult != null && self.RawJson.d.query.PrimaryQueryResult.RelevantResults != null) {
            self.TotalHits = self.RawJson.d.query.PrimaryQueryResult.RelevantResults.TotalRows;
        }
    };

    self.GetRefiners = function (resultsJson) {

        var theRefiners = [];
        if (resultsJson.d.query.PrimaryQueryResult == null) return theRefiners;
        var refinersJson = resultsJson.d.query.PrimaryQueryResult.RefinementResults;
        if (refinersJson == null) return theRefiners;

        var theRefinersAsJson = refinersJson.Refiners.results;

        for (var i = 0; i < theRefinersAsJson.length; i++) {
            var currentRefiner = new SearchRefiner(theRefinersAsJson[i].Name, theRefinersAsJson[i].Name);
            for (var j = 0; j < theRefinersAsJson[i].Entries.results.length; j++) {

                var rvAsJson = theRefinersAsJson[i].Entries.results[j];
                //This is to handle the tree structure of managed properties that use MMS
                if (rvAsJson.RefinementName.indexOf("#") >= 0) {
                    if (rvAsJson.RefinementName.indexOf("L0") >= 0) {
                        var refinementValue = new SearchRefinementItem(currentRefiner.PropertyName, rvAsJson.RefinementName, rvAsJson.RefinementValue, rvAsJson.RefinementCount);
                        currentRefiner.RefinementItems.push(refinementValue);
                    }
                }
                else {
                    var refinementValue = new SearchRefinementItem(currentRefiner.PropertyName, rvAsJson.RefinementName, rvAsJson.RefinementValue, rvAsJson.RefinementCount);
                    currentRefiner.RefinementItems.push(refinementValue);
                }
            }

            theRefiners.push(currentRefiner);
        }
        return theRefiners;
    };

    self.GetSecondaryResults = function (resultsJson) {
        if (resultsJson == null) return;

        var theResults = [];

        if (resultsJson.d.query.SecondaryQueryResults.results.length <= 0) return theResults;

        var SecondResults = resultsJson.d.query.SecondaryQueryResults.results[0].RelevantResults;
        theResults = ParseResultsTable(SecondResults);

        return theResults;
    }

    self.GetResults = function (resultsJson) {

        if (resultsJson == null) return;

        var theResults = [];

        if (resultsJson.d.query.PrimaryQueryResult == null) return theResults;

        var RelevantResults = resultsJson.d.query.PrimaryQueryResult.RelevantResults;
        theResults = ParseResultsTable(RelevantResults);

        return theResults;
    };

}

function ParseResultsTable(resultsObj) {
    var theResults = [];

    if (resultsObj == null || resultsObj.Table == null) return theResults;

    var results = resultsObj.Table.Rows.results;
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var fields = result.Cells.results;

        var aSearchResult = new SearchResult(0);
        var fieldJsonStr = '{';
        for (var j = 0; j < fields.length; j++) {
            if (fieldJsonStr.length > 1) fieldJsonStr += ",";

            var theValue = fields[j].Value;
            if (theValue != null) {
                //Replaces line feed and carriage return characters that break the JSON parsing in IE
                theValue = theValue.replace(/[\n\r]/g, '');
            }
            if (theValue != null && theValue.indexOf("[") >= 0) {
                fieldJsonStr += "\"" + fields[j].Key + "\":" + theValue;
            }
            else {
                fieldJsonStr += "\"" + fields[j].Key + "\":\"" + theValue + "\"";
            }
            
        }
        fieldJsonStr += '}';
        aSearchResult.fields = JSON.parse(fieldJsonStr);
        theResults.push(aSearchResult);
    }
    return theResults;
}

function SearchResult(id) {
    var self = this;
    self.fields = [];
}

function SearchRefiner(displayName, propertyName) {
    var self = this;
    self.DisplayName = displayName;
    self.PropertyName = propertyName;
    self.RefinementItems = [];
}

function SearchRefinementItem(propertyName, displayValue, filterValue, count) {

    var self = this;
    self.PropertyName = propertyName;
    self.DisplayValue = displayValue;
    self.FilterValue = filterValue;
    self.Count = count;

    self.GetDisplayString = function (rawDisplayValue) {
        if (rawDisplayValue.split('|').length > 0) {
            return rawDisplayValue.split('|')[rawDisplayValue.split('|').length - 1];
        }

        return rawDisplayValue;
    };

}

