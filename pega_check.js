// Declare variables 
const apiKey = 'REK21YRSED2VQA4X461TMQN579KPVZHF1Q';
const pegaApi = 'https://api.pegaxy.io/pega/';
const assetLink = 'https://play.pegaxy.io/my-assets/pega/';
const options = {method: 'GET', headers: {Accept: 'application/json'}};

var apiButton = document.getElementById("buttonSearch");
var msg = document.getElementById("msg");
var ierror = document.getElementById("ierror");
var pegas_red = document.getElementById("pegas_red");
var pegas_green = document.getElementById("pegas_green");

var ids = [];
var urls = [];
var url;
var results;
var element;

function createMsg(ids){

    //console.log("createMsg.Ids: " + ids);

    msg.innerHTML = "";
    pegas_red.innerHTML = "";
    pegas_green.innerHTML = "";
    urls = [];

    var walletAddress = document.getElementById("inputWallet").value;
    var critical_value = document.getElementById("inputEnergy").value;

    ids.forEach(function(item, index, array) {
        url = pegaApi + item;
        urls.push(url);
      });
    
    //console.log('Urls: ' + urls);

      
    Promise.all(urls.map(url =>
        fetch(url).then(resp => resp.json())
    )).then(texts => {
        
        //console.log("Texts: " + texts);
        var greens = 0;
        var reds = 0;
    
        texts.forEach(text => {

            //console.log("Text: " + text);
            var pid;
            var poid;
            var pen;
            var pim;        
            var link;
            var img;

            poid = text.pega.owner.address;

            if(poid.toLowerCase() == walletAddress.toLowerCase()) {
                pid = text.pega.id;
                pen = text.pega.energy;
    
                if(text.pega.design.avatar != "")
                    pim = text.pega.design.avatar;
                else
                    pim = 'https://cdn.pegaxy.io/data/pega/1637062928903';
    
                img = document.createElement("img");
                img.src = pim;
                img.width = 100;
                img.style.marginRight = "5px";
                img.style.border = "5px solid";
                
                link = document.createElement("a");
                link.href = assetLink+pid;
                link.target = "_blank";
    
                //console.log(":" + link);
    
                if (pen >= critical_value){
                    img.style.borderColor = "red";
                    link.appendChild(img);
                    pegas_red.appendChild(link);
                    reds++;
                }
                else{
                    img.style.borderColor = 'green';
                    link.appendChild(img);
                    pegas_green.appendChild(link);
                    greens++;
                }
            }

    });
    var sum = reds + greens;
    msg.innerHTML = reds + "/" + sum + " Pega have more or equal energy than value " + critical_value + "!";
    //console.log("msg: " + msg);
})
    


}

apiButton.addEventListener("click", function() {

    var walletAddress = document.getElementById("inputWallet").value;
    var apiUrl = 'https://api.polygonscan.com/api?module=account&action=tokennfttx&contractaddress=0xd50d167dd35d256e19e2fb76d6b9bf9f4c571a3e&address=' + walletAddress + '&page=1&sort=asc&apikey=' + apiKey; 

    var ids = [];
    var buys = [];
    var sells = [];
    var id;
    var from;
    var to;
    ierror.innerHTML = "";

    fetch(apiUrl, options)
    .then(response => response.json())
    .then(data => { 
          
            data.result.forEach(element => {

                id = element["tokenID"];
                from = element["from"];
                to = element["to"];
                tstmp = element["timeStamp"];

                if(!ids.includes(id))
                    ids.push(id);

            });
        
        console.log("Ids: " + ids);
        createMsg(ids);
    })
    .catch((error) => {
        ierror.innerHTML = "Please choose a valid wallet address like 0x...";
      });
});