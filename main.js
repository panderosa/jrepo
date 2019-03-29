const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const idm = require('./idm.js');
const subscription = require('./subscription.js');
const configFile = "C:\\Projects\\HCM\\configuration.json";


async function main() {
    try {
        const env = await idm.initConfig(configFile);
        var consumer = args.c;
        var onBehalf = args.b;
        var suite = args.e; // e.g. PSLAB,AMS
        var subscriptionId = args.i;
        var operation = args.o; // e.g. subscriptionFilter
        var status = args.s; // subscription status e.g. TERMINATED, CANCELLED
        var tenant = args.t;
        var user  = args.u;

        switch (operation) {
            case 'idmGetToken':
                var token = await idm.getToken(suite, env, consumer, tenant);
                console.log(token);
                break;
            case 'subscriptionFilter':
                // node main.js -e AMS -o subscriptionFilter -c consumer -t CONSUMER -s CANCELLED
                var token = await idm.getToken(suite, env, consumer, tenant);
                var out = await subscription.filter(suite, env, token, status, onBehalf);
                console.log(out);
                break;
            case 'subscriptionDelete':
                // node main.js -e AMS -o subscriptionDelete -c consumer -t CONSUMER
                var token = await idm.getToken(suite, env, consumer, tenant);
                var subs = await subscription.filter(suite, env, token, 'CANCELLED', onBehalf);
                var list = subs.members.map(e => e.id);
                var out = await subscription.remove(suite, env, token, list, onBehalf);
                console.log(out);
                break;
            case 'subscriptionCancelOne':
                // node main.js -e AMS -o subscriptionCancelOne -u admin -i 2c909591697514dc0169ae062a8a544d
                var auth = idm.getAuthorization(user,env[suite]['login'][consumer]);   
                var out = await subscription.cancelOne(suite,env,auth,subscriptionId);
                console.log(out);
                break;
            case 'subscriptionCancelMultiple':
                // node main.js -e AMS -o subscriptionCancelMultiple -c consumer -t CONSUMER -s TERMINATED -u admin
                var token = await idm.getToken(suite, env, consumer, tenant);
                var subs = await subscription.filter(suite, env, token, 'TERMINATED', onBehalf);
                var list = subs.members.map(e => e.id);
                var auth = idm.getAuthorization(user,env[suite]['login'][user]);
                var out = await subscription.cancelMultiple(suite,env,auth,list);
                console.log(out);
                break;

            default:
                throw new Error("Operation not defined");
        }
    }
    catch (error) {
        console.log(error);
    }


}



main();