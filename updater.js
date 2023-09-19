const { autoUpdater } = require("electron-updater")

module.exports = () => {
    console.log("Checking for updates...")
    const log = require("electron-log")
    log.transports.file.level = "debug"
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
}