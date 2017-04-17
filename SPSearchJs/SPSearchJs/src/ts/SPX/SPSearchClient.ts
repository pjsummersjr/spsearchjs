import { ISearchResults,
        ISearchClient } from '../ISearch';

import { SPSearchResults } from '../SP.Results';

import {
    SPHttpClient,
    SPHttpClientResponse,
    ODataVersion 
} from '@microsoft/sp-http';

import { IWebPartContext } from '@microsoft/sp-webpart-base';

export class SPSearchClient implements ISearchClient {

    public httpClient: SPHttpClient;

    constructor(context: IWebPartContext) {
        this.httpClient = context.spHttpClient;
    }

    public getSearchResults(): Promise<ISearchResults> {
        let req : string = "https://paulsummfy17.sharepoint.com/_api/search/query?querytext='*+AND+(contentclass:STS_Web+OR+contentclass:+STS_Site)+-Path:\"https:%2f%2fmicrosoft-my.sharepoint.com%2f*\"'&sortlist='lastmodifiedtime:descending'";

        return this.httpClient.get(req, SPHttpClient.configurations.v1.overrideWith({
            defaultODataVersion: ODataVersion.v3
        }))
        .then((response: SPHttpClientResponse) => {
            return response.json().then((jsonObj) => 
            {
                return SPSearchResults.getSearchResultsFromJson(jsonObj)
            });
        });
    } 

}
