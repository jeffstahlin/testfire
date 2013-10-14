'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp',
      ['myApp.config', 'myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'firebase']
   )

   // configure views; note the authRequired parameter for authenticated pages
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/view1', {
         templateUrl: 'partials/view1.html',
         controller: 'MyCtrl1'
      });

      $routeProvider.when('/view2', {
         templateUrl: 'partials/view2.html',
         controller: 'MyCtrl2'
      });

      $routeProvider.when('/account', {
         authRequired: true,
         templateUrl: 'partials/account.html',
         controller: 'AccountCtrl'
      });

      $routeProvider.when('/login', {
         templateUrl: 'partials/login.html',
         controller: 'LoginCtrl'
      });
      
      $routeProvider.when('/how_to_play', {
         templateUrl: 'partials/how_to_play.html',
         controller: 'HtpCtrl'
      });
      
      $routeProvider.when('/terms', {
         templateUrl: 'partials/terms.html',
         controller: 'trmCtrl'
      });
      
      $routeProvider.when('/quiz/:param1', {
         authRequired: true,
         templateUrl: 'partials/quiz.html',
         controller: 'quizCtrl'
      });
      
      $routeProvider.when('/quizzes', {
         authRequired: true,
         templateUrl: 'partials/quizzes.html',
         controller: 'quizzesCtrl'
      });

      $routeProvider.otherwise({redirectTo: '/login'});
   }])

   // double-check that the app has been configured
   .run(['FBURL', function(FBURL) {
      if( FBURL === 'https://INSTANCE.firebaseio.com' ) {
         angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
      }
   }])

   // establish authentication
   .run(['angularFireAuth', 'FBURL', '$rootScope', function(angularFireAuth, FBURL, $rootScope) {
      angularFireAuth.initialize(FBURL, {scope: $rootScope, name: "auth", path: '/login'});
      $rootScope.FBURL = FBURL;
   }]);