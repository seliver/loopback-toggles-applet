const Applet = imports.ui.applet;
const Util = imports.misc.util;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Lang = imports.lang;

function MyApplet(orientation, panel_height, instance_id) {
    this._init(orientation, panel_height, instance_id);
}

let currentStatus = null;

MyApplet.prototype = {
    __proto__: Applet.TextIconApplet.prototype,

    _init: function(orientation, panel_height, instance_id) {
        Applet.TextIconApplet.prototype._init.call(this, orientation, panel_height, instance_id);
        this.set_applet_tooltip(_("Loopback toggler"));
        this._update_loop();
    },

    on_applet_clicked: function() {
        if (currentStatus === true) {
            Util.spawn_async(['pactl', 'unload-module', 'module-loopback']);
        } else if (currentStatus === false) {
            Util.spawn_async(['pactl', 'load-module', 'module-loopback', 'latency_msec=1']);
        }
        this._check_activated_modules();
    },

    on_applet_removed_from_panel: function () {
    // stop the loop when the applet is removed
        if (this._updateLoopID) {
            Mainloop.source_remove(this._updateLoopID);
        }
    },

    _check_activated_modules: function () {
        Util.spawn_async(['pactl', 'list', 'short', 'modules'], Lang.bind(this, this._get_status));
    },

    _update_loop: function () {
        this._check_activated_modules();
        // run the loop every 5000 ms
        this._updateLoopID = Mainloop.timeout_add(5000, Lang.bind(this, this._update_loop));
    },

    _get_status: function(active_modules){
        if (active_modules.length > 0) {
            currentStatus = active_modules.includes('module-loopback');
            if (currentStatus) {
                this.set_applet_tooltip(_('Loopback is ON'));
                this.set_applet_icon_name("audio-loop-on");
            } else {
                this.set_applet_tooltip(_('Loopback is OFF'));
                this.set_applet_icon_name("audio-loop-off");
            }
        } else {
            this.set_applet_tooltip(_('SOMETHING\'S WRONG'));
        }
    },
};

function main(metadata, orientation, panel_height, instance_id) {
    return new MyApplet(orientation, panel_height, instance_id);
}