'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
      $http.post('api/signup', {name: $scope.user.name, email: $scope.user.email, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = response;
        }else{
          $state.go('app.dashboard-v1');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
 ;

 // signup controller
app.controller('UserSignupFormController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.user = {};
    $scope.authError = null;
    $scope.getSignupCodeError = null;
    $scope.gettingCode = false;

    $scope.getSignupCode = function(){
      var timestamp = new Date();
      console.log(timestamp);

      $scope.gettingCode = true;
      $http.post('api/getSignupCode', {phone: $scope.user.phone,timestamp: timestamp})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.getSignupCodeError = response;
        }else{
          
          $state.go('index.portal');
        }
      }, function(x) {
        $scope.getSignupCodeError = 'Server Error';
      });

    };

    $scope.signup = function() {
      $scope.authError = null;
      // Try to create
      
      $http.post('api/signup', {phone: $scope.user.phone, signupCode: $scope.user.signupCode, password: $scope.user.password})
      .then(function(response) {
        if ( !response.data.user ) {
          $scope.authError = response;
        }else{
          $state.go('index.portal');
        }
      }, function(x) {
        $scope.authError = 'Server Error';
      });
    };
  }])
 ;