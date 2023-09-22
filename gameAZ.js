var Amount = [];
var AmountToBuy = [];
var AmountToProd = [];
var AmountProducers = [];
var last;


var cost = function(caller){
    var amount = AmountProducers[caller];
    var amountBuy = AmountToBuy[caller];
    return amount*amountBuy + ((amountBuy +1)*amountBuy)/2;
}

var buy = function(caller, event) {
    event.stopPropagation();
    if(canbuy(caller)){
        Amount[caller+1] -= cost(caller);
        AmountProducers[caller] += AmountToBuy[caller];
    }
    setDisplay();
}
var buyall = function(caller, event) {
    event.stopPropagation();
    setDisplay();
}

var canbuy = function(caller){
    var available = Amount[caller+1];

    var BuyCosts = cost(caller);

    return BuyCosts <= available;
}

var produce = function(caller){
    Amount[caller]=+Amount[caller];
    if(caller==0){
        Amount[caller]+=AmountToProd[caller];
    }else if(Amount[caller-1]>=10){
        Amount[caller-1]-=10;
        Amount[caller]+=AmountToProd[caller];
    }
    testForUnlock();
    setDisplay();
}

var initialize = function(){
    for(var i=0; i<26; i++){
        Amount[i]=0;
        AmountToBuy[i]=1;
        AmountToProd[i]=1;
        AmountProducers[i]=0;
        
    }
    last = 1;
}

var calculate = function(){
    for(var i=0; i<26; i++){
        Amount[i]=+Amount[i];
        if(AmountProducers[i]>0){
            if(i==0){
                Amount[0]+=AmountToProd[0]*AmountProducers[0];
            } else if(Amount[i-1]>=(AmountProducers[i]*10)){
                Amount[i-1] -= AmountProducers[i]*10;
                Amount[i] += AmountToProd[0]*AmountProducers[0];
            } else {
                Amount[i] += Math.floor(Amount[i-1]/10)*AmountToProd[i];
                Amount[i-1]=Amount[i-1]%10;
            }
        }
    }
}

var setDisplay = function(){
    var field = document.getElementById("Amount0");
    var position = 0;
    while(field != undefined){
        var content = Amount[position];
        if(AmountProducers[position] != 0){
            content += " / +" + AmountProducers[position];
        }
        field.textContent = content;
        position++;
        field = document.getElementById("Amount" + position);
    }
}

var setCookie = function(){
    var cook = "Amount=";
    for(var i=0; i<26; i++){
        cook += Amount[i] + " ";
    }
    cook += "; expires=Tue, 19 Jan 2038 03:14:07 GMT"
    document.cookie = cook;
    console.log(document.cookie);
}

var readCookie = function(){
    var Read = [];
    var Amountread = [];
    cook = document.cookie;
    Read = cook.split("=")
    if(Read[1]==undefined){Read[1]="";}
    AmountRead = Read[1].split(" ");
    for(var i=0; i<AmountRead.length; i++){
        Amount[i]=AmountRead[i];
    }
}

onload = function(){
    initialize();
    readCookie();
    this.setInterval(update, 1000);
}

var update = function(){
    calculate();
    testForUnlock();
    setDisplay();
    setCookie();
}

var testForUnlock = function() {
    if(Amount[last]>=10){
        last++;
        add(last);
    }
}

var add = function(toAdd){
    var newNode = document.createElement("div");
    newNode.classList.add("frame");
    newNode.id = "frame"+toAdd;

    //Name
    var letterNode = document.createElement("div");
    letterNode.classList.add("name");
    var letterText = document.createTextNode("Letter"+toAdd);
    letterNode.appendChild(letterText);

    //Amount
    var amountNode = document.createElement("div");
    amountNode.classList.add("amount");
    amountNode.id = "amount"+toAdd;
    var amountText = document.createTextNode("0");
    amountNode.appendChild(amountText);

    //Buttons
    var buyNode = document.createElement("div");
    buyNode.classList.add("buy");
    
    var buyButton = document.createElement("button");
    buyButton.classList.add("buyFix");
    buyButton.addEventListener("click", function(event){buy(toAdd, event);});
    
    var buyAllButton = document.createElement("button");
    buyAllButton.classList.add("buyAll");
    //buyAllButton.addEventListener("click", function(event){buyAll(toAdd, event);});
    buyAllButton.addEventListener("click", function(event){alert("It works: " + event);});

    buyNode.appendChild(buyButton);
    buyNode.appendChild(buyAllButton);

    //insert in main node
    newNode.appendChild(letterNode);
    newNode.appendChild(amountNode);
    newNode.appendChild(buyNode);

    //append to html
    var lastNode = document.getElementById("frame"+(toAdd-1));
    lastNode.insertAdjacentElement("afterend", newNode);
}
