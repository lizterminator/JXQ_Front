app.controller('XeditableCtrl', ['$scope','$rootScope','$filter', '$http', 'editableOptions', 'editableThemes', 
  function($scope, $rootScope, $filter, $http, editableOptions, editableThemes){
    editableThemes.bs3.inputClass = 'input-sm';
    editableThemes.bs3.buttonsClass = 'btn-sm';
    editableOptions.theme = 'bs3';
    var transFn = function(data) {
        return $.param(data);
      };

      var postCfg = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        transformRequest: transFn
      };

      $http.post('user/getUserDetail.do',{},postCfg).success(function(data){
        $scope.info = data;
      });
   /* $scope.info = {
      phone: '18710847003',
      agenda: "1",
      age: "32",
      weChat: '尼玛',
      isLocal:"2"
    };*/
    


    $scope.statuses = [
      {value: '1', text: '本地'},
      {value: '2', text: '外地'}
    ];

    $scope.agenda = [
      {value: '1', text: '男'},
      {value: '2', text: '女'}
    ];

    $scope.showStatus = function() {
      var selected = $filter('filter')($scope.statuses, {value: $scope.info.isLocal});
      return ($scope.info.isLocal && selected.length) ? selected[0].text : 'Not set';
    };

    $scope.showAgenda = function() {
      var selected = $filter('filter')($scope.agenda, {value: $scope.info.agenda});
      return ($scope.info.agenda && selected.length) ? selected[0].text : 'Not set';
    };


    $scope.saveUser = function(data, id) {
      console.log($scope.info);
      $http.post("user/updateUser.do",{
        id: $rootScope.user.uid,
        agenda: $scope.info.agenda,
        age: $scope.info.age,
        weChat: $scope.info.weChat,
        isLocal: $scope.info.isLocal
        
      },postCfg).success(function(data){
        console.log(data);
      });
    };

   

}]);
