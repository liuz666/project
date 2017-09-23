var app = angular.module("myApp",["ui.router"]);/*创建模块*/
app.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){ /*配置路由，注入服务*/
    $urlRouterProvider.otherwise("/index");/*配置默认打开首页*/
    $stateProvider
        .state('submit',{
            url: 'submit',
            templateUrl: 'views/submit.html',
            controller: 'submitCtrl'
        })
        .state('ngModel',{
            url:'ngModel',
            templateUrl:'views/ngModel.html',
            controller:'ngModelCtrl'
        })
        .state('directive',{
            url:'directive',
            templateUrl:'views/directive.html',
            controller:'directiveCtrl'
        })
        .state('service',{
            url:'service',
            templateUrl:'views/service.html',
            controller:'serviceCtrl'
        })
}])