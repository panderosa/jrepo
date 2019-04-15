const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const idm = require('./idm.js');
const subscription = require('./subscription.js');
const login = require('./login.js');
const query = require('./request.js');
const legacy = require('./legacy.js');




async function main() {
    try {
        //const env = await idm.initConfig(configFile);
        // e.g. PSLAB,AMS
        var operation = args.o; // e.g. subscriptionFilter
        var suite = args.e;

        switch (operation) {
            case 'getToken':
                // node main.js -e AMS -o getToken -c admin -t Provider
                var consumer = args.c;
                var tenant = args.t;
                var token = await idm.getToken(suite, consumer, tenant);
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
                var subscriptionId = args.i;
                var auth = idm.getAuthorization(user, env[suite]['login'][consumer]);
                var out = await subscription.cancelOne(suite, env, auth, subscriptionId);
                console.log(out);
                break;
            case 'subscriptionCancelMultiple':
                // node main.js -e AMS -o subscriptionCancelMultiple -c consumer -t CONSUMER -s TERMINATED -u admin
                var token = await idm.getToken(suite, env, consumer, tenant);
                var subs = await subscription.filter(suite, env, token, 'TERMINATED', onBehalf);
                var list = subs.members.map(e => e.id);
                var auth = idm.getAuthorization(user, env[suite]['login'][user]);
                var out = await subscription.cancelMultiple(suite, env, auth, list);
                console.log(out);
                break;
            case 'subscriptionGetDetails':
                // node main.js -e AMS -o subscriptionGetDetails -i 2c90958d6a0867a0016a0d5445114568
                var subscriptionId = args.i;
                var auth = idm.getAuthorization('ooInboundUser', env[suite]['login']['ooInboundUser']);
                var subsc = await subscription.getDetails(suite, env, auth, subscriptionId);
                //var order = subsc['ext']['associated_requests'].find(e => e['request_action_name'] === 'ORDER');
                fs.writeFileSync('c:/tmp/subscription.json', JSON.stringify(subsc, null, 2));
                break;
            case 'loginGetIdentifier':
                // node main.js -e AMS -o loginGetIdentifier -u admin -t Provider
                var out = await login.getIdentifier(suite, env, tenant, user);
                console.log(out);
                break;
            case 'requestGet':
                // node main.js -e AMS -o requestGet -c 2c9095896966ec9801696d907a724e9f -r 2c9095926a0fb95c016a10cd57611643
                var catalogId = args.c;
                var requestId = args.r;
                var userIdentifier = await login.getIdentifier(suite, env, 'AMS_PS_LAB', 'malinowd');
                var out = await query.get(suite, env, catalogId, requestId, userIdentifier);
                fs.writeFileSync('c:/tmp/requestCMT.json', JSON.stringify(out, null, 2));
                //console.log(out);
                break;

            case 'legacyGetSubscriptionDetails':
                // node main.js -e AMS -o legacyGetSubscriptionDetails -c 9a391e02f9df47c5ad9487ae7f77eee0 -s 2c90958969ba44990169ecdef11f32ae
                var catalogId = args.c;
                var subscriptionId = args.s;
                var userIdentifier = await login.getIdentifier(suite, env, 'AMS_PS_LAB', 'malinowd');
                var out = await legacy.getSubscriptionDetails(suite, env, catalogId, subscriptionId, userIdentifier);
                console.log(out);
                break;

            case 'getArtifact':
                // node main.js -e AMS -o getArtifact -a 2c90958d6a0867a0016a0d5445114568
                var catalogId = args.c;
                var artifactId = args.a;
                var userIdentifier = await login.getIdentifier(suite, env, 'Provider', 'ooInboundUser');
                var out = await legacy.getArtifact(suite, env, artifactId, userIdentifier);
                fs.writeFileSync(path.join('c:/tmp/subscription.json'), out);
                console.log(out);
                break;
            case 'getOrganizations':
                // node main.js -e AMS -o getOrganizations -f pslab_orgs.json                
                var fileName = path.join("c:/tmp",args.f);
                var orgs = await idm.getOrganizations(suite);
                fs.writeFileSync(fileName, orgs);
                console.log(orgs);
                break;
            case 'getOrganizationDetails':
                // node main.js -e AMS -o getOrganizationDetails -n AMS_PS_LAB -f pslab_orgs.json
                var fileName = path.join("c:/tmp",args.f);
                var name = args.n;
                var orgs = await idm.getOrganizationDetails(suite,name);
                fs.writeFileSync(path.join(fileName), orgs);
                console.log(orgs);
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