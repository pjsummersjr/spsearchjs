const electron = require('electron');
const path = require('path');
const spsearch = require('spsearchjs');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const SPQuery = spsearch.SPQuery;

const query = new SPQuery("");


app.on('ready', 
    function() {
        
        console.log(query.GetRequest());
        mainWin = new BrowserWindow({
            width:800,
            height: 600
        });

        mainWin.loadURL('file://' + path.join(__dirname, 'views','home.html'));

        mainWin.on('closed', function(){
            mainWin = null;
        })
    }
);

app.on('window-all-closed', function(){
    app.quit();
});
