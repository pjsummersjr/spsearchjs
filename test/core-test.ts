import 'mocha';

import {expect}  from 'chai';

import { MockSPSearchClient } from '../src/MockSPSearchClient';
import { ISearchClient, ISearchResults, ISearchResult } from '../src/ISearch';

describe('Array', function(){
    describe('#indexOf()', function() {
        it('Should return -1 when the value is not present',
        function(){
            expect(-1).to.equal([1,2,3].indexOf(4));
        });
    });
});


describe('BasicSearchObject',
    function() {
        it('Should instantiate without an error',
            function(){
                let searchClient: ISearchClient = new MockSPSearchClient();
                //var output = searchClient.getSomething("My value");
                //expect(output).to.equal("My value Something Good");
            }
        )
    }
);

describe('Get Some Results',
    function() {
        it('Should return some type of search object', 
            function() {
                let searchClient:ISearchClient = new MockSPSearchClient();
                return searchClient.getSearchResults("something").then(
                    function(results:ISearchResults) {
                        expect(results.data).to.be.an('array'); 
                        expect(results.data[0].totalItems).to.equal(5243);    
                        //console.log(results.data[0].totalItems);                   
                    }
                );
            }
        )
    }
);