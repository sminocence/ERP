// Provide a default path to dwr.engine
if (typeof this['dwr'] == 'undefined') this.dwr = {};
if (typeof dwr['engine'] == 'undefined') dwr.engine = {};
if (typeof dwr.engine['_mappedClasses'] == 'undefined') dwr.engine._mappedClasses = {};

if (window['dojo']) dojo.provide('dwr.interface.UsersImpl');

if (typeof this['UsersImpl'] == 'undefined') UsersImpl = {};

UsersImpl._path = '/Ajax/dwr';

/**
 * @param {class java.lang.String} p0 a param
 * @param {function|Object} callback callback function or options object
 */
UsersImpl.test = function(p0, callback) {
  return dwr.engine._execute(UsersImpl._path, 'UsersImpl', 'test', arguments);
};

/**
 * @param {function|Object} callback callback function or options object
 */
UsersImpl.getUser = function(callback) {
  return dwr.engine._execute(UsersImpl._path, 'UsersImpl', 'getUser', arguments);
};


