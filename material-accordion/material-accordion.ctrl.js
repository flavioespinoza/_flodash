/**
 * Created by Flavor on 9/30/16.
 */
/**
 * Created by Flavor on 3/17/16.
 */
var app = angular.module('ZipFrame', [
  'ngMaterial',
  'accordionSideNav'
]);

app.config(function ($interpolateProvider, $mdThemingProvider, $mdGestureProvider) {

  $interpolateProvider.startSymbol('[{');
  $interpolateProvider.endSymbol('}]');

  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('pink');

  $mdGestureProvider.skipClickHijack();

});

/**
 * Captures data arrays from Django for sidenav menu and reportList on base.html.
 */
app.factory('Constants', function (DjangoConstants) {

  var constants = {};
  angular.extend(constants, DjangoConstants);

  return {
    get: function (key) {
      return constants[key];
    },
    // this is a handy way to make all constants available in your HTML
    // e.g. $scope.c = Constants.all()
    all: function () {
      return constants;
    }
  };

});

/**
 * Changes titles to material design guidelines.
 * Example: Changes "Report Name" or "REPORT NAME" to "Report name".
 */
app.filter('title', function () {
  return function (input, scope) {
    if (input != null)
      input = input.toLowerCase();
    return input.substring(0, 1).toUpperCase() + input.substring(1);
  }
});

app.controller('DemoCtrl', function ($scope, $timeout, $q, $log) {



});

app.controller('MainCtrl', function ($scope, $http, $location, $timeout, $mdSidenav, $log, $user, locationService) {


  $scope.startInstructionalOverlay = function () {
    introJs().start();
  };


  /** Sets toolbar color based on localhost, test or production. */
  $scope.hostToolbarColor = '';
  if ($location.$$host === 'localhost') {
    $scope.hostToolbarColor = 'blue-toolbar';
  } else if ($location.$$host === 'las5-zipwebt00' || $location.$$host === 'las5-zipwebt01') {
    $scope.hostToolbarColor = 'orange-toolbar';
  }

  $scope.favorites = [];
  $scope.favoriteUrl = '';
  $scope.showFavs = false;

  /** Loads list of Your favorites on page load. */
  $http({
    method: 'GET',
    url: '/bookmark/'
  }).then(function success(res) {
    _.mapKeys(res.data, function (value, key) {
      $scope.favorites.push({
        name: key,
        url: value.url
      });
    });
  }, function error(err) {
    console.error('error', err);
  });

  /** Called by update_bookmark_list function in the bookmark.list.service.js.
   * This is required to update Your favorites list when adding or deleting a favorite. */
  $scope.getFavorites = function () {
    return $http({
      method: 'GET',
      url: '/bookmark/'
    })
  };

  /** Watches and updates $scope.favorites when adding or deleting favorites. */
  $scope.$watch(
    function ($scope) {
      return ($scope.favorites);
    },
    function (newValue) {
      var favoritesArray = [];
      for (var i = 0; i < newValue.length; i++) {
        var obj = newValue[i];
        favoritesArray.push(obj.name);
      }
      console.log('Favorites List', favoritesArray);
    }
  );

  /** Triggers resize of NVD3 charts on page load so chart width is 100% of parent.
   * This is a work around for a bug in NVD3 which loads the chart wrong on some pages. */
  $scope.triggerResizeEvent = function () {
    window.dispatchEvent(new Event('resize'));
  };

  $timeout(function () {
    $scope.triggerResizeEvent();
  }, 1000);


  /** Adds or removes elements from DOM based on specific page needs. */
  $scope.showRefresh = true;
  $scope.modClasses = '';
  $scope.fullWidth = '';

  var noRefresh = _.includes(locationService.noRefresh, $location.$$absUrl);
  var includesUrl = _.includes(locationService.urls, $location.$$absUrl);
  var fullWidth = _.includes(locationService.fullWidth, $location.$$absUrl);

  if (noRefresh) {
    $scope.showRefresh = false;
  }

  if (includesUrl) {
    $scope.modClasses = 'background-transparent p0';
  } else if (fullWidth) {
    $scope.modClasses = 'mw100';
  }

  $scope.user = $user;

  $scope.close = function () {
    $scope.loginToggle = false;
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close Left is done!");

      });
  };

  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');

  $scope.closeRight = function () {
    $mdSidenav('Left').close()
      .then(function () {
        $log.debug("close Left is done");
      });
  };

  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;

    return function debounced() {
      var context = $scope,
        args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }

  /**
   * Build handler to open/close a SideNav. When the animation is complete it is logged in the console.
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }, 200);
  }

  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID)
        .toggle()
        .then(function () {
          $log.debug("toggle " + navID + " is done");
        });
    }
  }

});

app.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $mdSidenav('left').close()
      .then(function () {
        $log.debug("close LEFT is done");
      });

  };
});

app.controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    $mdSidenav('right').close()
      .then(function () {
        $log.debug("close RIGHT is done");
      });
  };
});

app.controller('ReportDirectoryCtrl', function ($scope, reportDirectoryService, $location, $window) {
  var rds = reportDirectoryService;
  $scope.rdsArray = rds.array;

  $scope.redirect = function (url) {
    $window.open(url);
  }

});

app.controller('WithButtonsCtrl', function (DTOptionsBuilder, DTColumnBuilder) {
  var vm = this;
  vm.dtOptions = DTOptionsBuilder.fromSource('data.json')
    .withDOM('frtip')
    .withPaginationType('full_numbers')
    // Active Buttons extension
    .withButtons([
      'copy',
      'excel'
    ]);
});

app.filter('newlines', function () {
  return function (text) {
    return text.replace(/\n/g, '<br/>');
  }
});

app.filter('noHTML', function () {
  return function (text) {
    return text
      .replace(/&amp;/, "&")
      .replace(/&#39;/, "'");
  }
});



