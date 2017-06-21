export interface ISearchClient {
    getSearchResults(query: string): Promise<ISearchResults>;
}

export interface ISearchQuery {
    BuildQuery() : string;
}

export interface ISearchResults {
    data: ISearchResult[];
}

export interface ISearchResult {
    items: ISearchResultItem[];
    totalItems: number;
    type: string;
}

export interface ISearchResultItem {
    fields: ISearchResultField[];
}

export interface ISearchResultField {
    name: string;
    value: any;
}

export interface ISearchRefiners {
    refiners: ISearchRefiner[];
}

export interface ISearchRefiner {
    refinerItems: ISearchRefinerItem[];
    propertyName: string;
}

export interface ISearchRefinerItem {
    name: string;
    value: string;
    count: number;
}