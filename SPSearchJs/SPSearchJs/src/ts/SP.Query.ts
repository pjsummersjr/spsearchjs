import { 
    SPSearchResultSet, 
    SPSearchResults,
    SPSearchResult,
    SPSearchRefiner,
    SPRefinementItem } from "./SP.Results";

export enum GQLActions {
    PERSONAL_FEED = 1021,            //Private
    MODIFIED = 1003,                 //Public
    ORG_COLLEAGUES = 1015,           //Public
    ORG_DIRECT = 1014,               //Public
    ORG_MANAGER = 1013,              //Public
    ORG_SKIP_LEVEL_MANAGER = 1016,   //Public
    WORKING_WITH = 1019,             //Private
    TRENDING_AROUND = 1020,          //Public
    VIEWED = 1001,                   //Private
    WORKING_WITH_PUBLIC = 1033       //Public
}

export class SPQuery {
    SPSite : string = "";
    SearchAPIPath : string = "/_api/search/query";
    ScriptBase : string = "/_layouts/15/";
    QueryText : string = "";
    SourceId : string = "";
    SortFields : string = "";
    SelectProperties : string[] = [];
    Properties : string = "";
    GraphQuery : string = "";
    Refiners : string = "";
    RefinementFilters: SPRefinementItem[] = [];
    RankingModelId: string = "";
    StartRow: number = 0;
    RowLimit: number = 10;
    EnableStemming: boolean = true;
    EnablePhonetic: boolean = true;
    EnableFQL: boolean = false;
    EnableQueryRules: boolean = true;

    RequestMethod: string = "GET";
    RequestContentType: string = "application/json;odata=verbose"; 
    
    constructor(spSite: string){
        this.SPSite = spSite;
    }

    public BuildQuery (queryParams: SPQuery): string {

        let queryExpr = "querytext='" + queryParams.QueryText.trim() + "'";
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

}