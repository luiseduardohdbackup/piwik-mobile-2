var args = arguments[0] || {};

var message   = "Please, contact mobile@piwik.org or visit http://piwik.org/mobile\n";
var exception = args.error;

message      += "Error: ";
if ('undefined' !== (typeof exception) && exception) {
    message  += exception.toString();
    console.warn(exception.toString(), 'error_message_controller');
} else {
    message  += 'Unknown';
}

message += "\nPlease, provide the following information:\n";
message += "System: " + Ti.Platform.name + ' ' + Ti.Platform.version + "\n";

message += String.format("Piwik Mobile Version: %s - %s %s\n",
                         '' + Ti.App.version, '' + Ti.version, '' + Ti.buildHash);
message += "Available memory " + Ti.Platform.availableMemory + "\n";

var caps =  Ti.Platform.displayCaps;
message += String.format("Resolution: %sx%s %s (%s) \n",
                         '' + caps.platformWidth,
                         '' + caps.platformHeight,
                         '' + caps.density,
                         '' + caps.dpi);

exports.open = function()
{
    var alertDialog = Ti.UI.createAlertDialog({
        title: "An error occurred",
        message: message,
        buttonNames: ['OK']
    });

    alertDialog.show();
}