'use strict';
var userLoginUrl = "http://192.168.1.107:8080/New_JXQ/user/login.do";

var registerUrl = "";
/**
 * Config for the router
 */


angular.module('app').service('requestService', function($http) {

  var baseUrl = "http://localhost:8888/jxnet/";

  var transFn = function(data) {
    return $.param(data);
  };
  var postCfg = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest: transFn
  };

  this.test = function($scope){
    var url = baseUrl + "school/getSchoolList.do";
    $http.get(url).success(function(data) {
        console.log(data);
        //$scope.xajx = data;
    });
  }
  this.userLogin = function($state,$rootScope,params){
    var url = baseUrl + "user/login.do";
    url = "http://localhost:8888/jxnet/userLogin.cu";

    /*$.ajax({
      url: url,
      type: 'POST',
      dataType: 'json',
      data: params,
      crossDomain: true,
      xhrFields: {
                  withCredentials: true
              }
    })
    .done(function(data) {
      console.log(data)
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });*/
    
    $http.post(url, params, postCfg)
    .then(function(response) {

      if (response.data.error) {
        $rootScope.authError = response.data.error;
      } else {
        $rootScope.isLogin = true;
        $rootScope.user = {
          type: 'user'
        }

        $state.go('index.portal');
      }
    }, function(x) {
      //$rootScope.isLogin = true;
      $rootScope.authError = 'Server Error';
    });
    
  }
  this.getPage = function($scope, pageId){
    var url = baseUrl + "school/getSchoolMessage.do";
    $http.post(url,{curPage: pageId},postCfg).success(function(data) {
        $scope.url = url;
        $scope.jxs = data.schools;
        var t = data.totalPage;

        $scope.totalPage = [];
        for (var i = 0; i < t; i++) {
          $scope.totalPage[i] = 0;
        };
    });
  }
  this.getJxList = function($scope){

    var url = baseUrl + "school/getSchoolList.do";
    $http.get(url).success(function(data) {
        console.log(data);
        $scope.xajx = data;
    });
  }

  this.getJxInfo = function($scope, jxId){
    var url = baseUrl + "school/getSchoolByID.do";
    $http.post(url,{schoolID: jxId},postCfg).success(function(data) {
        $scope.jx = data;
        $scope.myInterval = 5000;
        var slides = $scope.slides = [];
        $scope.addSlide = function(url) {
          slides.push({
            image: url
            // image: 'img/c' + slides.length + '.jpg'
            //text: ['Carousel text #0', 'Carousel text #1', 'Carousel text #2', 'Carousel text #3'][slides.length % 4]
          });
        };
        for (var i = 0; i < $scope.jx.carousel.length; i++) {
          $scope.addSlide($scope.jx.carousel[i]);
        }

        $scope.oneAtATime = true;
    });
  }


  this.addOrder = function($scope,params){
    var url = baseUrl + "order/addOrder.do";
    $.http(url,JSON.stringify(params),postCfg).success(function(data) {
        console.log(data);
    });
  }
});

angular.module('app')
  .run(
    ['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    ['$stateProvider', '$urlRouterProvider', '$httpProvider','JQ_CONFIG',
      function($stateProvider, $urlRouterProvider, $httpProvider, JQ_CONFIG) {
        
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $urlRouterProvider
          .otherwise('/index/portal');

        $stateProvider
          .state('index', {
            abstract: true,
            url: '/index',
            templateUrl: 'tpl/app.html',
            controller: function($scope,requestService) {

              requestService.getJxList($scope);


              $scope.logout = function(){
                requestService.test($scope);
              }

              /*$scope.xajx = [{
                schoolName: '锦志程驾校',
                id: '001'
              }, {
                schoolName: '华英驾校',
                id: '002'
              }];*/

              /*$scope.user = {
                type: 'user'
              }*/
            }
          })
          .state('index.portal', {
            url: '/portal',
            templateUrl: 'tpl/portal.html',
            controller: function($scope,requestService) {

              $scope.myInterval = 5000;
              var indexSlides = $scope.indexSlides = [];
              $scope.addSlide = function() {
                indexSlides.push({
                  //image: 'img/c' + indexSlides.length + '.jpg',
                  image: 'img/index_img_' + (indexSlides.length + 1) + '.png'
                    //text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][indexSlides.length % 4]
                });
              };
              for (var i = 0; i < 3; i++) {
                $scope.addSlide();
              }
            }
          })
          //西安所有驾校
          .state('index.xajx', {
            url: '/xajx/:pageId',
            templateUrl: 'tpl/jxList.html',
            controller: function($scope, $stateParams, $http, requestService) {
              var pageId = $stateParams.pageId;

              //TODO:用pageId 和区域("xa")请求某个页的所有驾校
              //一页先有16个驾校
              //
              requestService.getPage($scope,pageId);

              
              /*$scope.jxs = [{
                schoolName: '锦志程驾校',
                id: '001',
                localPrice: 2000,
                foreignPrice: 3000,
                discount: 30,
                orders: 45,
                indexPic: "http://..",
                intro: "西电 运动短裤男 "
              }, {
                schoolName: '华英驾校',
                id: '002',
                localPrice: 2500,
                foreignPrice: 3400,
                discount: 20,
                indexPic: "http://..",
                orders: 88,
                intro: "西电 西外 西工大 一条龙"
              }, {
                schoolName: '锦志程驾校',
                id: '003',
                localPrice: 2000,
                foreignPrice: 3000,
                discount: 30,
                orders: 45,
                indexPic: "http://..",
                intro: "西电 运动短裤男 "
              }, {
                schoolName: '华英驾校',
                id: '004',
                localPrice: 2500,
                foreignPrice: 3400,
                discount: 20,
                indexPic: "http://..",
                orders: 88,
                intro: "西电 西外 西工大 一条龙"
              }];*/

              //$scope.filteredJxs = [], $scope.currentPage = 1, $scope.numPerPage = 10, $scope.maxSize = 4;



              /*$scope.$watch("currentPage + numPerPage", function() {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage),
                  end = begin + $scope.numPerPage;

                $scope.filteredJxs = $scope.jxs.slice(begin, end);
              });*/
            }
          })

        //某个驾校主页,以ID区分
        .state('index.jx', {
            url: '/jx/:jxId',
            templateUrl: 'tpl/jxIndex.html',
            controller: function($scope, $stateParams,requestService) {
              var jxId = $stateParams.jxId;
              //根据驾校Id获取该驾校的详细信息
              requestService.getJxInfo($scope,jxId);



              /*$scope.jx = {
                name: '锦志程驾校',
                id: '001',
                localPrice: 2000,
                foreignPrice: 3000,
                discount: 30,
                orders: 45,
                carousel:[],
                phone: "18710847003",
                locate: '老校区附近',
                mapUrl: 'http://j.map.baidu.com/6gTq3',
                serviceSchool: '西电老校区 西电新校区',
                intro: "西电 运动短裤男 薄篮球中裤男士运动七分裤夏季棉裤透气跑步健身"
              }*/

            }
          })
          //某个驾校下单页面,以ID区分
          .state('index.order', {
            url: '/order/:jxId/:jxname',
            templateUrl: 'tpl/order.html',
            controller: function($scope, $stateParams, $http,requestService) {
              $scope.jxname = $stateParams.jxname;
              

              
              $scope.submitorder = function(){
                var params = {
                  schoolID: $stateParams.jxId,
                  userID: 7,
                  isLocal :$scope.isLocal,
                  contactName: $scope.contactName,
                  contactPhone : $scope.contactPhone
                }
              console.log(params);
                requestService.addOrder($scope,params);
              }

              
            }
          })

        //需要用户登录
        .state('index.profile', {
            url: '/profile',
            templateUrl: 'tpl/profile.html',
            controller: 'XeditableCtrl',
            resolve: {
              deps: ['$ocLazyLoad',
                function($ocLazyLoad) {
                  return $ocLazyLoad.load('xeditable').then(
                    function() {
                      return $ocLazyLoad.load('js/controllers/xeditable.js');
                    }
                  );
                }
              ]
            }
          })
          .state('index.myOrder', {
            url: '/myOrder/:userid',
            templateUrl: 'tpl/myOrder.html',
            controller: function($scope) {
              $scope.orders = [{
                id: '00',
                jxname: '华英驾校',
                jxid: '001',
                time: '2015-3-3',
                status: '未确认'
              }, {
                id: '01',
                jxname: 'xx驾校',
                jxid: '002',
                time: '2015-3-23',
                status: '已确认'
              }]
            }
          })

        //需要驾校登录,驾校管理页面
        .state('index.manager', {
            url: '/manager',
            templateUrl: 'tpl/manager.html'
          })
          .state('index.jxEdit', {
            url: '/jxEdit',
            templateUrl: 'tpl/jxEdit.html'
          })

        //需要管理员登录
        .state('index.admin', {
          url: '/admin/:userid',
          templateUrl: 'tpl/admin.html'
        })

        .state('access', {
            url: '/access',
            template: '<div ui-view class="fade-in-right-big smooth"></div>'
          })
          .state('access.userSignin', {
            url: '/userSignin',
            templateUrl: 'tpl/page_usersignin.html',
            controller: function($scope, $state, $rootScope,requestService) {
                $rootScope.user = {};
                $rootScope.authError = null;
                $scope.login = function() {
                  $rootScope.authError = null;
                  // Try to login



                  
                  //$state.go('index.portal');
                  //
                  /*$.ajax({
                    url: userLoginUrl,
                    type: 'POST',
                    dataType: 'JSON',
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    data: {
                      phone: $scope.user.phone,
                      password: $scope.user.password
                    }
                  })
                  .done(function(data) {
                    console.log(data);
                    $rootScope.isLogin = true;
                        $rootScope.user = {
                          type: 'user'
                        }
                    $state.go('index.portal');
                    console.log("success");
                  })
                  .fail(function() {
                    console.log("error");
                  })
                  .always(function() {
                    console.log("complete");
                  });*/
                  var params = {
                    phone: $scope.user.phone,
                    password: $scope.user.password
                  }
                  requestService.userLogin($state,$rootScope,params);

                  
                };
              }
              /*resolve: {
                  deps: ['uiLoad',
                    function( uiLoad ){
                      return uiLoad.load( ['js/controllers/signin.js'] );
                  }]
              }*/
          })
          .state('access.userSignup', {
            url: '/userSignup',
            templateUrl: 'tpl/page_usersignup.html',
            controller: function($scope, $http, $state) {
                $scope.user = {};
                $scope.authError = null;
                $scope.getSignupCodeError = null;
                $scope.gettingCode = false;

                $scope.getSignupCode = function() {

                  var timestamp;
                  console.log(timestamp);

                  $scope.gettingCode = true;
                  $http.post('api/getSignupCode', {
                      phone: $scope.user.phone,
                      timestamp: timestamp
                    })
                    .then(function(response) {
                      if (response.data.error) {
                        $scope.authError = response.data.error;
                      } else {

                        $state.go('index.portal');
                      }
                    }, function(x) {
                      $scope.getSignupCodeError = 'Server Error';
                    });

                };

                $scope.signup = function() {
                  $scope.authError = null;
                  // Try to create

                  $http.post('api/signup', {
                      phone: $scope.user.phone,
                      signupCode: $scope.user.signupCode,
                      password: $scope.user.password
                    })
                    .then(function(response) {
                      if (!response.data.user) {
                        $scope.authError = response;
                      } else {
                        $state.go('index.portal');
                      }
                    }, function(x) {
                      $scope.authError = 'Server Error';
                    });
                };
              }
              /*resolve: {
                  deps: ['uiLoad',
                    function( uiLoad ){
                      return uiLoad.load( ['js/controllers/signup.js'] );
                  }]
              }*/
          })
          .state('access.schoolSignin', {
            url: '/schoolSignin',
            templateUrl: 'tpl/page_schoolsignin.html',
            controller: function($scope, $http, $state) {
                $scope.user = {};
                $scope.authError = null;
                $scope.login = function() {
                  $scope.authError = null;
                  // Try to login
                  $http.post('api/login', {
                      phone: $scope.user.phone,
                      password: $scope.user.password
                    })
                    .then(function(response) {
                      if (!response.data.user) {
                        $scope.authError = '手机号或密码错误';
                      } else {
                        $state.go('index.portal');
                      }
                    }, function(x) {
                      $scope.authError = 'Server Error';
                    });
                };
              }
              /*resolve: {
                  deps: ['uiLoad',
                    function( uiLoad ){
                      return uiLoad.load( ['js/controllers/signin.js'] );
                  }]
              }*/
          })
          .state('access.schoolSignup', {
            url: '/schoolSignup',
            templateUrl: 'tpl/page_schoolsignup.html',
            controller: function($scope, $http, $state) {
                $scope.user = {};
                $scope.authError = null;
                $scope.getSignupCodeError = null;
                $scope.gettingCode = false;

                $scope.getSignupCode = function() {
                  var timestamp = new Date();
                  console.log(timestamp);

                  $scope.gettingCode = true;
                  $http.post('api/getSignupCode', {
                      phone: $scope.user.phone,
                      timestamp: timestamp
                    })
                    .then(function(response) {
                      if (!response.data.user) {
                        $scope.getSignupCodeError = response;
                      } else {

                        $state.go('index.portal');
                      }
                    }, function(x) {
                      $scope.getSignupCodeError = 'Server Error';
                    });

                };

                $scope.signup = function() {
                  $scope.authError = null;
                  // Try to create

                  $http.post('api/signup', {
                      phone: $scope.user.phone,
                      signupCode: $scope.user.signupCode,
                      password: $scope.user.password
                    })
                    .then(function(response) {
                      if (!response.data.user) {
                        $scope.authError = response;
                      } else {
                        $state.go('index.portal');
                      }
                    }, function(x) {
                      $scope.authError = 'Server Error';
                    });
                };
              }
              /*resolve: {
                  deps: ['uiLoad',
                    function( uiLoad ){
                      return uiLoad.load( ['js/controllers/signup.js'] );
                  }]
              }*/
          })
          .state('access.forgotpwd', {
            url: '/forgotpwd',
            templateUrl: 'tpl/page_forgotpwd.html'
          })
          .state('access.404', {
            url: '/404',
            templateUrl: 'tpl/page_404.html'
          })


      }
    ]
  );