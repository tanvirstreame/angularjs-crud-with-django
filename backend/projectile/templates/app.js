var app = angular.module('root', []);


app.controller('employeeAddCtrl', function($scope, $http) {
    $scope.submit = function () {
      $http.get("http://127.0.0.1:8000/api/v1/employee-list/")
      .then(function(response) {
          $scope.employeeList = response.data;
          $log.info("data",response);
          console.log("data",response.data);
      });
      console.log("firstname",$scope.firstname);
    }
});

app.controller('employeeListCtrl', function($scope, $http) {
  $http.get("http://127.0.0.1:8000/api/v1/employee-list/")
  .then(function(response) {
      $scope.employeeList = response.data;
      $log.info("data",response);
      console.log("data",response.data);
  });
});
