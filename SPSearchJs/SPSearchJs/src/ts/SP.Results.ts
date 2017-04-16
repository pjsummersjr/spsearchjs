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

export class SPSearchResults {
    TotalItems: number;
    ResponseTime: number;
    ResultItems: SPSearchResult[];
    Refiners: SPSearchRefiner[];
}

export class SPSearchResult {
    ResultFields: SPSearchResultField[];
}

export class SPSearchResultField {
    FieldName: string;
    FieldValue: any;
}

export class SPSearchResultSet {
    TotalResponseTime: number;
    PrimaryResults: SPSearchResults;
    SecondaryResults: SPSearchResults;

    public static ProcessResults(rawData: JSON): SPSearchResultSet {

        if(rawData == null) { return null; }

        let finalResults = new SPSearchResultSet();

        if(rawData['ElapsedTime'] != null) {
            finalResults.TotalResponseTime = rawData['ElapsedTime'];

            if(rawData['PrimaryQueryResult'] != null){
                
                finalResults.PrimaryResults = new SPSearchResults();
                if(rawData['RelevantResults'] != null){
                    finalResults.PrimaryResults.TotalItems = rawData['RelevantResults']['TotalRows'];
                    finalResults.PrimaryResults.ResultItems = 
                    this._processResultTable(rawData['RelevantResults']['Table']['Rows'])
                    
                }
            }

        }

        return null;
    }

    protected static _processResultTable(resultTable: JSON): SPSearchResult[] {
        let results: SPSearchResult[];
        return results;
    }


}