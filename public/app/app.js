angular.module('userApp', [
    'appRoutes',
    'userControllers',
    'userServices',
    'ngAnimate',
    'mainController',
    'authServices',
    'emailControllers',
    'managementController'
]).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});