var app = angular.module('root', []);

app.service("passDataService", function($rootScope){
  this.tempData = "";

  this.setData = function (data) {
    this.tempData = data;
    $rootScope.$emit("dataPassEvent");
  }

  this.getData = function () {
    return this.tempData;
  }
});

app.controller('employeeAddCtrl', function($scope, $http, passDataService, passDataService) {
  $scope.submit = function () {
    var data = {
      first_name : $scope.first_name,
      last_name: $scope.last_name,
      address: $scope.address,
      age: $scope.age,
      email: $scope.email
    };
    $http.post("http://127.0.0.1:8000/api/v1/employee-list/", data)
    .then(function(response) {
      passDataService.setData(response.data);
    });
  }
});

app.controller('employeeListCtrl', function($scope, $http, $rootScope, passDataService) {
  $rootScope.$on("dataPassEvent",function() {
    var prevData = $scope.employeeList;
    prevData.push(passDataService.getData());
    $scope.employeeList = prevData;
  })
  $http.get("http://127.0.0.1:8000/api/v1/employee-list/")
  .then(function(response) {
      $scope.employeeList = response.data;
  });

  $scope.delete = function($id) {
    $http.delete('http://127.0.0.1:8000/api/v1/employee-detail/'+$id+'/').then(function (response) {
      const afterDeletedList = $scope.employeeList.filter(x => x.id != $id);
      $scope.employeeList = afterDeletedList;
      })
  }
});
