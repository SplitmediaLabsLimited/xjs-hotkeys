/* globals __dirname, require */

(function()
{
    "use strict";

    var Packager = require(__dirname + "/node_modules/xui_app/packager/packager.js");

    (new Packager(
    {
        "appFolder"    : __dirname + "/plg/",
        "buildsFolder" : __dirname + "/plg/"
    })).run({
        ext : "plg",
        buildDev: true
    });
})();