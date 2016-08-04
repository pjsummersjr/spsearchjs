var SPResults = {

    metadata: {
        ElapsedTime: null,
        TotalHits: null
    },
        
    Refiners: null,
    PrimaryResults: null,
    SecondaryResults: null,
    TriggeredRules: null,
    SpellingSuggestions: null
}

function ParseResults(rawJson){
    //if the data is null
    if(!rawJson){
        return null;
    }

    var jsonObj = JSON.parse(rawJson);

    if(jsonObj.PrimaryResults){
        SPResults.PrimaryResults = GetResultItems(jsonObj.PrimaryResults);
    }
    for(var i = 0; i <= jsonObj.SecondaryResults.length; i++){
        SPResults.SecondaryResults.push(GetResultItems(jsonObj.SecondaryResults[i]));
    }
}

function GetResultItems(jsonObj){
    var theResults = [];

    if(!jsonObj || jsonObj.Table == null){ return theResults;}

    var results = jsonObj.Table.Rows.results;


}