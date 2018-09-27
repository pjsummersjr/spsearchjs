import {
    ISearchResults,
    ISearchResult,
    ISearchResultItem,
    ISearchResultField

} from "./ISearch"



export class SPSearchResult implements ISearchResult {
    items: ISearchResultItem[] = [];
    totalItems = 0;
    type = "Primary";

    public static getSearchResultFromJson(data: any): ISearchResult {
        let searchResult: ISearchResult = new SPSearchResult();
        
        searchResult.totalItems = data.TotalRows;
        console.log(`Processing getSearchResultFromJson`);
        if(data.Table && data.Table.Rows){
            //Process each row (result) in the result set
            data.Table.Rows.results.map((row: any, i: any) => {
                
                searchResult.items.push(
                    //each row contains Cells which contain Key(property name), value and data type
                    SPSearchResultItem.getSearchresultItemFromRow(row)
                );
            });
        }

        return searchResult;
    }
}

export class SPSearchResultItem implements ISearchResultItem {
    fields: ISearchResultField[] = [];

    public static getSearchresultItemFromRow(data: any): ISearchResultItem {
        let searchResultItem = new SPSearchResultItem();
        let jsonResult = "{";
        data.Cells.results.map((cell: any, i: any) =>{
            if(i > 0){
                jsonResult += ",";
            }
            let theValue = "";
            if(cell.Value != null){
                theValue = cell.Value;    
            }   
            jsonResult += "\"" + cell.Key + "\":\"" + theValue.replace(/[\n\r]/g, '') + "\"";                                 
            //searchResultItem.fields.push(
            //    "{\"" + cell.Key + ":\"" + cell.Value + "\"}"
            //);
        })
        jsonResult += "}";
        searchResultItem.fields = JSON.parse(jsonResult);
        return searchResultItem;
    }
}

export class SPSearchResults implements ISearchResults {
    data: ISearchResult[] = [];
    private PrimarySearchResult: ISearchResult;
    private SecondarySearchResult: ISearchResult;

    public static getSearchResultsFromJson(response: any): ISearchResults {
        
        let searchResults = new SPSearchResults();
        if(response.d && response.d.query && response.d.query.PrimaryQueryResult && 
            response.d.query.PrimaryQueryResult.RelevantResults && 
            response.d.query.PrimaryQueryResult.RelevantResults.Table &&
            response.d.query.PrimaryQueryResult.RelevantResults.Table.Rows) 
        {
            console.log('Processing the data payload');
            searchResults.PrimarySearchResult = SPSearchResult.getSearchResultFromJson(response.d.query.PrimaryQueryResult.RelevantResults);
            searchResults.PrimarySearchResult.type = "Primary";    
            searchResults.data.push(searchResults.PrimarySearchResult);
            console.log(`Search result payload processing complete`);
        }
/*
        if(response.SecondaryQueryResult != null && response.SecondaryQueryResult.RelevantResults != null){
            searchResults.SecondarySearchResult = SPSearchResult.getSearchResultFromJson(response.SecondaryQueryResult.RelevantResults);
            searchResults.SecondarySearchResult.type = "Secondary";
            searchResults.data.push(searchResults.SecondarySearchResult);
        }
*/        
        console.log(`Returning the result object`);
        return searchResults;
    }
}

export class SPSearchRefiner {
    DisplayName:string;
    PropertyName:string;
    RefinementItems: SPRefinementItem[];
    
    constructor(displayName: string, propertyName: string) {
        this.DisplayName = displayName;
        this.PropertyName = propertyName;
    }
}

export class SPRefinementItem {
    PropertyName: string;
    DisplayValue: string;
    FilterValue: string;
    Count: number;
    
    constructor(propertyName:string, displayValue:string, filterValue:string, count:number) {
        this.PropertyName = propertyName;
        this.DisplayValue = displayValue;
        this.FilterValue = filterValue;
        this.Count = count;
    }

    public GetDisplayString(rawDisplayValue: string): string {
        if (rawDisplayValue.split('|').length > 0) {
            return rawDisplayValue.split('|')[rawDisplayValue.split('|').length - 1];
        }
        return rawDisplayValue;
    };
}