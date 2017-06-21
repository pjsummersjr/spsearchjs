import { ISearchQuery } from "./ISearch";
import { SPRefinementItem } from "./SP.Results";

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

export class SPQuery implements ISearchQuery  {
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

    public BuildQuery (): string {

        let queryExpr = "querytext='" + this.QueryText.trim() + "'";
        queryExpr += "&selectproperties='" + this.SelectProperties + "'";
        queryExpr += "&refiners='" + this.Refiners + "'";

        if (this.SourceId != "") queryExpr += "&sourceid='" + this.SourceId + "'";

        if (this.Properties != "") queryExpr += "&properties='" + this.Properties + "'";

        if (this.SortFields != null && this.SortFields != "") queryExpr += "&sortlist='" + this.SortFields + "'";

        if (this.RefinementFilters.length > 0) {
            var refinementStr = "&refinementFilters='";
            for (var i = 0; i < this.RefinementFilters.length; i++) {
                if (this.RefinementFilters.length > 1 && i == 0) refinementStr += "and(";
                if (i > 0) refinementStr += ",";
                refinementStr += this.RefinementFilters[i].PropertyName + ":ends-with(\"" + this.RefinementFilters[i].GetDisplayString(this.RefinementFilters[i].FilterValue) + "\")";
            }
            if (this.RefinementFilters.length > 1) refinementStr += ")";
            queryExpr += refinementStr + "'";
        }

        queryExpr += "&startrow=" + this.StartRow;
        queryExpr += "&rowlimit=" + this.RowLimit;
        queryExpr += "&enablefql=" + this.EnableFQL;
        queryExpr += "&enablequeryrules=" + this.EnableQueryRules;
        queryExpr += "&enablephonetic=" + this.EnablePhonetic;
        queryExpr += "&enablestemming=" + this.EnableStemming;

        return queryExpr;
    }  
}