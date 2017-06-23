import $ = require('jquery');

import { ISearchClient, ISearchResults, SPSearchResults } from 'spsearchjs';
import { AuthenticationContext } from 'adal-angular';


export class JQuerySearchClient implements ISearchClient {

    //private authCtx: AuthenticationContext;

    //public constructor(adalCtx: AuthenticationContext){
    public constructor(){
        console.log("Initializing the JQuerySearchClient");

        //this.authCtx = adalCtx;
    }

    public getSearchResults(query: string) : Promise<ISearchResults> {
        return $.get(query).done((data) => {
            let results : ISearchResults = SPSearchResults.getSearchResultsFromJson(query); 
            return results;
        });
        //return Promise.resolve(null);
    }

}