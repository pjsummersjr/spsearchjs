# spsearchjs
A JavaScript library for calling the SharePoint Search API's, including those accessible in SharePoint Online.

The primary code is this repository is the SP.Search.js JavaScript library which abstracts the calls to the SharePoint Search REST API using a familiar object model. This library is being developed in the context of a SharePoint-hosted app because this allows us to focus on the code rather than the complexities of things like CORS. These complexities will be considered for future versions of the API.

#### Files
There are four files included in this repository which you can leverage to test and learn your way through this API.
##### SP.Search.js
This is the core library we're focusing on here. It consists of two objects of interest:
###### Query
The query object abstracts the REST parameters and has a function called RunSearch which makes an AJAX request to the site collection specified in the SPSite property of that object.

The RunSearch method accepts two arguments, a successful callback and a failed callback. The successful callback passes back the SearchResults object (see below) and the failed callback passes back an error message.
###### SearchResults
Upon success of the RunSearch method, the success callback method accepts the SearchResults object as a parameter. This consists of the following subelements:
* Results
  * Array of SearchResult - JSON structure of name/value pairs - note that this breaks away from the native object returned from SharePoint and uses a more basic notation of { "fieldname": "field value",...}
* Refiners - Array of SearchRefiner 
  * Display Name
  * Property Name
  * RefinementItems - Array of SearchRefinementItem (Property Name, Display Value, ,Filter Value, Count)


##### Unit Testing
I leveraged the following resources to define my unit test strategy: 
* https://journal.artfuldev.com/write-tests-for-typescript-projects-with-mocha-and-chai-in-typescript-86e053bdb2b6
* http://mochajs.org/#examples

These are the steps required to get my test architecture working:
``` DOS .bat
npm install mocha chai ts-node -g
npm install mocha chai ts-node --save-dev
npm install @typings/chai @typings/mocha --save-dev
mocha -r ts-node/register test/*.ts
```

Test cases are defined [here](UNITTESTS.md "Unit Test Descriptions")

##### Library Build Instructions
The webpack output configuration seems to define it as a consumable module.
Run webpack to build the library
To consume the library from project in samples, run:
``` 
npm link
```
And then in the sample project:
``` 
npm link spsearchjs
```

