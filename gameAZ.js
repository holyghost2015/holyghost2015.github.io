var buy = function(caller) {
    alert(caller);

    canbuy(caller);

}
var buyall = function(caller) {

}

var canbuy = function(caller){
    var amount = Ammount[caller];
    var amountBuy = AmountBuy[caller];

}

var produce = function(caller){
    if(caller==1){
        Amount[caller]+=AmountProd[caller];
    }else if(Amount[caller-1]>=10){
        Amount[caller-1]-=10;
        Amount[caller]+=AmountProd[caller];
    }
}


var Amount = [];
var AmountBuy = [];
var AmountProd = [];


var initialize = function(){
    for(var i=1; i<=26;i++){
        Amount[i]=0;
        AmountBuy[i]=1;
        AmountProd[i]=1;
        
    }
}

var setCookie = function(){
    var cook = "Amount=";
    for(var i=1; i<=26;i++){
        cook += Amount[i] + " ";
    }
    cook += "; expires=Tue, 19 Jan 2038 03:14:07 GMT"
    document.cookie = cook;
}

onload = function(){
    initialize();
    var Amountread = [];
    cook = document.cookie;
    AmountRead = cook.split("=")
    if(AmountRead[1]==undefined)AmountRead="";
    AmountRead = AmountRead[1].split(" ");
    alert(AmountRead);
    this.setInterval(update, 1000);
}

var update = function(){
    setCookie();
}
