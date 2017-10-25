angular.module('userControllers',['userServices'])
.controller('regCtrl', function ($http, $location, $timeout, User) {

    var app = this;

    this.regUser = function (regData, valid) {
        app.disabled = true;
        app.errorMsg = false;
        app.loading = false;
        if (valid) {
            User.create(app.regData).then(function (data) {
                console.log(data.data.success);
                console.log(data.data.message);
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message + '...Readirecting';
                    $timeout(function () {
                        $location.path('/');
                    }, 2000) 
                } else {
                    app.disabled = false;
                    app.loading = false;
                    app.errorMsg = data.data.message;
                }
            });
        } else {
            app.disabled = false;
            app.loading = false;
            app.errorMsg = 'Please ensure from is filled our properly';
        }
    }
    // checkUsername(regData)
    this.checkUsername = function (regData) {
        User.checkUsername(app.regData).then(function (data) {
            app.usernameMsg = false;
            app.usernameInvalid = false;
            app.checkingUsername = true;
            if (data.data.success) {
                app.usernameInvalid = false;
                app.checkingUsername = false;
                app.usernameMsg = data.data.message;
            } else {
                app.usernameMsg = data.data.message
                app.usernameInvalid = true;
                app.checkingUsername = false;
            }
        })
    }

    // checkEmail(regData)
    this.checkEmail = function (regData) {
        User.checkEmail(app.regData).then(function (data) {
            app.emailMsg = false;
            app.emailInvalid = false;
            app.checkingEmail = true;
            if (data.data.success) {
                app.emailInvalid = false;
                app.checkingEmail = false;
                app.emailMsg = data.data.message;
            } else {
                app.emailMsg = data.data.message
                app.emailInvalid = true;
                app.checkingEmail = false;
            }
        })
    }
})

.directive('match', function() {
    return {
        restrict: 'A',
        controller: function ($scope) {

            $scope.confirmed = false;

            $scope.doConfirm = function (values) {
                values.forEach(function(ele) {
                    if ($scope.confirm == ele) {
                        $scope.confirmed = true;
                    } else {
                        $scope.confirmed = false;
                    }
                });
            }
        },

        link: function ($scope, element, attrs) {
            attrs.$observe('match', function () {
                $scope.matches = JSON.parse(attrs.match);
                $scope.doConfirm($scope.matches);
            });

            $scope.$watch('confirm', function () {
                $scope.matches = JSON.parse(attrs.match);
                $scope.doConfirm($scope.matches);
            })
        }
    };
})

.controller('facebookCtrl', function ($routeParams, Auth, $location, $window) {
    // Auth.facebook(token);
    var app = this;
    app.errorMsg = false;
    app.expired = false;
    app.disabled = true;
    if ($window.location.pathname == '/facebookerror') {
        app.errorMsg = 'Facebook a-mail not found in database';
    } else if ($window.location.pathname == '/facebook/inactive/error') {
        app.expired = true;
        app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.';
    } else {
        Auth.facebook($routeParams.token);
        $location.path('/about');
    }
})
.controller('twitterCtrl', function ($routeParams, Auth, $location, $window) {
    // Auth.facebook(token);
    var app = this;
    app.errorMsg = false;
    app.expired = false;
    app.disabled = true;
    if ($window.location.pathname == '/twittererror') {
        app.errorMsg = 'Twitter a-mail not found in database';
    } else if ($window.location.pathname == '/twitter/inactive/error') {
        app.expired = true;
        app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.';
    } else {
        Auth.facebook($routeParams.token);
        $location.path('/about');
    }
})
.controller('googleCtrl', function ($routeParams, Auth, $location, $window) {
    // Auth.facebook(token);
    var app = this;
    app.errorMsg = false;
    app.expired = false;
    app.disabled = true;
    if ($window.location.pathname == '/googleerror') {
        app.errorMsg = 'Google a-mail not found in database';
    } else if ($window.location.pathname == '/google/inactive/error') {
        app.expired = true;
        app.errorMsg = 'Account is not yet activated. Please check your e-mail for activation link.';
    } else {
        Auth.facebook($routeParams.token);
        $location.path('/about');
    }
});