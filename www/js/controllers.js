angular.module('ionicParseApp.controllers', ['ionicParseApp.services'])

.controller('AboutController', function($scope) {
    console.log("about controller works")
})

.controller('AppController', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $scope.logout = function() {
        Parse.User.logOut();
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome', {
            clear: true
        });
    };
})

.controller('WelcomeController', function($scope, $state, $rootScope, $ionicHistory, $stateParams) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
    }

    $scope.login = function() {
        $state.go('app.login');
    };

    $scope.signUp = function() {
        $state.go('app.register');
    };

    $scope.skip = function() {
        $state.go('app.home')
    }

    if ($rootScope.isLoggedIn) {
        $state.go('app.home');
    }
})

.controller('HomeController', function($scope, $state, $rootScope, Meditations, $filter) {
    $scope.sliderConfig = {
        userMin: 1, 
        userMax: 28
    }

    $scope.meditations = Meditations.all();


    if (!$rootScope.isLoggedIn) {
        $state.go('welcome');

    }
    if ($rootScope.isLoggedIn) {
        var user = $rootScope.user
        $scope.userMeditations = user._serverData.savedMeditations
        console.log($scope.userMeditations)
        $scope.saveMeditation = function(meditation) {
            var user = Parse.User.current();
            $scope.userMeditations = user._serverData.savedMeditations
            console.log('meditation: ' + meditation)
            // $rootScope.user._serverData.savedMeditations.push(meditation);
            // $rootScope.user.save();
            // console.log($rootScope.user._serverData)

            var user = Parse.User.current();
            var savedMeditations = user.get("savedMeditations")
            console.log('savedMeditations: ' + savedMeditations)
            var meditation = meditation
            user.add("savedMeditations", {
            id: meditation.id,
            title: meditation.title,
            recording: meditation.recording,
            author: meditation.author,
            description: meditation.description,
            tags: meditation.tags,
            time: meditation.time 
            });
            $scope.userMeditations.push(meditation)
            user.save()
            
            
            console.log(user)
            }
        $scope.removeSavedMeditation = function(meditation) {
                var user = Parse.User.current();
                var savedMeditations = user.get("savedMeditations")
                console.log('savedMeditations: ' + savedMeditations)
                var meditation = meditation
                var found = $filter('filter')(savedMeditations, {id: meditation.id})
                console.log(found)
                var index = savedMeditations.indexOf(found[0]);
                savedMeditations.splice(index, 1);
                $scope.userMeditations = savedMeditations;
                user.set('savedMeditations', []);
                for (var i=0; i<savedMeditations.length; i++) {
                    user.add("savedMeditations", {
                    id: savedMeditations[i].id,
                    title: savedMeditations[i].title,
                    recording: savedMeditations[i].recording,
                    author: savedMeditations[i].author,
                    description: savedMeditations[i].description,
                    tags: savedMeditations[i].tags,
                    time: savedMeditations[i].time 
                    });
                };
                user.save();
                console.log(user)
        }
    }

})

.controller('LoginController', function($scope, $state, $rootScope, $ionicLoading) {
    $scope.user = {
        username: null,
        password: null
    };

    $scope.error = {};

    $scope.login = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Logging in',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = $scope.user;
        Parse.User.logIn(('' + user.username).toLowerCase(), user.password, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $state.go('app.home', {
                    clear: true
                });
            },
            error: function(user, err) {
                $ionicLoading.hide();
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    $scope.error.message = 'Invalid login credentials';
                } else {
                    $scope.error.message = 'An unexpected error has ' +
                        'occurred, please try again.';
                }
                $scope.$apply();
            }
        });
    };

    $scope.forgot = function() {
        $state.go('app.forgot');
    };
})

.controller('ForgotPasswordController', function($scope, $state, $ionicLoading) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {
        success: false
    };

    $scope.reset = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function() {
                // TODO: show success
                $ionicLoading.hide();
                $scope.state.success = true;
                $scope.$apply();
            },
            error: function(err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Email address does not exist';
                } else {
                    $scope.error.message = 'An unknown error has occurred, ' +
                        'please try again';
                }
                $scope.$apply();
            }
        });
    };

    $scope.login = function() {
        $state.go('app.login');
    };
})

.controller('RegisterController', function($scope, $state, $ionicLoading, $rootScope) {
    $scope.user = {};
    $scope.error = {};

    $scope.register = function() {



        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);

        user.signUp(null, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                $state.go('app.home', {
                    clear: true
                });
            },
            error: function(user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
})

.controller('MainController', function($scope, $state, $rootScope, $stateParams, $ionicHistory) {
    if ($stateParams.clear) {
        $ionicHistory.clearHistory();
    }

    $scope.rightButtons = [{
        type: 'button-positive',
        content: '<i class="icon ion-navicon"></i>',
        tap: function(e) {
            $scope.sideMenuController.toggleRight();
        }
    }];

    $scope.logout = function() {
        Parse.User.logOut();
        $rootScope.user = null;
        $rootScope.isLoggedIn = false;
        $state.go('welcome', {
            clear: true
        });
    };

    $scope.toggleMenu = function() {
        $scope.sideMenuController.toggleRight();
    };
});
