var cost = function(caller){
    var amount = AmountProducers[caller];
    var amountBuy = AmountToBuy[caller];
    return amount*amountBuy + ((amountBuy +1)*amountBuy)/2;
}

var buy = function(caller) {
    alert("geht noch");
    event.stopPropagation();
    if(canbuy(caller)){
        Amount[caller+1] -= cost(caller);
        AmountProducers[caller] += AmountToBuy[caller];
    }

}
var buyall = function(caller) {

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
    
    setDisplay();
}



var Amount = [];
var AmountToBuy = [];
var AmountToProd = [];
var AmountProducers = [];


var initialize = function(){
    for(var i=0; i<26; i++){
        Amount[i]=0;
        AmountToBuy[i]=1;
        AmountToProd[i]=1;
        AmountProducers[i]=0;
        
    }
}

var calculate = function(){
    for(var i=0; i<26; i++){
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

onload = function(){
    initialize();
    var Read = [];
    var Amountread = [];
    cook = document.cookie;
    Read = cook.split("=")
    if(Read[1]==undefined){Read[1]="";}
    AmountRead = Read[1].split(" ");
    alert(AmountRead);
    for(var i=0; i<AmountRead.length; i++){
        Amount[i]=AmountRead[i];
    }
    alert(Amount);
    this.setInterval(update, 1000);
}

var update = function(){
    calculate();
    setDisplay();
    setCookie();
}
