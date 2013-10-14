'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
   .controller('MyCtrl1', ['$scope', 'FBURL', 'angularFire', function($scope, FBURL, angularFire) {
      angularFire(FBURL+'/syncedValue', $scope, 'syncedValue', '');
   }])

  .controller('MyCtrl2', ['$scope', 'FBURL', 'Firebase', 'angularFireCollection', function($scope, FBURL, Firebase, angularFireCollection) {
      $scope.newMessage = null;

      // constrain number of messages by passing a ref to angularFire
      var ref = new Firebase(FBURL+'/messages').limit(10);
      // add the array into $scope
      $scope.messages = angularFireCollection(ref);

      // add new messages to the list
      $scope.addMessage = function() {
         if( $scope.newMessage ) {
            $scope.messages.add({text: $scope.newMessage});
            $scope.newMessage = null;
         }
      };
   }])

   .controller('LoginCtrl', ['$scope', 'loginService', function($scope, loginService) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(callback) {
         $scope.err = null;
         loginService.login($scope.email, $scope.pass, '/quizzes', function(err, user) {
            $scope.err = err||null;
            typeof(callback) === 'function' && callback(err, user);
         });
      };

      $scope.createAccount = function() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         else {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function(err) {
                     if( !err ) {
                        loginService.createProfile(user.id, user.email);
                     }
                  });
               }
            });
         }
      };
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'angularFire', 'FBURL', '$timeout', function($scope, loginService, angularFire, FBURL, $timeout) {

      angularFire(FBURL+'/users/'+$scope.auth.id, $scope, 'user', {});

      $scope.logout = function() {
         loginService.logout('/login');
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      function reset() {
         $scope.err = null;
         $scope.msg = null;
      }

      $scope.updatePassword = function() {
         reset();
         loginService.changePassword(buildPwdParms());
      };

      $scope.$watch('oldpass', reset);
      $scope.$watch('newpass', reset);
      $scope.$watch('confirm', reset);

      function buildPwdParms() {
         return {
            email: $scope.auth.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.msg = 'Password updated!';
               }
            }
         }
      }
    }])
      
    .controller('quizCtrl', ['$scope', 'angularFire', 'FBURL', '$routeParams', '$timeout', function($scope, angularFire, FBURL, $routeParams, $timeout) {
      var quizname = $routeParams.param1;

      var jsonQuiz = quizname.toLowerCase();
      
      $scope.quizzes = [];
      angularFire(FBURL+'/quiz/'+jsonQuiz+'/', $scope, "quiz");
      $scope.addQuiz = function(e) {
        if (e.keyCode != 13) return;
        $scope.quizzes.push({image: $scope.image, title: $scope.title});
        $scope.quiz = "";
      }
      
      $scope.counter = 0;
      $scope.onTimeout = function(){
          $scope.counter++;
          mytimeout = $timeout($scope.onTimeout,1000);
      }
      var mytimeout = $timeout($scope.onTimeout,1000);
      
      $scope.stop = function(){
          $timeout.cancel(mytimeout);
      }
    }])
    
    .controller('quizzesCtrl', ['$scope', 'angularFire', 'FBURL', function($scope, angularFire, FBURL) {
      $scope.quizzes = [];
      angularFire(FBURL+'/quizzes/', $scope, "quizzes");
      $scope.addQuiz = function(e) {
        if (e.keyCode != 13) return;
        $scope.quizzes.push({image: $scope.image, title: $scope.title});
        $scope.quiz = "";
      }
    }]);
    ;