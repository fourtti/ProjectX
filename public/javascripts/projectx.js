var app = angular.module('projectx', ['ngResource','ngRoute']);


app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
        
    }).when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'

    }).when('/register', {
        templateUrl: 'partials/register.html',
        controller: 'RegisterCtrl'

    }).when('/online', {
        templateUrl: 'partials/online.html',
        controller: 'OnlineCtrl'
        
    }).when('/bitcoin', {
        templateUrl: 'partials/bitcoin.html',
        controller: 'BitcoinCtrl'
        
    }).when('/neo', {
        templateUrl: 'partials/neo.html',
        controller: 'NeoCtrl'

    }).when('/ethereum', {
        templateUrl: 'partials/ethereum.html',
        controller: 'EthereumCtrl'

    }).otherwise({
        redirectTo: '/'
    });
}]);

app.service("authentication", ["$window","$http", function($window,$http){
    var saveToken = function (token){
        $window.localStorage["projectx-token"] = token;
    };
    var getToken = function (){
        return $window.localStorage["projectx-token"];
    };
    var register = function(user){
        return $http.post("/users/register", user).success(function(){//data
            //saveToken(data.token);
            alert("Registered successfully");
        });
    };
    var login = function(user){
        return $http.post("/users/login", user).success(function(data){
            saveToken(data.token);
        });
    };
    var logout = function(){
        $window.localStorage.removeItem("projectx-token");
        console.log("token removed");

    };

    var isLoggedIn = function(){
        var token = getToken();

        if (token){
            var payload = JSON.parse($window.atob(token.split(".")[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };
    var currentUser = function(){
        if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split(".")[1]));
            console.log(payload);
            return{
                email: payload.email,
                name: payload.name,
                id: payload._id
            };
        }
    };

    return {
        saveToken: saveToken,
        getToken: getToken,
        register: register,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
    };
}]);


app.controller('HomeCtrl', ['$scope', '$location','authentication', function($scope, $location, authentication){
    $scope.$on('$viewContentLoaded', function(){
        
        $scope.user = authentication.currentUser();
        $scope.userIsLoggedIn = authentication.isLoggedIn();
        $scope.userLogOut = function(){
            console.log("Tried to log out");
            authentication.logout();
            console.log("logged out successfully");
            $location.path("#");
        };
        $scope.goOnline = function() {
            $location.path("/online");
        }
    });
}]);


app.controller("LoginCtrl", ["$scope", "$location", "authentication",function($scope,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){

        $scope.userLogin = function(){
            console.log("login function");
            authentication.login($scope.user).then(function(){
                console.log('came to right path');
                $location.path("/online");
            });

        };
    });

}]);

app.controller("RegisterCtrl", ["$scope", "$location", "authentication",function($scope,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){

        $scope.userRegister = function(){
            console.log("register function");
            authentication.register($scope.user).then(function(){
                console.log('came to right path');
                $location.path("#");
            });

        };
    });

}]);



app.controller("OnlineCtrl", ["$scope", "$location", "authentication", function($scope,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){
        //openView = "online";
        $scope.user = authentication.currentUser();
        $scope.isLoggedIn = authentication.isLoggedIn();
        $scope.userLogOut = function(){
            console.log("Tried to log out");
            authentication.logout();
            console.log("logged out successfully");
            $location.path("#");   
        };

    });

}]);

app.controller("BitcoinCtrl", ["$scope", "$http", "$location", "authentication",function($scope,$http,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){
        //openView = "online";
        
        var dataPoints = [];
        $scope.chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "dark2",
            title: {
                text: "Bitcoin value"
            },
            axisY: {
                title: "Value $",
                titleFontSize: 24
            },
            data: [{
                type: "line",
                yValueFormatString: "",
                dataPoints: dataPoints
            }]
        });

        function addData(data) {
            var bpi = data.bpi;

            console.log(bpi);
            for (item in bpi) {
                //console.log(item);
                if(bpi.hasOwnProperty(item)) {
                    //console.log(bpi[item]);
                }
            }

            for (item in bpi) {
        //console.log(item);

    //var stringdate= JSON.stringify(item);
    //console.log(stringdate);
    //var splitted[]= stringdate.split
                if(bpi.hasOwnProperty(item)) {
        //console.log(bpi[item]);

                    dataPoints.push({
                      x: new Date(item),
                      y: bpi[item]
                  });
                }
            }



        $scope.chart.render();
        
        };

        $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json", addData);

        //console.log($.getJSON("https://etherchain.org/api/statistics/price"));

        $scope.user = authentication.currentUser();
        $scope.isLoggedIn = authentication.isLoggedIn();
        $scope.userLogOut = function(){
            console.log("Tried to log out");
            authentication.logout();
            console.log("logged out successfully");
            $location.path("/");   
        };
    });



}]);
app.controller("NeoCtrl", ["$scope", "$http", "$location", "authentication",function($scope,$http,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){

        var promises = [];
        var dataPoints = [];
        var usdArray = [];
        var dateArray = [];

        $scope.chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "dark2",
            title: {
                text: "Neo value"
            },
            axisY: {
                title: "Value $",
                titleFontSize: 24
            },
            data: [{
                type: "line",
                yValueFormatString: "",
                dataPoints: dataPoints
            }]
        });


        function getDate() {
          var dataDate = new Date(monthmsback);
          var iso = dataDate.toISOString();
          var split = iso.split("T");
          date = split[0];
          monthmsback = monthmsback + 86400000;
          return date;
        }
        function saveData(date, value) {
            dateArray.push(date);
            usdArray.push(value);

        }

        var d = new Date();

        //unix time in seconds and in milliseconds 
        var seconds = Math.round(d.getTime() / 1000);
        var roundedNow = Math.round(d.getTime()-1);

        //one month in seconds and milliseconds
        var monthseconds = 2592000;
        var monthmilliseconds = 2592000000;

        //one month backwards in seconds & milliseconds, adjusted during function
        var monthback = seconds-monthseconds;
        var monthmsback = roundedNow-monthmilliseconds;

        //looping to get daily datas in array
        for (i = 0; i < 10; i++) {
            var addr = "https://min-api.cryptocompare.com/data/pricehistorical?fsym=NEO&tsyms=NEO,USD&ts=" + (monthback);
            promises.push($.getJSON(addr));
            monthback = monthback + 8640;

        } //taking the wanted data out of objects and saving them
        $.when.apply($, promises).then(function(){
            for(prom in promises) {
                if(promises.hasOwnProperty(prom)) {
                    //console.log(promises[prom].responseJSON.NEO.USD);
                    var price = promises[prom].responseJSON.NEO.USD;
                    var datum = getDate();

                    //saveData(datum, price);
                dataPoints.push({
                    //x: new Date(dateArray[j]),
                    x: new Date(datum),
                    //y: usdArray[j]
                    y: price
                });  
                }
            }
            //for(j = 0; j < dateArray.length; j++) {

            //}
        }).then(function() {
            $scope.chart.render();
            
        }).then(function() {
            
        });


        //console.log($.getJSON("https://min-api.cryptocompare.com/data/price?fsym=NEO&tsyms=USD"));

        

        //location.reload();
        $scope.price = nowprice; 
        $scope.user = authentication.currentUser();
        $scope.isLoggedIn = authentication.isLoggedIn();
        $scope.userLogOut = function(){
            console.log("Tried to log out");
            authentication.logout();
            console.log("logged out successfully");
            $location.path("/");   
        };

    });

}]);


app.controller("EthereumCtrl", ["$scope", "$http", "$location", "authentication",function($scope,$http,$location,authentication){
    $scope.$on('$viewContentLoaded', function(){
        var dataPoints = [];
        $scope.chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "dark2",
            title: {
                text: "Ethereum value"
            },
            axisY: {
                title: "Value $",
                titleFontSize: 24
            },
            data: [{
                type: "line",
                yValueFormatString: "",
                dataPoints: dataPoints
            }]
        });

        function addData(data) {
            var epi = data.data;
            console.log(epi);
            for (item in epi) {
                console.log(item);
                if(epi.hasOwnProperty(item)) {
                    var split = epi[item].time.split("T");
                    console.log(split[0] + " " + epi[item].usd);
                    
                    dataPoints.push({
                      x: new Date(split[0]),
                      y: epi[item].usd
                  });
                }
            }

            $scope.chart.render();

        };
        function priceNow(data) {
            var pricedata = data;
            //console.log(pricedata);
            for (item in pricedata) {
                if(pricedata.hasOwnProperty(item)) {
                    $scope.price = pricedata[item];
                    console.log(pricedata[item]);
                }
            }
        };
        //console.log($.getJSON("https://etherchain.org/api/statistics/price"));
        $.getJSON("https://etherchain.org/api/statistics/price", addData);
        $.getJSON("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", priceNow);


        $scope.user = authentication.currentUser();
        $scope.isLoggedIn = authentication.isLoggedIn();
        $scope.userLogOut = function(){
            console.log("Tried to log out");
            authentication.logout();
            console.log("logged out successfully");
            $location.path("/");   
        };
    });

}]);