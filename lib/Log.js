const {Cu} = require('chrome');
Cu.import('resource://gre/modules/Log.jsm'); /* globals Log: false */
Cu.import('resource://gre/modules/Preferences.jsm'); /* globals Preferences: false */

exports.Log = Log.repository.getLogger('RecipeRunner');

// Log messages need to go to the browser console
const consoleAppender = new Log.ConsoleAppender(new Log.BasicFormatter());
exports.Log.addAppender(consoleAppender);

/**
 * Make a namespaced version of this logger which will prepend a string
 * to all messages.
 * @param  {String} namespace The string to prepend to messages. A colon
 *                            and a space will be added to the end.
 * @return {Object} A namespaced logger.
 */
exports.Log.makeNamespace = function(namespace) {
  const namespacedLog = {};
  function namespacedMessage(level, message, params) {
    exports.Log[level](`${namespace}: ${message}`, params);
  }
  for (let name of ['trace', 'debug', 'config', 'info', 'warn', 'error', 'fatal']) {
    namespacedLog[name] = namespacedMessage.bind(null, name);
  }
  return namespacedLog;
};

// Set log level
exports.Log.level = Log.Level[Preferences.get('extensions.recipeclient.log.level', 'WARN')];
