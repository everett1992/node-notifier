var os = require('os');
var utils = require('node-notifier-utils');
var Growl = require('node-notifier-growl');

// All notifiers
var NotifySend = requireWithFallback('node-notifier-notifysend', Growl);
var NotificationCenter = requireWithFallback(
  'node-notifier-notificationcenter',
  Growl
);
var WindowsToaster = requireWithFallback('node-notifier-toaster', Growl);
var WindowsBalloon = requireWithFallback('node-notifier-balloon', Growl);

var options = { withFallback: true };

var osType = utils.isWSL() ? 'WSL' : os.type();

switch (osType) {
  case 'Linux':
    module.exports = new NotifySend(options);
    module.exports.Notification = NotifySend;
    break;
  case 'Darwin':
    module.exports = new NotificationCenter(options);
    module.exports.Notification = NotificationCenter;
    break;
  case 'Windows_NT':
    if (utils.isLessThanWin8()) {
      module.exports = new WindowsBalloon(options);
      module.exports.Notification = WindowsBalloon;
    } else {
      module.exports = new WindowsToaster(options);
      module.exports.Notification = WindowsToaster;
    }
    break;
  case 'WSL':
    module.exports = new WindowsToaster(options);
    module.exports.Notification = WindowsToaster;
    break;
  default:
    if (os.type().match(/BSD$/)) {
      module.exports = new NotifySend(options);
      module.exports.Notification = NotifySend;
    } else {
      module.exports = new Growl(options);
      module.exports.Notification = Growl;
    }
}

function requireWithFallback(module, fallback) {
  try {
    return require(module);
  } catch (err) {
    return fallback;
  }
}

// Expose notifiers to give full control.
module.exports.NotifySend = NotifySend;
module.exports.NotificationCenter = NotificationCenter;
module.exports.WindowsToaster = WindowsToaster;
module.exports.WindowsBalloon = WindowsBalloon;
module.exports.Growl = Growl;
