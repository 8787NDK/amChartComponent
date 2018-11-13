var app = angular.module('candleStickModule', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('/', {
        url: '/candleStick-default',
        templateUrl: 'components/candleStick-Component/candleStick-Component.html',
        controller: 'candleStick-Controller'
    }).state('/candleStick-custom', {
        url: '/candleStick-custom',
        templateUrl: 'components/candleStick-Customized-Component/candleStick-Component.html',
        controller: 'candleStick-Customized-Controller'
    })
    ;
    
    $urlRouterProvider.otherwise('/candleStick-default');
}); 