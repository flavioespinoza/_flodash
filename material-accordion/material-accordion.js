/**
 * Created by Flavor on 9/30/16.
 */
/**
 * Created by Flavor on 5/23/16.
 */

var mdAccordionNav = angular.module("accordionSideNav", ["angularytics", "ngMessages", "ngMaterial"]);

mdAccordionNav.config(["AngularyticsProvider",
  function (e) {
    e.setEventHandlers(["Console", "GoogleUniversal"])
  }
]).run(["Angularytics",
  function (e) {
    e.init()
  }
]);

mdAccordionNav.service("userDefinedMenu", function (Constants) {

  var sectionsArray = Constants.all().menuArray;

  /** MENU OBJECT EXAMPLE
   *
   var menuObj = {
      active: false,
      name: 'Name of parent group, ACH Adoption or Retained Value, etc...',
      pages: [
        {
          label: 'Name of link: Retained Value, Retained Value Data Histograms, etc...',
          state: 'name from python: fpna_lrv or fpna_lrv_histogram, etc...',
          url: 'url to page: /fpna/lrv or /fpna/lrv/distribution, etc...'
        },
        {
          label: 'Name of link: Retained Value, Retained Value Data Histograms, etc...',
          state: 'name from python: fpna_lrv or fpna_lrv_histogram, etc...',
          url: 'url to page: /fpna/lrv or /fpna/lrv/distribution, etc...'
        }
      ],
      type: 'toggle, link, or heading'
    };
   *
   * **/

  var g = {};

  return {
    sections: sectionsArray,
    toggleSelectSection: function (e) {
      g.openedSection = g.openedSection === e ? null : e
    },
    isSectionSelected: function (section) {
      return g.openedSection === section
    },
    selectPage: function (e, t) {
      g.currentSection = e, g.currentPage = t
    },
    isPageSelected: function (e) {
      return g.currentPage === e
    }
  }

});

/** Menu Directives, HTML Templates & Filters **/
mdAccordionNav.directive("menuToggle",
  function ($timeout) {
    return {
      scope: {
        section: "="
      },
      templateUrl: "partials/menu-toggle.tmpl.html",
      link: function (scope, element, attrs) {
        var elementParent = element.parent().controller();
        scope.isOpen = function () {
          return elementParent.isOpen(scope.section)
        }, scope.toggle = function () {
          elementParent.toggleOpen(scope.section)
        }, scope.$watch(function () {
          return elementParent.isOpen(scope.section)
        }, function (scope) {
          function _elementParentAnimation() {
            var _elementParentUlHeight;
            return _elementParentUl.addClass("no-transition"),
              _elementParentUl.css("height", ""),
              _elementParentUlHeight = _elementParentUl.prop("clientHeight"),
              _elementParentUl.css("height", 0), _elementParentUl.removeClass("no-transition"),
              _elementParentUlHeight
          }

          var _elementParentUl = element.find("ul");
          var _elementParentHeight = scope ? _elementParentAnimation() : 0;
          $timeout(function () {
            _elementParentUl.css(
              {
                height: _elementParentHeight + "px"
              })
          }, 0, !1)
        });
        var _elementParentNode = element[0].parentNode.parentNode.parentNode;
        if (_elementParentNode.classList.contains("parent-list-item")) {
          var _selected = _elementParentNode.querySelector("h2");
          element[0].firstChild.setAttribute("aria-describedby", _selected.id)
        }
      }
    }
  }
);

mdAccordionNav.directive("menuLink", function () {
  return {
    scope: {
      section: "="
    },
    templateUrl: "partials/menu-link.tmpl.html",
    link: function (scope, element, attrs) {
      var elementParent = element.parent().controller();
      scope.isSelected = function () {
        return elementParent.isSelected(scope.section)
      }
    }
  }
});

mdAccordionNav.controller("NavItemsCtrl", function ($scope, $mdSidenav, $log, $timeout, $mdDialog, userDefinedMenu, $window, $location, $rootScope, DjangoConstants) {

  var djc = DjangoConstants;
  $scope.reportList = djc.reportListArray;

  $scope.simulateQuery = false;
  $scope.isDisabled    = false;

  $scope.repos         = loadAll();
  $scope.querySearch   = querySearch;
  $scope.selectedItemChange = selectedItemChange;
  $scope.searchTextChange   = searchTextChange;

  // ******************************
  // Internal methods
  // ******************************

  /**
   * Search for repos... use $timeout to simulate
   * remote dataservice call.
   */
  function querySearch (query) {
    var results = query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos,
      deferred;
    if ($scope.simulateQuery) {
      deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    } else {
      return results;
    }
  }

  function searchTextChange(text) {
    $log.info('Text changed to ' + text);
  }

  function selectedItemChange(item) {
    $log.info('Item changed to ' + JSON.stringify(item));
    if (item) {
      $window.location.href = item.url;
    }
  }

  /**
   * Build `components` list of key/value pairs
   */
  function loadAll() {
    var repos = $scope.reportList;
    return repos.map( function (repo) {
      repo.value = repo.name.toLowerCase();
      return repo;
    });
  }

  /**
   * Create filter function for a query string
   */
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(item) {
      return (item.value.indexOf(lowercaseQuery) === 0);
    };

  }


  function m() {
    $timeout(function () {
      $mdSidenav("left").close()
    })
  }

  function d() {
    $timeout(function () {
      $mdSidenav("left").open()
    })
  }

  function c() {
    return $location.path()
  }

  function p($scope) {
    userDefinedMenu.selectPage(null, null),
      $location.path("/")
  }

  function u() {
    $scope.closeMenu(),
    v.autoFocusContent && (h(),
      v.autoFocusContent = !1)
  }

  function h($scope) {
    $scope && $scope.preventDefault(),
      $timeout(function () {
        //x.focus()
      }, 90)
  }

  function g($scope) {
    return userDefinedMenu.isPageSelected($scope)
  }

  function b($scope) {
    var t = !1
      , a = userDefinedMenu.openedSection;
    return a === $scope ? t = !0 : $scope.children && $scope.children.forEach(function ($scope) {
      $scope === a && (t = !0)
    }), t
  }

  function f($scope) {
    return userDefinedMenu.isSectionSelected($scope)
  }

  function y($scope) {
    userDefinedMenu.toggleSelectSection($scope)
  }

  var v = this;
  $scope.menu = userDefinedMenu,
    $scope.path = c,
    $scope.goHome = p,
    $scope.openMenu = d,
    $scope.closeMenu = m,
    $scope.isSectionSelected = b,
    $scope.thisYear = (new Date).getFullYear(),
    $rootScope.$on("$locationChangeSuccess", u),
    $scope.focusMainContent = h,
    Object.defineProperty($rootScope, "relatedPage", {
      get: function () {
        return null
      },
      set: angular.noop,
      enumerable: !0,
      configurable: !0
    }),
    $rootScope.redirectToUrl = function ($scope) {
      $location.path($scope),
        $timeout(function () {
          $rootScope.relatedPage = null
        }, 100)
    },
    this.isOpen = f,
    this.isSelected = g,
    this.toggleOpen = y,
    this.autoFocusContent = !1;
  var x = document.querySelector("[role='main']")
});

mdAccordionNav.run(["$templateCache",
  function (e) {
    e.put("partials/menu-link.tmpl.html",
      '<md-divider></md-divider> <div ng-show="section.label == \'spacer\'" class="doc-menu-spacer hadow-inners"></div> <md-button\n ng-hide="section.label == \'spacer\'"  ng-class="{\'is-active\' : isSelected()}"\n  ng-href="{{section.url}}"\n  ng-click="focusSection()">\n  {{ section.label | ampersand }}\n  <span class="md-visually-hidden"\n  ng-if="isSelected()">\n current page\n  </span>\n</md-button>\n'
    )
  }
]);

mdAccordionNav.run(["$templateCache",
  function (e) {
    e.put("partials/menu-toggle.tmpl.html",
      '<md-button class="md-button-toggle"\n ng-class="{\'section-toggled\' : isOpen()}"\n ng-click="toggle()"\n  aria-controls="docs-menu-{{section.name | nospace}}"\n  aria-expanded="{{isOpen()}}">\n  <div flex layout="row">\n  {{ section.name | ampersand }}\n <span flex></span>\n    <span aria-hidden="true" class="md-toggle-icon"\n ng-class="{\'toggled\' : isOpen()}">\n      <md-icon md-svg-src="md-toggle-arrow"></md-icon>\n    </span>\n  </div>\n  <span class="md-visually-hidden">\n    Toggle {{isOpen()? \'expanded\' : \'collapsed\'}}\n  </span>\n</md-button>\n\n<ul id="docs-menu-{{section.name | nospace}}" class="menu-toggle-list">\n  <li ng-repeat="page in section.pages" class="menu-link-li">\n    <menu-link section="page"></menu-link>\n  </li>\n</ul>\n'
    )
  }
]);

mdAccordionNav.filter("nospace", function () {
  return function (e) {
    return e ? e.replace(/ /g, "") : ""
  }
});

mdAccordionNav.filter('ampersand', function () {
  return function (text) {
    return text
      .replace(/&amp;/, "&")
      .replace(/&#39;/, "'");
  }
});

mdAccordionNav.filter("humanizeDoc", function () {
  return function (e) {
    return e ? "directive" === e.type ? e.name.replace(/([A-Z])/g,
      function (e) {
        return "-" + e.toLowerCase()
      }) : e.label || e.name : void 0
  }
});

mdAccordionNav.filter("directiveBrackets", function () {
  return function (e) {
    return e.indexOf("-") > -1 ? "<" + e + ">" : e
  }
});