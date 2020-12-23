
angular.module('starter.controllers', [])
  .factory('filterFactory', ['$rootScope', '$http', function ($rootScope, $http) {
    return {
      dietList: function (filteredRecipes) {
        return filteredRecipes.map(item => item.dietType).filter((value, index, self) => self.indexOf(value) === index);
      }
    }
  }])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    // $scope.loginData = {};

    // // Create the login modal that we will use later
    // $ionicModal.fromTemplateUrl('templates/login.html', {
    //   scope: $scope
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });

    // // Triggered in the login modal to close it
    // $scope.closeLogin = function() {
    //   $scope.modal.hide();
    // };

    // // Open the login modal
    // $scope.login = function() {
    //   $scope.modal.show();
    // };

    // // Perform the login action when the user submits the login form
    // $scope.doLogin = function() {
    //   console.log('Doing login', $scope.loginData);

    //   // Simulate a login delay. Remove this and replace with your login
    //   // code if using a login system
    //   $timeout(function() {
    //     $scope.closeLogin();
    //   }, 1000);
    // };
  })

  .controller('RecipeCtrl', function ($scope, $http, $location) {
    var recipeId = $location.search()['id'];

    $http.get('data/recipes.json')
      .then(function (response) {
        var id = parseInt(recipeId) - 1;
        $scope.recipe = response.data[id];
        //$scope.img = '<img ng-src=\"'+ response.data[id].imageUrl + '\" \/>';
        //$scope.description = response.data[id].description;
        if (response.data[id].cookingTime) {
          $scope.cookingTimeTitle = "Cooking: ";
          $scope.cookingTime = response.data[id].cookingTime;
        }
      });
  })

  .controller('SharingCtrl', function ($scope, $cordovaSocialSharing) {
    $scope.shareAnywhere = function () {
      $cordovaSocialSharing.share("Hello, I am enjoying these Ethiopian/Eritrean cusine recipes. I thought you might like it.", "Habesha Food Recipes", "www/icon-40.png", "https://itunes.apple.com/us/app/habesha-food/id1229276992?mt=8");
    }
  })

  .controller('FilterCtrl', ['$scope', '$http', '$location', 'filterFactory', '$rootScope', '$ionicPopover', function ($scope, $http, $location, filterFactory, $rootScope, $ionicPopover) {

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
      $scope.popover.show($event);
    };

    $scope.closePopover = function () {
      $scope.popover.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });

    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
      var popoverElements = $scope.popover.modalEl;
      var chkbxs = popoverElements.getElementsByClassName('dietCkb');

      var ckbList = popoverElements.getElementsByClassName('dietList');
      var ckbName = [];

      angular.forEach(chkbxs, function (value, key) {
        if (value.checked) {
          ckbName.push(ckbList[key].innerText);
        }
      });
      $rootScope.dietSelected = ckbName;
      var dishType = $location.search()['type'];

      $http.get('./data/recipes.json')
        .then(function (response) {
          var recipeData = response.data.concat();
          var filteredRecipes = [];
          var recipesByDishType = [];

          if (dishType) {
            recipesByDishType = recipeData.filter(function (recipe) {
              const hasType = Object.values(recipe.dishType).includes(dishType);
              return hasType;
            });
          }
          else {
            Array.prototype.push.apply(recipesByDishType, recipeData);
          }

          if ($rootScope.dietSelected !== undefined && $rootScope.dietSelected.length != 0) {
            angular.forEach($rootScope.dietSelected, function (value, key) {
              var r = recipesByDishType.filter(function (recipe) {
                return (recipe.dietType == value);
              });
              Array.prototype.push.apply(filteredRecipes, r);
            });
          }
          else {
            Array.prototype.push.apply(filteredRecipes, recipesByDishType);
          }

          $rootScope.recipeList = filteredRecipes;
          $scope.dietType = filterFactory.dietList(recipeData);
        });
    });

    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
      // Execute action
    });
  }])

  .controller('RecipesCtrl', ['$scope', '$http', '$location', 'filterFactory', '$rootScope', function ($scope, $http, $location, filterFactory, $rootScope) {
    var dishType = $location.search()['type'];

    $http.get('./data/recipes.json')
      .then(function (response) {
        var recipeData = response.data.concat();
        var filteredRecipes = [];

        if (dishType) {
          filteredRecipes = recipeData.filter(function (recipe) {
            const hasType = Object.values(recipe.dishType).includes(dishType);
            return hasType;
          });
        }
        else {
          Array.prototype.push.apply(filteredRecipes, recipeData);
        }
        $rootScope.recipeList = filteredRecipes;
        $scope.dietType = filterFactory.dietList(recipeData);
      });
  }]);

