import $ = require('jquery');
import AuthenticationContext = require('adal-angular');

//

import { JQuerySearchClient } from './JQuerySearchClient';
import { ISearchClient, ISearchQuery, ISearchResults } from 'spsearchjs';
import { SPQuery } from 'spsearchjs';

const tenantId = "paulsummfy17";
const SPSite = "https://"+ tenantId + ".sharepoint.com";

const authCtx = new AuthenticationContext({ 
                instance: 'https://login.microsoftonline.com/', 
                tenant: 'paulsummfy17.onmicrosoft.com', 
                clientId: '98b65e1c-b4b0-4a43-87e2-e15029e616c1', 
                postLogoutRedirectUri: window.location.origin, 
                cacheLocation: 'localStorage' 
            });

export class JQuerySearchApp {

    private searchClient: JQuerySearchClient; 
    //private authCtx: AuthenticationContext;
    private user: any;
    private token: string;
    
    public constructor(){   
    }

   
    public init():void {
        
        //const authCtx = new AuthenticationContext(authConfig);        
        authCtx.handleWindowCallback(window.location.hash);

        this.user = authCtx.getCachedUser();

        $('#searchButton').click(() => this.search());

        if(authCtx && this.user){                
            $('#logoutButton').show();       
            $('#logoutButton').click(() => this.logout());
        }
        else {
            $('#loginButton').show();
            $('#loginButton').click(() => this.login());
        }

        this.renderUser();
    }
    
    public search():void {
        //const authCtx = new AuthenticationContext(authConfig);

        if(this.user){
            //let resourceId: string = authCtx.config.loginResource;
            let resourceId: string = "https://paulsummfy17.sharepoint.com";
  
            authCtx.acquireToken(resourceId, 
                function (error, token){
                    if(error || !token){
                        console.log("ADAL error occurred: " + error);
                        return;
                    }
                    
                    let aClient: ISearchClient = new JQuerySearchClient(token);

                    let query: SPQuery = new SPQuery(SPSite);
                    query.QueryText = $('#searchInput').val(); 
                    $('#info').html(`<p>Here is your query: ${query.QueryText}</p>`);

                    aClient.getSearchResults(query.GetRequest())
                        .then((results) => {
                            console.log(results);
                            //return Promise.resolve(results);
                        });
                    //return Promise.resolve(token);                    
                });
        }
        else {
            //could change this to modify the style of the login button
            this.login();
        }
    }

    //private renderResults(results: ISearchResults) : void {
    private renderResults() : void {
        let resultsComp = $('#searchResults');
        let resultsHtml = "";
        //results.data[0].items.forEach((item) => {
        //    resultsHtml += "<div>" + item.fields[3] + "</div>";
        //})
        resultsComp.html(resultsHtml);
    }
    
    /**
     * Renders the panel containing the custom user information
     */
    private renderUser() : void {
        let userEl = $('#userPanel');
        
        if(this.user) {
             $('#userPanel').html("Welcome, " + this.user.profile.name);
        }
        else {
             $('#userPanel').html("Please click the 'Login' button");
        }
    }

    private logout() : void {
        //const authCtx = new AuthenticationContext(authConfig);
        authCtx.logOut();
    }

    private login() : void {
        //const authCtx = new AuthenticationContext(authConfig);
        authCtx.login();
    }
}

let app = new JQuerySearchApp();
app.init();