


jQuery(function () { 
    //authorization context 
    var resource = 'https://paulsummfy17.sharepoint.com'; 
    var endpoint = 'https://paulsummfy17.sharepoint.com/_api/search/query?queryText=\'*\''; 

    var authContext = new AuthenticationContext({ 
        instance: 'https://login.microsoftonline.com/', 
        tenant: 'paulsummfy17.onmicrosoft.com', 
        clientId: '98b65e1c-b4b0-4a43-87e2-e15029e616c1', 
        postLogoutRedirectUri: window.location.origin, 
        cacheLocation: 'localStorage' 
    }); 

    //sign in and out 
    jQuery("#loginButton").click(function () { 
        authContext.login(); 
    }); 
    jQuery("#logoutButton").click(function () { 
        authContext.logOut(); 
    }); 
            //save tokens if this is a return from AAD 
    authContext.handleWindowCallback(); 
    var user = authContext.getCachedUser(); 
    
    if (user) { 
        //successfully logged in 
        //welcome user 
        jQuery("#userPanel").html("Welcome, " + user.userName); 
        jQuery("#loginButton").hide(); 
        jQuery("#logoutButton").show(); 
        //call rest endpoint 
        authContext.acquireToken(resource, 
            function (error, token) { 
                if (error || !token) { 
                    jQuery("#info").text('ADAL Error Occurred: ' + error); 
                    return; 
                } 
                let searchClient = new JQuerySearchClient(token);
                //let aClient: ISearchClient = new JQuerySearchClient(token);

                let query = new SPQuery(SPSite);
                query.QueryText = $('#searchInput').val(); 
                $('#info').html("<p>Here is your query: ${query.QueryText}</p>");

                aClient.getSearchResults(query.GetRequest())
                    .then((results) => {
                    console.log(results);
                    //return Promise.resolve(results);
                });
                /*
                $.ajax({ 
                    type: 'GET', 
                    url: endpoint, 
                    headers: { 
                        'Accept': 'application/json', 
                        'Authorization': 'Bearer ' + token, 
                    }, 
                })
                .done(
                    function (data) { 
                        jQuery("#info").text('The name of the SharePoint site is: ' + data); })
                .fail(
                    function (err) { 
                        jQuery("#info").text('Error calling REST endpoint: ' + err.statusText); })
                .always(
                    function () { 
                    
                }); 
                */
            }
        ); 
    }
    else if (authContext.getLoginError()) { 
        //error logging in 
        jQuery("#loginButton").show(); 
        jQuery("#logoutButton").hide(); 
        jQuery("#userPanel").text(authContext.getLoginError()); 
    } else { 
        //not logged in 
        jQuery("#loginButton").show(); 
        jQuery("#logoutButton").hide(); 
        jQuery("#userPanel").text("You are not logged in."); 
    } 
});