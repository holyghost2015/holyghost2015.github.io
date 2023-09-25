var Amount = [];
var AmountProducers = [];
var AmountBonus = [];
var AmountToBuy = [];
var AmountToProd = [];
var last;
var Boni = [1, 1, 1, 2, 3, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12];
var Running = []

var pause = function(caller, event){
    event.stopPropagation();
    Running[caller] = !Running[caller];
    var toggled = document.getElementById("frame"+caller);
    if(Running[caller]){
        toggled.classList.add("disabled");
        toggled.classList.remove("enabled");
    }else{
        toggled.classList.add("enabled");
        toggled.classList.remove("disabled");
    }
}

var cost = function(caller){
    var amount = AmountProducers[caller];
    var amountBuy = AmountToBuy[caller];
    return amount*amountBuy + ((amountBuy +1)*amountBuy)/2;
}

var buy = function(caller, event) {
    event.stopPropagation();
    Amount[caller+1] = +Amount[caller+1];
    AmountProducers[caller] = +AmountProducers[caller]
    AmountToBuy[caller] = +AmountToBuy[caller]
    if(canbuy(caller)){
        Amount[caller+1] -= cost(caller);
        AmountProducers[caller] += AmountToBuy[caller];
    }
    setDisplay();
}
var buyall = function(caller, event) {
    event.stopPropagation();
    Amount[caller] = +Amount[caller] + 1000;
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
        Amount[i]=+0;
        AmountToBuy[i]=+1;
        AmountToProd[i]=+1;
        AmountProducers[i]=+0;
        AmountBonus[i]=+1;
        Running[i]=true;
    }
    last = +0;
    lastUnlocked = +0;
}

var calculate = function(){
    for(var i=0; i<26; i++){
        Amount[i]=+Amount[i];
        if(AmountProducers[i]>0 && Running[i]){
            if(i==0){
                Amount[0]+=AmountToProd[0]*AmountProducers[0]*AmountBonus[0];
            } else if(Amount[i-1]>=(AmountProducers[i]*10)){
                Amount[i-1] -= AmountProducers[i]*10;
                Amount[i] += AmountToProd[i]*AmountProducers[i]*AmountBonus[i];
            } else {
                Amount[i] += Math.floor(Amount[i-1]/10)*AmountToProd[i]*AmountBonus[i];
                Amount[i-1]=Amount[i-1]%10;
            }
        }
    }
}

var setDisplay = function(){
    var field = document.getElementById("amount0");
    var position = 0;
    while(field != undefined){
        var content = Amount[position];
        if(AmountProducers[position] != 0){
            var amountProduced = (Running[position] ? (AmountProducers[position] * AmountToProd[position] * AmountBonus[position]) : 0) - (Running[position+1] ? (AmountProducers[position+1] * 10) : 0);
            content += " / "
            if(amountProduced>0){content+="+";}
            content += amountProduced;
            content += " (" + AmountProducers[position] + ")";
        }
        field.textContent = content;
        position++;
        field = document.getElementById("amount" + position);
    }
}

var setCookie = function(){
    var cook = "Amount=";
    for(var i=0; i<26; i++){
        cook += Amount[i] + " ";
    }
    cook += "I";
    for(var i=0; i<26; i++){
        cook += AmountProducers[i] + " ";
    }
    cook += "I";
    for(var i=0; i<26; i++){
        cook += AmountBonus[i] + " ";
    }
    cook += "I";
    for(var i=0; i<26; i++){
        cook += AmountToBuy[i] + " ";
    }
    cook += "I";
    for(var i=0; i<26; i++){
        cook += AmountToProd[i] + " ";
    }
    cook += "I" + last;
    cook += "; expires=Tue, 19 Jan 2038 03:14:07 GMT"
    document.cookie = cook;
    console.log(document.cookie);
}

var readCookie = function(){
    var Read = [];
    var ReadValue = [];
    var ReadAmount = [];
    cook = document.cookie;
    Read = cook.split("=")
    if(Read[1]==undefined){Read[1]="";}
    ReadValue = Read[1].split("I");
    for(var i=0; i<6; i++){
        if(ReadValue[i]==undefined){ReadValue[i]="";}
    }
    ReadAmount = ReadValue[0].split(" ");
    for(var i=0; i<ReadAmount.length; i++){
        Amount[i]=ReadAmount[i];
    }
    ReadAmount = ReadValue[1].split(" ");
    for(var i=0; i<ReadAmount.length; i++){
        AmountProducers[i]=ReadAmount[i];
    }

    var lastUnlocked = ReadValue[5];
    loadUnlocked(lastUnlocked);
}

onload = function(){
    initialize();
    readCookie();
    setDisplay();
    this.setInterval(update, 1000);
}

var update = function(){
    calculate();
    testForUnlock();
    setDisplay();
    setCookie();
}

var calculateBoni = function(){
    var difference
    for(var i=0; i<last; i++){
        difference = last-i;
        AmountBonus[i] = Boni[difference];
    }
}

var loadUnlocked = function(lastUnlocked){
    for(var i=1; i<=lastUnlocked; i++){
        add(i);
    }
    last = lastUnlocked;
    calculateBoni();
}

var testForUnlock = function() {
    if(Amount[last]>=10){
        last++;
        add(last);
    calculateBoni();
    }
}

var add = function(toAdd){
    var newNode = document.createElement("div");
    newNode.classList.add("frame");
    newNode.id = "frame"+toAdd;
    //newNode.addEventListener("click", produce(toAdd));
    //newNode.onclick=produce(toAdd);
    newNode.setAttribute("onclick", "produce("+toAdd+")");

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
    buyAllButton.addEventListener("click", function(event){buyAll(toAdd, event);});

    buyNode.appendChild(buyButton);
    buyNode.appendChild(buyAllButton);

    var pauseNode = document.createElement("div");
    pauseNode.classList.add("pause");

    var pauseButton = document.createElement("button");
    pauseButton.classList.add("pause");
    pauseButton.addEventListener("click", function(event){pause(toAdd, event);});

    pauseNode.appendChild(pauseButton);
    
    //insert in main node
    newNode.appendChild(letterNode);
    newNode.appendChild(amountNode);
    newNode.appendChild(buyNode);
    newNode.appendChild(pauseNode);

    //append to html
    var lastNode = document.getElementById("frame"+(toAdd-1));
    lastNode.insertAdjacentElement("afterend", newNode);
}
