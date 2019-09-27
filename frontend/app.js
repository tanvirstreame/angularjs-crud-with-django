var app = angular.module('root', ["ngRoute"]);

app.config(["$routeProvider", function($routeProvider){
  $routeProvider
  .when('/filter', {
    templateUrl: "views/filter.html"
  }).when("/home",{
    templateUrl: "views/home.html"
  }).otherwise({
    redirectTo: '/home'
  })

}])

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

  let formError = {
    first_name : "",
    last_name: "",
    address: "",
    age: "",
    email:""
  }

  $scope.backToAdd = function() {
    ["first_name", "last_name", "address", "age", "email"].forEach(key => {
      $scope[key] = "";
      formError[key] = "";
    });

    $scope.buttonText = "Add";
    $scope.modeText = "Add";
  }

  $scope.submit = function () {
    let data = {
      first_name : $scope.first_name,
      last_name: $scope.last_name,
      address: $scope.address,
      age: $scope.age,
      email: $scope.email
    };

    let valid = true;
    angular.forEach(data, function (value, key) {
      if(data[key] === "" || data[key] === null || data[key] === undefined) {
        formError[key] = "This field can not be blank";
        valid = false
      }
    });

    $scope.formError = formError;

    if($scope.modeText === "Add" && valid) {
      $http.post("http://127.0.0.1:8000/api/v1/employee-list/", data)
      .then(function(response) {
        passDataService.setData(response.data);
        ["first_name", "last_name", "address", "age", "email"].forEach(key => {
          $scope[key] = "";
        });
        swal("Saved Successfully!", "", "success", {
          button: "ok",
        });
      });
    }

    if($scope.modeText=== "Edit" && valid) {
      const editId = editDataService.getData().id;
      $http.patch("http://127.0.0.1:8000/api/v1/employee-detail/"+editId+"/", data)
      .then(function(response) {
        editDataService.setData({...data, id: editId});
        swal("Updated Successfully!", "", "success", {
          button: "ok",
        });
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

  $rootScope.$on("editDataEvent",function() {
    const prevData = $scope.employeeList;
    const editId = editDataService.getData().id;
    const index = $scope.employeeList.findIndex(x => x.id === editId);
    prevData[index] = editDataService.getData();
    $scope.employeeList = prevData;
  })

  $http.get("http://127.0.0.1:8000/api/v1/employee-list/")
  .then(function(response) {
      $scope.employeeList = response.data;
  });

  $scope.delete = function($id) {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        $http.delete('http://127.0.0.1:8000/api/v1/employee-detail/'+$id+'/').then(function (response) {
        const afterDeletedList = $scope.employeeList.filter(x => x.id != $id);
        $scope.employeeList = afterDeletedList;
      })
        swal("Deleted Successfully", {
          icon: "success",
        });
      } else {
        swal("Not deleted");
      }
    });

  }

  $scope.edit = function($id) {
    const obj = $scope.employeeList.find(x => x.id === $id);
    editDataService.setData(obj);
  }
});

app.controller('filterCTRL', function($scope, $http) {
  $http.get("http://127.0.0.1:8000/api/v1/employee-list/")
  .then(function(response) {
      $scope.employeeList = response.data;
  });

});


app.directive('employeeForm', [function(){
  return {
    restrict: "E",
    templateUrl: "views/forms/EmployeeDetailForm.html"
  }
}]);

app.directive("doubleClick", ["editDataService",function(editDataService){
  return {
    restrict: "A",
    link: function(scope, element, attr) {
      element.on('dblclick', function (event) {
        editDataService.setData(JSON.parse(attr.doubleClick));
      })
    }
  }
}]);
