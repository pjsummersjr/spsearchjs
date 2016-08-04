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
    for(var i = 0; i < jsonObj.SecondaryResults.length; i++){
        SPResults.SecondaryResults.push(GetResultItems(jsonObj.SecondaryResults[i]));
    }
}

function GetResultItems(jsonObj){
    var theResults = [];

    if(!jsonObj || jsonObj.Table == null){ return theResults;}

    var results = jsonObj.Table.Rows.results;

    for(var i = 0; i < results.length; i++){
        var result = results[i];
        var fields = result.Cells.results;

        var newResult = null;

        var fieldJsonStr = '{';
        for (var j = 0; j < fields.length; j++) {
            if (fieldJsonStr.length > 1) fieldJsonStr += ",";

            var theValue = fields[j].Value;
            if (theValue != null) {
                //Replaces line feed and carriage return characters that break the JSON parsing in IE
                theValue = theValue.replace(/[\n\r]/g, '');
            }
            if (theValue != null && theValue.indexOf("[") == 0) {
                fieldJsonStr += "\"" + fields[j].Key + "\":" + theValue;
            }
            else {
                fieldJsonStr += "\"" + fields[j].Key + "\":\"" + theValue + "\"";
            }
            
        }
        fieldJsonStr += '}';
        newResult = JSON.parse(fieldJsonStr);
        theResults.push(newResult);
    }

    return theResults;
}