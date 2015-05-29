'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG) {
          
          $urlRouterProvider
              .otherwise('/index/xajx/001');

          $stateProvider
              .state('index', {
                  abstract: true,
                  url: '/index',
                  templateUrl: 'tpl/app.html',
                  controller: function($scope){
                    $scope.xajx = [{
                      schoolName: '锦志程驾校',
                      id: '001'
                    },{
                      schoolName: '华英驾校',
                      id: '002'
                    }];
                    
                  }
              })
              .state('index.portal',{
                url: '/portal',
                templateUrl: 'tpl/portal.html',
                controller: function($scope){
                   $scope.myInterval = 5000;
                    var indexSlides = $scope.indexSlides = [];
                    $scope.addSlide = function() {
                      indexSlides.push({
                        //image: 'img/c' + indexSlides.length + '.jpg',
                        image: 'img/index_img_' + (indexSlides.length+1) + '.png'
                        //text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][indexSlides.length % 4]
                      });
                    };
                    for (var i=0; i<3; i++) {
                      $scope.addSlide();
                    }
                }
              })
              //西安所有驾校
              .state('index.xajx', {
                  url: '/xajx/:pageId',
                  templateUrl: 'tpl/jxList.html',
                  controller: function($scope,$stateParams){
                    var pageId = $stateParams.pageId;

                    //TODO:用pageId 和区域("xa")请求某个页的所有驾校
                    //一页先有16个驾校
                    $scope.jxs = [{
                      schoolName: '锦志程驾校',
                      id: '001',
                      localPrice: 2000,
                      foreignPrice: 3000,
                      discount: 30,
                      orders: 45,
                      indexPic: "http://..",
                      intro: "西电 运动短裤男 "
                    },{
                      schoolName: '华英驾校',
                      id: '002',
                      localPrice: 2500,
                      foreignPrice: 3400,
                      discount: 20,
                      indexPic: "http://..",
                      orders: 88,
                      intro: "西电 西外 西工大 一条龙"
                    },{
                      schoolName: '锦志程驾校',
                      id: '003',
                      localPrice: 2000,
                      foreignPrice: 3000,
                      discount: 30,
                      orders: 45,
                      indexPic: "http://..",
                      intro: "西电 运动短裤男 "
                    },{
                      schoolName: '华英驾校',
                      id: '004',
                      localPrice: 2500,
                      foreignPrice: 3400,
                      discount: 20,
                      indexPic: "http://..",
                      orders: 88,
                      intro: "西电 西外 西工大 一条龙"
                    }];

                    $scope.filteredJxs = []
                    ,$scope.currentPage = 1
                    ,$scope.numPerPage = 10
                    ,$scope.maxSize = 4;



                    $scope.$watch("currentPage + numPerPage", function() {
                      var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                      , end = begin + $scope.numPerPage;

                      $scope.filteredJxs = $scope.jxs.slice(begin, end);
                    });
                  }
              })
              
              //某个驾校主页,以ID区分
              .state('index.jx', {
                  url: '/jx/:jxId',
                  templateUrl: 'tpl/jxIndex.html',
                  controller: function($scope,$stateParams){
                    var jxId = $stateParams.jxId;
                    //根据驾校Id获取该驾校的详细信息
                    //
                    $scope.jx = {
                      name: '锦志程驾校',
                      id: '001',
                      localPrice: 2000,
                      foreignPrice: 3000,
                      discount: 30,
                      orders: 45,
                      phone: "18710847003",
                      locate: '老校区附近',
                      mapUrl: 'http://j.map.baidu.com/6gTq3',
                      serviceSchool: '西电老校区 西电新校区',
                      intro: "西电 运动短裤男 薄篮球中裤男士运动七分裤夏季棉裤透气跑步健身"                       
                    }

                    $scope.myInterval = 5000;
                    var slides = $scope.slides = [];
                    $scope.addSlide = function() {
                      slides.push({
                        image: 'img/c' + slides.length + '.jpg',
                        text: ['Carousel text #0','Carousel text #1','Carousel text #2','Carousel text #3'][slides.length % 4]
                      });
                    };
                    for (var i=0; i<3; i++) {
                      $scope.addSlide();
                    }


                    $scope.oneAtATime = true;

    

    

                  }
              })
              //某个驾校下单页面,以ID区分
              .state('index.order', {
                  url: '/order/:jxId/:jxname',
                  templateUrl: 'tpl/order.html',
                  controller:function ($scope,$stateParams,$http){
                      $scope.jxname = $stateParams.jxname; 
                      //$scope.ordercontactname='fff';
                      var post = {
                        name:$scope.ordercontactname
                      }
                      console.log($scope.ordercontactname);
                      // $http('post', 'url/', post, function(status, response){
                      //   // success
                      // }, function(status, response){
                      //   // error
                      // });
                  }
              })

              //需要用户登录
              .state('index.profile', {
                  url: '/profile/:userid',
                  templateUrl: 'tpl/profile.html',
                  controller: 'XeditableCtrl',
                  resolve: {
                      deps: ['$ocLazyLoad',
                        function( $ocLazyLoad ){
                          return $ocLazyLoad.load('xeditable').then(
                              function(){
                                  return $ocLazyLoad.load('js/controllers/xeditable.js');
                              }
                          );
                      }]
                  }
              })
              .state('index.myOrder', {
                  url: '/myOrder/:userid',
                  templateUrl: 'tpl/myOrder.html',
                  controller:function ($scope){
                    $scope.orders=[{
                      id:'00',
                      jxname:'华英驾校',
                      jxid:'001',
                      time:'2015-3-3',
                      status:'未确认'
                    },
                    { id:'01',
                      jxname:'xx驾校',
                      jxid:'002',
                      time:'2015-3-23',
                      status:'已确认'}]
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
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.userSignup', {
                  url: '/userSignup',
                  templateUrl: 'tpl/page_usersignup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signup.js'] );
                      }]
                  }
              })
              .state('access.schoolSignin', {
                  url: '/schoolSignin',
                  templateUrl: 'tpl/page_schoolsignin.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signin.js'] );
                      }]
                  }
              })
              .state('access.schoolSignup', {
                  url: '/schoolSignup',
                  templateUrl: 'tpl/page_schoolsignup.html',
                  resolve: {
                      deps: ['uiLoad',
                        function( uiLoad ){
                          return uiLoad.load( ['js/controllers/signup.js'] );
                      }]
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
