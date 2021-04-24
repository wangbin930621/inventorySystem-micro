var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

var config = {
    user: "web_xishi",
    // Password optional, prompted if none given
    password: "xishiF@20",
    host: "47.111.84.44",
    port: 21,
    localRoot: __dirname + "/dist",
    remoteRoot: "/",
    include: ["*", "**/*"],      // this would upload everything except dot files
    // include: ["*.php", "dist/*", ".*"],
    // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
    exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
    // delete ALL existing files at destination before uploading, if true
    deleteRemote: false,
    // Passive mode is forced (EPSV command is not sent)
    forcePasv: false
};

// use with promises
ftpDeploy
    .deploy(config)
    .then(res => console.log("finished:", res))
    .catch(err => console.log(err));

// // use with callback
// ftpDeploy.deploy(config, function (err, res) {
//     if (err) console.log(err);
//     else console.log("finished:", res);
// });


ftpDeploy.on("uploading", function (data) {
    console.log(data.totalFilesCount); // total file count being transferred
    console.log(data.transferredFileCount); // number of files transferred
    console.log(data.filename); // partial path with filename being uploaded
});
ftpDeploy.on("uploaded", function (data) {
    console.log(data); // same data as uploading event
});
ftpDeploy.on("log", function (data) {
    console.log(data); // same data as uploading event
});
ftpDeploy.on("upload-error", function (data) {
    console.log(data.err); // data will also include filename, relativePath, and other goodies
});