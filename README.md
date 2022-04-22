# Loopback toggle applet for Cinnamon

This is a simple applet that allows you to easily turn on/off the microphone loopback.

Uses `pactl` for loading/unloading the `module-loopback`. 

The base commands for it are:
- turn on: `pactl load-module module-loopback latency_msec=1`
- turn off: `pactl unload-module module-loopback`
- check if turned on: `pactl list short modules | awk '$2 =="module-loopback" { print $1 }' -`
