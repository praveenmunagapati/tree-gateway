"use strict";

import * as cluster from "cluster";
import * as os from "os";
import { Gateway } from "./gateway";
import { Parameters } from "./command-line";

if (cluster.isMaster) {
    var n = os.cpus().length;
    console.log('Starting child processes...');

    for (var i = 0; i < n; i++) {
        cluster.fork();
    }

    cluster.on('online', function (worker) {
        console.log('Child process running PID: ' + worker.process.pid);
    });

    cluster.on('exit', function (worker, code, signal) {
        console.log('PID ' + worker.process.pid + ' code: ' + code + ' signal: ' + signal);
        cluster.fork();
    });
} 
else {
    const gateway = new Gateway(Parameters.gatewayConfigFile);

    gateway.start()
        .then(() => {
            return gateway.startAdmin();
        })
        .catch((err) => {
            console.log(`Error starting gateway: ${err.message}`);
            process.exit(-1);
        });
}

process.on('uncaughtException', function (err) {
    console.log(err);
});