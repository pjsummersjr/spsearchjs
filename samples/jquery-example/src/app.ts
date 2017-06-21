import $ = require('jquery');

//https://medium.com/@OCombe/how-to-publish-a-library-for-angular-2-on-npm-5f48cdabf435

import { JQuerySearchClient } from './JQuerySearchClient';
import { ISearchClient, ISearchQuery } from 'spsearchjs';
import { SPQuery } from 'spsearchjs';

const SPSite = "https://mtcecbos3.sharepoint.com/";

export class JQuerySearchApp {

    private searchClient: ISearchClient = new JQuerySearchClient();
    

    public init():void {
        $('#searchButton').click(this.search);
    }
    
    public search():void {
        console.log("Something happened - just checking");
        let query: SPQuery = new SPQuery(SPSite);
        query.QueryText = $('#searchInput').val();
        console.log("Here is the query: " + query.QueryText);
    }
}

let app = new JQuerySearchApp();
app.init();