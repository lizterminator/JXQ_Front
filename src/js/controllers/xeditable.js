app.controller('XeditableCtrl', ['$scope', '$filter', '$http', 'editableOptions', 'editableThemes','requestService',
  function($scope, $filter, $http, editableOptions, editableThemes, requestService) {
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';

    requestService.getUserInfo($scope);

   /* $scope.detail = {
      tel: '13155648879',
      name: 'dd',
      pwd: '********',
      wechat: 'Awesome user \ndescription!',
      place: '外地',
      gender: '男',
      age: 14,
      des: 'dfdffdfd',
      remember: false
    };*/

    $scope.statuses = [{
      value: 1,
      text: '本地'
    }, {
      value: 2,
      text: '外地'
    }, ];

    $scope.gender = [{
      value: 1,
      text: '男'
    }, {
      value: 2,
      text: '女'
    }];

    /*$scope.showStatus = function() {
      var selected = $filter('filter')($scope.statuses, {
        value: $scope.detail.status
      });
      return ($scope.detail.status && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showAgenda = function() {
      var selected = $filter('filter')($scope.gender, {
        value: $scope.detail.gender
      });
      return ($scope.detail.gender && selected.length) ? selected[0].text : 'Not set';
    };*/

    $scope.saveUser = function() {

      //$scope.user not updated yet
      console.log($scope.detail.phone);
      console.log($scope.detail.age);
      console.log($scope.detail.weChat)
      //requestService.saveUser();
      /*angular.extend(data, {
        id: id
      });*/
      // return $http.post('api/saveUser', data);
    };


  }
]);