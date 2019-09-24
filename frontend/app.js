var app = angular.module('root', []);


app.controller('employeeAddCtrl', function($scope) {
    $scope.submit = function () {
      console.log("firstname",$scope.firstname);
    }
});
