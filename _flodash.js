/**
 * Created by Flavor on 9/27/16.
 */
/**
 * Created by Flavor (aka Flavio Espinoza) on 8/4/16.
 */
(function (window, angular, undefined) {

  'use strict';

  /**
   * @ngdoc object
   * @name _f
   * @packageName _flodash
   *
   */

  var _flodash = angular.module('_f', []);

  /**
   * @ngdoc service
   * @name _f
   * @description
   *
   * Inspired and built upon lodash.
   * This module provides a series of functions for complex object and array manipulation.
   *
   * <pre>

   // _flodash.js


   // Include the '_f' module in your Angular app.
   var app = angular.module('MyApp', ['_f']);

   // Inject the _f service into your controller, services and/or factories.
   app.controller('MyCtrl', function ($scope, _f) {

        var array = [1, 2, 3, 4, 5];
        $scope.running_total = _f.cumulative(array);

        console.log($scope.running_total);
        // console result => [1, 3, 6, 10, 15]

    });


   * </pre>
   *
   **/

  _flodash.service('_f', function () {
    var _f = this;

    /**
     * @ngdoc function
     * @name _f.cumulative
     * @function
     * @description
     *
     * Creates an array of increasing values by successive additions.
     *
     * @param {Array} array The array of numbers.
     * @returns {Array} array The array of increasing values by successive additions.
     * <pre>

     _f.cumulative([1, 2, 3, 4, 5]);

     result => [1, 3, 6, 10, 15]


     * </pre>
     *
     **/
    _f.cumulative = function (array) {
      var result = [];
      array.reduce(function (valueA, valueB, index) {
        return result[index] = valueA + valueB;
      }, 0);
      return result;
    };

    /**
     * @ngdoc function
     * @name _f.parse_float_int
     * @function
     * @description
     *
     * Returns a number from an integer or numeric string representation and has exactly (to_fixed) digits after
     * the decimal place up to 9 decimal places.
     *
     * @param {String} string The numeric string you want to parse.
     * @returns {Number} Number between 0 - 9 decimal places.
     * <pre>

     var pi = "3.1415926535897931";
     or
     var pi = 3.1415926535897931;


     _f.parse_float_int(pi, 0); => 3
     _f.parse_float_int(pi, 1); => 3.1
     _f.parse_float_int(pi, 2); => 3.14
     _f.parse_float_int(pi, 3); => 3.141
     _f.parse_float_int(pi, 4); => 3.1415
     _f.parse_float_int(pi, 5); => 3.14159
     _f.parse_float_int(pi, 6); => 3.141592
     _f.parse_float_int(pi, 7); => 3.1415926
     _f.parse_float_int(pi, 8); => 3.14159265
     _f.parse_float_int(pi, 9); => 3.141592653

     * </pre>
     *
     **/
    _f.parse_float_int = function (input, to_fixed) {
      var string = '';
      if (_.isString(input)) {
        string = input;
      } else {
        string = input.toString();
      }

      var decimal = [
        {number: 0, func: Number(string.match(/^\d+(?:\.\d{0,0})?/))},
        {number: 1, func: Number(string.match(/^\d+(?:\.\d{0,1})?/))},
        {number: 2, func: Number(string.match(/^\d+(?:\.\d{0,2})?/))},
        {number: 3, func: Number(string.match(/^\d+(?:\.\d{0,3})?/))},
        {number: 4, func: Number(string.match(/^\d+(?:\.\d{0,4})?/))},
        {number: 5, func: Number(string.match(/^\d+(?:\.\d{0,5})?/))},
        {number: 6, func: Number(string.match(/^\d+(?:\.\d{0,6})?/))},
        {number: 7, func: Number(string.match(/^\d+(?:\.\d{0,7})?/))},
        {number: 8, func: Number(string.match(/^\d+(?:\.\d{0,8})?/))},
        {number: 9, func: Number(string.match(/^\d+(?:\.\d{0,9})?/))}
      ];
      var fixed = _.find(decimal, function (n) {
        return n.number == to_fixed;
      });
      return fixed.func;
    };

    /**
     * @ngdoc function
     * @name _f.sort_obj
     * @function
     * @description
     *
     * Creates sorted object and sorted array from object.
     *
     * @param {Object} object The object you want to sort.
     * @returns {Object} An object sorted by key.
     * <pre>

     _f.sort_obj({ '2016-03-03':34, '2016-03-01':56, '2016-03-02':13 });

     result => {
                '2016-03-01':56,
                '2016-03-02':13,
                '2016-03-03':34
              }

     * </pre>
     *
     **/
    _f.sort_obj = function (object) {
      var obj = {};
      var arr = [];
      _.each(_.keys(object).sort(), function (key, i) {
        obj[key] = object[key];
        arr.push({
          key: key,
          index: i,
          value: obj[key]
        })
      });
      return obj;
    };

    /**
     * @ngdoc function
     * @name _f.sort_obj_to_arr
     * @function
     * @description
     *
     * Creates sorted array from object.
     *
     * @param {Object} object The object you want to sort.
     * @returns {Array} An array sorted by object keys.
     * <pre>

     _f.sort_obj_to_arr({ '2016-03-03':34, '2016-03-01':56, '2016-03-02':13 });

     result => [
     { 'key':'2016-03-01', 'index':0, 'value':56 },
     { 'key':'2016-03-02', 'index':1, 'value':13 },
     { 'key':'2016-03-03', 'index':2, 'value':34 }
     ]

     * </pre>
     *
     **/
    _f.sort_obj_to_arr = function (object) {
      var obj = {};
      var arr = [];
      _.each(_.keys(object).sort(), function (key, i) {
        obj[key] = object[key];
        arr.push({
          key: key,
          index: i,
          value: obj[key]
        })
      });

      return arr;
    };

    /**
     * @ngdoc function
     * @name _f.replaceAll
     * @description
     *
     * Replace all instances of a value with new value in a string.
     *
     * <pre>

     _f.replaceAll(site_survey_pending, '_', '-');

     result => site-survey-pending

     * </pre>
     *
     **/
    _f.replaceAll = function (string, remove, replace) {
      return string.split(remove).join(replace)
    };

    /**
     * @ngdoc function
     * @name _f.toggle
     * @description
     *
     * Boolean that toggles true if false, and false if true;
     *
     * <pre>

     $scope.showCrossFilters = true;
     $scope.showCrossFilters = _f.toggle($scope.showCrossFilters);

     result => $scope.showCrossFilters = false;

     * </pre>
     *
     **/
    _f.toggle = function (bool) {
      return Boolean(Math.abs(Number(bool) - 1));
    };


  });

  /**
   * Created by Flavor on 8/12/16.
   */
  _flodash.service('_dropdowns', function ($host, $http, $q) {
    var _dropdowns = this;

    _dropdowns.get = function (_types) {
      var urlArr = [];
      var url = function (type) {
        return 'dropdowns/?ddconfig=' + type
      };
      _.each(_types, function (type) {
        urlArr.push({
          type: type,
          url: url(type)
        });
      });

      var promises = urlArr.map(function (url) {

        return $http({
          url: $host.api + url.url,
          method: 'GET',
          name: url.type
        });

      });

      return $q.all(promises);

    };

  });

})(window, window.angular);