import $ = require('jquery');

//

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
        return new AdalConfig(authConfig.clientId, 
                                authConfig.tenant, 
                                authConfig.redirectUri, 
                                authConfig.postLogoutRedirectUri);
    }

    public init():void {
        
        var self = this; 
        this.adalConfig = this.getConfig();
        this.authCtx = Authentication.getContext(this.adalConfig);

        $('#searchButton').click(() => self.search());

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

        this.renderUser();
    }
    /**
     * Renders the panel containing the custom user information
     */
    private renderUser() : void {
        let userEl = $('#userPanel');
        
        if(this.user) {
             $('#userPanel').html("Welcome, " + this.user.name);
        }
        else {
             $('#userPanel').html("Please click the 'Login' button");
        }
    }
    
    public search():void {
        const token: string = this.authCtx.getToken();
        let aClient: ISearchClient = new JQuerySearchClient(token);

        let query: SPQuery = new SPQuery(SPSite);
        query.QueryText = $('#searchInput').val(); 

        aClient.getSearchResults(query.GetRequest()).then((results) => {
            console.log(results);
        });
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