import $ = require('jquery');

//https://medium.com/@OCombe/how-to-publish-a-library-for-angular-2-on-npm-5f48cdabf435

import { JQuerySearchClient } from './JQuerySearchClient';
import { ISearchClient, ISearchQuery, ISearchResults } from 'spsearchjs';
import { SPQuery } from 'spsearchjs';
import { AdalConfig, Authentication, AuthenticationContext } from 'adal-typescript';

const tenantId = "paulsummfy17";
const SPSite = "https://"+ tenantId + ".sharepoint.com";

const authConfig = {
                instance: "https://login.microsoftonline.com",
                tenant: tenantId + ".onmicrosoft.com",
                clientId: "98b65e1c-b4b0-4a43-87e2-e15029e616c1",
                postLogoutRedirectUri: window.location.origin,
                cacheLocation: 'localStorage',
                redirectUri: "http://localhost:8080"
            };

export class JQuerySearchApp {

    private searchClient: JQuerySearchClient; 
    private authCtx: AuthenticationContext;
    private adalConfig: AdalConfig;
    private user: any;
    
    public constructor(){   
    }

    private getConfig() : AdalConfig {
        return new AdalConfig(authConfig.clientId, authConfig.tenant, authConfig.redirectUri);
    }

    public init():void {
        
        var self = this; 
        this.adalConfig = this.getConfig();
        this.authCtx = Authentication.getContext(this.adalConfig);

        $('#searchButton').click(self.search);

        Authentication.getAadRedirectProcessor().process();
        this.user = this.authCtx.getUser();
        if(this.authCtx && this.user){                
            $('#logoutButton').show();       
            $('#logoutButton').click(e => this.logout(e));
        }
        else {
            $('#loginButton').show();
            $('#loginButton').click(e => this.login(e));
        }
    }
    
    public search():void {
        let aClient: ISearchClient = new JQuerySearchClient();
        console.log("Something happened - just checking");
        let query: SPQuery = new SPQuery(SPSite);
        query.QueryText = $('#searchInput').val();
        console.log("Running search query");
        aClient.getSearchResults(query.GetRequest()).then((results) => {
            console.log(results);
        });
        console.log("Here is the query: " + query.QueryText);
    }

    public logout(event) : void {
        this.authCtx.logout();
    }

    public login(event) : void {
        this.authCtx.login();
    }
}

let app = new JQuerySearchApp();
app.init();