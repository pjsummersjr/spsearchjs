import $ = require('jquery');

import { ISearchClient, ISearchResults } from 'spsearchjs';

export class JQuerySearchClient implements ISearchClient {

    public getSearchResults(query: string) : Promise<ISearchResults> {
        return Promise.resolve(null);
    }

}