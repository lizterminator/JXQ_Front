'use strict';

/**
 * Config for the router
 */


angular.module('app').service('requestService', function($http) {

  var baseUrl = "http://192.168.137.1:8888/New_JXQ/";
  //var baseUrl = "http://192.168.1.113:8080/New_JXQ/";
  var transFn = function(data) {
    return $.param(data);
  };

  var postCfg = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    transformRequest: transFn
  };

  this.goSearch = function($state, keyword) {
    $state.go('index.searchResult', {
      keyword: keyword
    });
  };

  this.search = function($scope, keyword) {
    var url = baseUrl + "getSchoolByKeyWord.do";
    $http.post(url, {
        keyWord: keyword
      }, postCfg)
      .then(function(response) {
        $scope.searchResult = response.data.schools; ///////// 
        //$state.go('index.searchResult',{keyword:keyword});
      }, function(x) {
        console.log("Server Error");
      });
  };
  this.cancelOrder = function($scope, $state, orderId) {
    var url = baseUrl + "user/cancelOrder.do";
    $http.post(url, {
        orderID: orderId
      }, postCfg)
      .then(function(response) {
        var data = response.data;
        if (data.success) {
          alert(data.msg);
          $state.reload();
        } else {
          alert(data.msg);
        }
      }, function(x) {
        console.log("Server Error");
      });
  };
  this.getMyOrders = function($scope) {
    var url = baseUrl + "user/getOrders.do";
    $http.post(url, {}, postCfg)
      .then(function(response) {
        $scope.orders = response.data.orders;
      }, function(x) {
        console.log("Server Error");
        //$rootScope.authError = 'Server Error';
      });
  };
  this.getSchoolOrders = function($scope) {
    var url = baseUrl + "school/getOrders.do";
    $http.post(url, {}, postCfg)
      .then(function(response) {
        $('#datatables').dataTable({
          "data": response.data,
          "columns": [{
            "data": "name"
          }, {
            "data": "phone"
          }, {
            "data": "order_time"
          }, {
            "data": "local"
          }, {
            "data": "checked"
          }],
          "createdRow": function(row, data, dataIndex) {

            if (data.checked == '是') {
              $(row).addClass('bg');
            } else {
              $(row).addClass('bg'); //
            }
          },
          "order": [
            [2, "desc"]
          ]
        });


        $('#datatables tbody').on('click', 'tr', function() {

          var name = $(this)[0].cells[0].innerHTML;
          var phone = $(this)[0].cells[1].innerHTML;
          $('#contactMobile').val(phone);
          $('#contactName').val(name);
          // $scope.contactMobile = phone;
          // $scope.contactName = name;
          //console.log($scope.contactMobile,$scope.contactName);
        });
        console.log(response);
      });
  };

  this.checkOrder = function($scope, $state, params) {
    var url = baseUrl + "school/acceptOrder.do";
    $http.post(url, params, postCfg)
      .then(function(response) {
        alert(response.data.msg);
        $state.reload();
        //$scope.orders = response.orders;
      }, function(x) {
        //console.log("Server Error");
        $rootScope.authError = 'Server Error';
      });
  };

  this.getCheckCode = function($scope, $rootScope, mobile) {
    var url = baseUrl + "user/sendCheckCode.do";
    $http.post(url, {
        mobile: mobile
      }, postCfg)
      .then(function(response) {
        if (response.data.success) {
          alert("验证码已发送到您的手机，请注意查收！");
        } else {
          alert("获取验证码失败！");
        }

      }, function(x) {
        //$rootScope.isLogin = true;
        $rootScope.authError = 'Server Error';
      });

  };

  this.userRegister = function($scope, $rootScope, $state, params) {
    var url = baseUrl + "user/register.do";
    $http.post(url, params, postCfg)
      .then(function(response) {
        if (response.data.success) {
          alert(response.data.msg);
          $state.go("access.userSignin");
        } else {
          alert(response.data.msg);
        }

      }, function(x) {
        //$rootScope.isLogin = true;
        $rootScope.authError = 'Server Error';
      });
  };

  this.logout = function() {
    var type = JSON.parse(localStorage.getItem('jxq.user')).role;
    var url;
    if (type === 'user') {
      url = baseUrl + "user/logout.do";
    } else if (type === 'school') {
      var url = baseUrl + "school/logout.do";
    }

    $http.get(url).success(function(data) {
      console.log(data);
    });
  };

  this.schoolLogout = function() {
    var url = baseUrl + "school/logout.do";
    $http.get(url).success(function(data) {
      console.log(data);

    });
  }


  this.getUserInfo = function($scope) {
    var url = baseUrl + "user/getUserDetail.do";
    $http.get(url).success(function(data) {
      //console.log(data);
      $scope.detail = data;
    });
  };

  this.getSchoolInfo = function($scope) {

  };

  this.schoolLogin = function($state, $rootScope, params) {
    var url = baseUrl + "school/login.do";
    $http.post(url, params, postCfg)
      .then(function(response) {
        if (!response.data.success) {
          $rootScope.authError = response.data.msg;
        } else {
          $rootScope.isLogin = true;
          var user = $rootScope.user = {
            role: response.data.type,
            name: response.data.name,
            phone: response.data.phone
          }

          console.log(user);

          localStorage.setItem('jxq.user', JSON.stringify(user));
          console.log('login success');
          $state.go('index.portal');
        }
      }, function(x) {
        //$rootScope.isLogin = true;
        $rootScope.authError = 'Server Error';
      });
  };


  this.schoolRegister = function($scope, $rootScope, $state, params) {
    var url = baseUrl + "school/register.do";
    $http.post(
        /*{
              method: 'POST',
              url: url,
              data: JSON.stringify(params)
             }*/
        url, params, postCfg)
      .then(function(response) {
        console.log(response);
        $state.go('access.schoolSignin');
      }, function(x) {
        //$rootScope.isLogin = true;
        $rootScope.authError = 'Server Error';
      });
  };

  this.userLogin = function($state, $rootScope, params) {
    var url = baseUrl + "user/login.do";
    //var url = "http://localhost:8888/jxnet/userLogin.cu"
    $http.post(url, params, postCfg)
      .then(function(response) {
        if (!response.data.success) {
          $rootScope.authError = response.data.msg;
        } else {
          $rootScope.isLogin = true;
          var user = $rootScope.user = {
            role: response.data.type,
            phone: response.data.phone
          }

          localStorage.setItem('jxq.user', JSON.stringify(user));
          console.log('login success');
          $state.go('index.portal');
        }
      }, function(x) {
        console.log(x);
        //$rootScope.isLogin = true;
        $rootScope.authError = 'Server Error';
      });

  }
  this.getPage = function($scope, pageId) {
    var url = baseUrl + "school/getSchoolMessage.do";
    $http.post(url, {
      curPage: pageId
    }, postCfg).success(function(data) {
      $scope.url = url;
      $scope.jxs = data.schools;
      var t = data.totalPage;

      $scope.totalPage = [];
      for (var i = 0; i < t; i++) {
        $scope.totalPage[i] = 0;
      };
    });
  }
  this.getJxList = function($scope) {

    var url = baseUrl + "school/getSchoolList.do";
    //alert(url);
    ///var url = "http://localhost:8888/jxnet/getSchoolList.cu"
    $http.get(url).success(function(data) {
      //alert('succ');
      //alert(data);
      $scope.xajx = data;
    }).error(function(data) {
      //alert('fall');
      //alert(data.message);
    });;
  }

  this.getJxInfo = function($scope, jxId) {
    var url = baseUrl + "school/getSchoolByID.do";
    $http.post(url, {
      schoolID: jxId
    }, postCfg).success(function(data) {
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


  this.addOrder = function($scope, $state, params) {
    var url = baseUrl + "user/addOrder.do";

    $http.post(url, params, postCfg).success(function(data) {
      //$state.go();
      if (data.success) {
        alert(data.msg);
        $state.go('index.myOrder');
      } else {
        alert(data.msg);
      }
    }).error(function(data) {
      console.log(data);
      /* Act on the event */
    });;
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
    ['$stateProvider', '$urlRouterProvider', '$httpProvider', 'JQ_CONFIG',
      function($stateProvider, $urlRouterProvider, $httpProvider, JQ_CONFIG) {

        $httpProvider.defaults.withCredentials = true;
        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;



        $urlRouterProvider
          .otherwise('/index/portal');

        $stateProvider
          .state('index', {
            abstract: true,
            url: '/index',
            templateUrl: 'tpl/app.html',
            controller: function($scope, $rootScope, $state, $cookies, $cookieStore, requestService) {
              requestService.getJxList($scope);

              //console.log($cookies.mobile);
              //
              /*var user = $rootScope.user = JSON.parse(localStorage.getItem('jxq.user'));
              if(user){
                $rootScope.isLogin = true;

              }*/
              if ($cookies['mobile'] != null || $cookies['schoolCookie'] != null) {
                var user = $rootScope.user = JSON.parse(localStorage.getItem('jxq.user'));
                if (user)
                  $rootScope.isLogin = true;
              } else {
                //localStorage.removeItem('jxq.user');
                //$rootScope.user = {};
              }


              $rootScope.logout = function() {
                requestService.logout();
                localStorage.removeItem('jxq.user');

                $rootScope.isLogin = false;
                $rootScope.user = {};
                $state.reload();
              }

              $rootScope.goSearch = function() {
                var keyword = $('#keyword').val();
                requestService.goSearch($state, keyword);
              }
            }
          })
          .state('index.searchResult', {
            url: '/search/:keyword',
            templateUrl: 'tpl/searchResult.html',
            controller: function($scope, $stateParams, requestService) {
              var keyword = $stateParams.keyword;
              requestService.search($scope, keyword);
            }
          })
          .state('index.portal', {
            url: '/portal',
            templateUrl: 'tpl/portal.html',
            controller: function($scope, requestService) {

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
              requestService.getPage($scope, pageId);



            }
          })

        //某个驾校主页,以ID区分
        .state('index.jx', {
            url: '/jx/:jxId',
            templateUrl: 'tpl/jxIndex.html',
            controller: function($scope, $stateParams, requestService) {
              var jxId = $stateParams.jxId;
              //根据驾校Id获取该驾校的详细信息
              requestService.getJxInfo($scope, jxId);

              /*$scope.jx = {"id":10,"name":"妹妹驾校",
              "localPrice":0,"foreignPrice":0,
              "otherPrice": 15,
              "passRateOne":30,
              "durationOne":20,
              "durationTwo":20,
              "passRateTwo":30,
              "durationThree":20,
              "passRateThree":30,
              "durationFour":20,
              "teacherResource": "我是师资力量",
              "hardwareResource": "我是硬件资源",
              "passRateFour":30,
              "orders":5,"phone":18710847003,"locate":"美的","mapUrl":"http://j.map.baidu.com/6gTq3","serviceSchool":"西电","intro":"期末不挂科！","carousel":["http://7xjb60.com1.z0.glb.clouddn.com/b0.jpg?imageView2/1/w/200/h/100","http://7xjb60.com1.z0.glb.clouddn.com/b1.jpg?imageView2/1/w/200/h/100","http://7xjb60.com1.z0.glb.clouddn.com/b2.jpg?imageView2/1/w/200/h/100"]};
*/
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
            controller: function($scope, $rootScope, $state, $stateParams, $http, requestService) {
              $scope.jxname = $stateParams.jxname;



              $scope.submitorder = function() {
                $('#submitOrder').prop('disabled', 'disabled');

                if ($rootScope.isLogin && $rootScope.user.role === "user") {

                  var params = {
                      schoolID: $stateParams.jxId,
                      //userID: ,
                      isLocal: $scope.isLocal,
                      contactName: $scope.contactName,
                      contactMobile: $scope.contactPhone
                    }
                    // console.log(params);
                  requestService.addOrder($scope, $state, params);
                }else{
                  alert("请先登陆哦！");
                  $state.go('access.userSignin');
                }
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
                  return $ocLazyLoad.load('xeditable').then(function() {
                    return $ocLazyLoad.load('js/controllers/xeditable.js');
                  });
                }
              ]
            }
          })
          .state('index.myOrder', {
            url: '/myOrder',
            templateUrl: 'tpl/myOrder.html',
            controller: function($scope, $state, $stateParams, requestService) {

              //var userId = $stateParams.userid;
              requestService.getMyOrders($scope, $state);

              $scope.cancelOrder = function(index) {
                var orderId = $scope.orders[index].orderID;
                requestService.cancelOrder($scope, $state, orderId);
              };
            }
          })

        //需要驾校登录,驾校管理页面
        .state('index.manager', {
            url: '/manager',
            templateUrl: 'tpl/manager.html',
            controller: function($scope, $state, requestService) {
              requestService.getSchoolOrders($scope);
              /*$scope.check ={};
              $scope.contactMobile = "";
              $scope.contactName = "";*/
              $scope.checkOrder = function() {
                requestService.checkOrder($scope, $state, {
                  contactMobile: $('#contactMobile').val(),

                  contactName: $('#contactName').val(),
                  orderNumber: $('#orderNumber').val()
                })
              }


            }
          })
          .state('index.jxEdit', {
            url: '/schoolPublish',
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
            controller: function($scope, $state, $timeout, $cookies, $cookieStore, $rootScope, requestService) {
                $rootScope.user = {};
                $rootScope.authError = null;
                $scope.login = function() {
                  $rootScope.authError = null;
                  // Try to login

                  var params = {
                    phone: $scope.login.phone,
                    password: $scope.login.password
                  }
                  console.log(params);
                  requestService.userLogin($state, $rootScope, params);


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
            controller: function($scope, $rootScope, $http, $state, requestService) {
              $scope.user = {};
              $scope.authError = null;
              $scope.getSignupCodeError = null;
              $scope.gettingCode = false;

              $scope.getSignupCode = function() {


                requestService.getCheckCode($scope, $rootScope, $scope.user.phone);

              };

              $scope.signup = function() {
                //$scope.authError = null;
                // Try to create
                requestService.userRegister($scope, $rootScope, $state, {
                  mobile: $scope.user.phone,
                  checkCode: $scope.user.signupCode,
                  password: $scope.user.password
                });
                /* $http.post('api/signup', {
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
                   });*/
              };
            }

          })
          .state('access.schoolSignin', {
            url: '/schoolSignin',
            templateUrl: 'tpl/page_schoolsignin.html',
            controller: function($scope, $http, $state, $rootScope, requestService) {

                $scope.user = {};
                $scope.authError = null;
                $scope.signin = function() {
                  var params = {
                    phone: $scope.user.phone,
                    password: $scope.user.password
                  }
                  requestService.schoolLogin($state, $rootScope, params);
                }
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
            controller: function($scope, $http, $rootScope, $state, requestService) {
              $scope.user = {};
              $scope.authError = null;
              $scope.getSignupCodeError = null;
              $scope.gettingCode = false;



              $scope.signup = function() {
                var params = {
                  mobile: $scope.user.phone,
                  schoolName: $scope.user.schoolName,
                  password: $scope.user.password
                };

                requestService.schoolRegister($scope, $rootScope, $state, params);
              }

              /*$scope.getSignupCode = function() {
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

              };*/

              /*$scope.signup = function() {
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
              }*/
              /*resolve: {
                  deps: ['uiLoad',
                    function( uiLoad ){
                      return uiLoad.load( ['js/controllers/signup.js'] );
                  }]*/
            }
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