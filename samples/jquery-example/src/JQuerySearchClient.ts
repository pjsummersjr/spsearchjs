import $ = require('jquery');

import { ISearchClient, ISearchResults, SPSearchResults } from 'spsearchjs';
import { AuthenticationContext } from 'adal-angular';


export class JQuerySearchClient implements ISearchClient {

    private authToken: string;

    
    public constructor(token: string){
        console.log("Initializing the JQuerySearchClient");
        this.authToken = token;
    }

    public getSearchResults(query: string) : Promise<ISearchResults> {
        console.log("Getting search results...");
        return $.ajax({
                        type:'GET',
                        url:query,
                        headers: {
                            'Accept':'application/json',
                            'Authorization':'Bearer ' + this.authToken
                        }
                    })
                    .done((data) => {
                        console.log("Received results, processing");
                        let results : ISearchResults = SPSearchResults.getSearchResultsFromJson(query); 
                        console.log("Returning search results");
                        return results;
                    }
                );
        //return Promise.resolve(null);
    }

}