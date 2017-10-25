angular.module('mainController', [
	'authServices', 
	'userServices'
])
	// Controller maiCtrl is used to handle login and main index functions (stuff that should run on every page)
	.controller('mainCtrl', function (Auth, $timeout, $location, $rootScope, $window, $interval, $route, User, AuthToken) {
		var app = this;

		app.loadme = false; //Hide main HTML until data is obtained in AngularJS
		app.checkSession = function () {
			if (Auth.isLoggedIn()) {
				app.checkingSession = true;
				var interval = $interval(function () {
					var token = $window.localStorage.getItem('token');
					if (token === null) {
						$interval.cancel(interval);
					} else {
						self.parseJwt = function (token) {
							var base64Url = token.split('.')[1];
							var base64 = base64Url.replace('-', '+').replace('_', '/');
							return JSON.parse($window.atob(base64));
						}
						var expireTime = self.parseJwt(token);
						var timeStamp = Math.floor(Date.now() / 1000);
						var timeCheck = expireTime.exp - timeStamp;
						if (timeCheck <= 25) {
							$interval.cancel(interval);
							showModal(1);
						} else {
							console.log('token not yet expired');
						}
					}
				}, 2000);
			}
		};

		app.checkSession();

		var showModal = function (option) {
			app.choiceMade = false;
			app.modalHeader = undefined;
			app.modalBody = undefined;
			app.hideButton = false;
			if (option === 1) {
				app.modalHeader = 'Timeout Warning';
				app.modalBody = 'Your session will expired in 5 minutes. Would you like to renew your session?';
				$('#myModal').modal({backdrop: "static"});
			} else if (option === 2) {
				app.hideButton = true;
				app.modalHeader = 'Logging out';
				$('#myModal').modal({backdrop: "static"});
				$timeout(function () {
					Auth.logout();
					$location.path('/');
					hideModal();
					$route.reload();
				}, 2000)
			}
			$timeout(function () {
				if (!app.choiceMade) {
					hideModal();
				}
			}, 4000);
			
		};

		app.renewSession = function () {
			app.choiceMade = true;
			User.renewSession(app.username).then(function (data) {
				if (data.data.success) {
					AuthToken.setToken(data.data.token);
					app.checkSession();
				} else {
					app.modalBody = data.data.message;
				}
			});
			hideModal();
		};

		app.endSession = function () {
			app.choiceMade = true;
			hideModal();
			$timeout(function () {
				showModal(2);
			}, 1000)
		};

		var hideModal = function () {
			$('#myModal').modal('hide');
		}

		// Will run code every time a route changes
		$rootScope.$on('$routeChangeStart', function () {
			
			if (!app.checkSession) app.checkingSession();
			
			// Check if user is logged in
			if (Auth.isLoggedIn()) {
				app.isLoggedIn = true;

				//  Custom function to retrieve user data
				Auth.getUser().then(function (data) {
					app.username = data.data.username;
					app.useremail = data.data.email;

					User.getPermission().then(function (data) {
						if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
							app.loadme = true;
							app.authorized = true;
						} else {
							app.loadme = true;
						}
					});
				});
			} else {
				app.isLoggedIn = false;
				app.username = "";
				app.loadme = true;
			}
			if ($location.hash() == '_=_') $location.hash(null);
		});

		this.facebook = function () {
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
		}

		this.twitter = function () {
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
		}

		this.google = function () {
			app.disabled = true;
			$window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
		}

		this.doLogin = function (loginData) {
			app.errorMsg = false;
			app.loading = false;
			app.expired = false;
			app.disabled = true;
			Auth.login(app.loginData).then(function (data) {
				if (data.data.success) {
					app.loading = false;
					app.successMsg = data.data.message + '...Readirecting';
					$timeout(function () {
						$location.path('/about');
						app.loginData = '';
						app.successMsg = false;
						app.disabled = false;
						app.checkSession();

					}, 2000)
				} else {
					if (data.data.expired) {
						// Create an error message
						app.expired = true;
						app.loading = false;
						app.errorMsg = data.data.message;
					} else {
						// Create an error message
						app.disabled = true;
						app.loading = false;
						app.errorMsg = data.data.message;
					}
				}
			});
		};

		this.logout = function () {
			showModal(2);
		}
	});