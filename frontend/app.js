var app = angular.module('root', []);


app.controller('employeeAddCtrl', function($scope, $http) {
    $scope.submit = function () {
      var data = {
        first_name : $scope.first_name,
        last_name: $scope.last_name,
        address: $scope.address,
        age: $scope.age,
        email: $scope.email
      }
      console.log("data",data);
      $http.post("http://127.0.0.1:8000/api/v1/employee-list/", data)
      .then(function(response) {
          console.log("data",response.data);
      });
    }
});

app.controller('employeeListCtrl', function($scope, $http) {
  $http.get("http://127.0.0.1:8000/api/v1/employee-list/")
  .then(function(response) {
      $scope.employeeList = response.data;
  });
});
