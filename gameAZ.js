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
    var cook = "Amount=12";
    /*for(var i=1; i<=26;i++){
        cook += Amount[i] + "%20";
    }*/
    console.log(cook);
    cook += "; expires=Tue, 19 Jan 2038 03:14:07 GMT"
    console.log(cook);
    document.cookie = cook;
    console.log(document.cookie);
    console.log("Cookie: "+document.cookie);
}

onload = function(){
    initialize();
    this.alert(document.cookie);
    this.setInterval(update, 1000);
}

var update = function(){
    setCookie();
}
