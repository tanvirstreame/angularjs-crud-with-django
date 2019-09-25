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

app.service("editDataService", function($rootScope){
  this.tempData = {};
  this.mode= "";

  this.setData = function (data) {
    this.tempData = data;
    $rootScope.$emit("editDataEvent");
  }

  this.getData = function () {
    return this.tempData;
  }
});

app.controller('employeeAddCtrl', function($scope, $rootScope, $http, passDataService, editDataService) {
  $rootScope.$on("editDataEvent", function(){
    const editData = editDataService.getData();
    $scope.first_name = editData.first_name;
    $scope.last_name = editData.last_name;
    $scope.address = editData.address;
    $scope.age = editData.age;
    $scope.email = editData.email;
    $scope.buttonText = "Edit";
    $scope.modeText = "Edit";
  })
  $scope.buttonText = "Add";
  $scope.modeText = "Add";
  $scope.submit = function () {
    var data = {
      first_name : $scope.first_name,
      last_name: $scope.last_name,
      address: $scope.address,
      age: $scope.age,
      email: $scope.email
    };

    if($scope.modeText==="Add") {
      $http.post("http://127.0.0.1:8000/api/v1/employee-list/", data)
      .then(function(response) {
        passDataService.setData(response.data);
      });
    }

    if($scope.modeText==="Edit") {
      const editId = editDataService.getData().id;
      $http.patch("http://127.0.0.1:8000/api/v1/employee-detail/"+editId+"/", data)
      .then(function(response) {
        console.log(response);
      });
    }
  }
});

app.controller('employeeListCtrl', function($scope, $http, $rootScope, passDataService, editDataService) {
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

  $scope.edit = function($id) {
    const obj = $scope.employeeList.find(x => x.id === $id);
    editDataService.setData(obj);
  }


});
