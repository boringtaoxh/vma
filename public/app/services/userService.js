angular
  .module('hshs').factory('userService', ['$rootScope', '$http', '$location', 'toaster', function ($rootScope, $http, $location, toaster) {
      var baseUrl = 'http://111.198.74.14:9190/user/';
      var userService = {};

      output = {
          login: function(user) {
              promise = $http({
                  method: 'POST',
                  url: baseUrl + 'login',
                  params: { account: user.account, password: user.password },
              }).success(function (response) {
                  if (response.code === 0) {
                    toaster.pop('success', '您已成功登录');
                    $location.path('/');
                    $rootScope.currentUser = response.data;
                    console.log($rootScope.currentUser);
                    $('#ModalLogin').modal('hide');
                  } else {
                    toaster.pop('warning', response.msg);
                  }
              }).error(function (data, status) {
                  toaster.pop('warning', '请稍后再试');
              });
              return promise;
          },
          logout: function(userId) {
            promise = $http({
              method: 'POST',
              url: baseUrl + 'logout',
              params: { userId: userId },
            }).success(function (response) {
              if (response.code === 0) {
                toaster.pop('success', '您已成功登出');
                $location.path('/');
                $rootScope.currentUser = '';
              } else {
                toaster.pop('warning', response.msg);
              }
            }).error(function (data, status) {
              toaster.pop('warning', '请稍后再试');
            });
            return promise;
          },
          register: function(user) {
            promise =  $http({
              method: 'POST',
              url: baseUrl + 'regist',
              params: {
                name: user.name,
                phone: user.phone,
                captcha: user.captcha,
                pwd: user.password,
                repwd: user.repassword
              }
            }).success(function (response) {
              if (response.code === 0) {
                toaster.pop('success', '您已成功注册');
                $location.path('/');
                $('#ModalSignup').modal('hide');
                $('#ModalLogin').modal('show');
              } else {
                toaster.pop('warning', response.msg);
              }
            }).error(function (data, status) {
              toaster.pop('warning', '请稍后再试');
            });
            return promise;
          },
          getCaptcha: function(user) {
            promise =  $http({
              method: 'POST',
              url: baseUrl + 'captcha',
              params: {
                phone: user.phone
              }
            }).success(function (response) {
              if (response.code === 0) {
                console.log(response);
                toaster.pop('success', '注册码已成功发送');
              } else {
                toaster.pop('warning', response.msg);
              }
            }).error(function (data, status) {
              toaster.pop('warning', '请稍后再试');
            });
            return promise;
          }
        };

      return output;
  }]);