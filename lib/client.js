"use strict";

const eventemitter = require('events').EventEmitter;
const util = require('util');
const zlib = require('zlib');
const net = require('net');
const netBuffer = require('./netBuffer');
const compress_data = true;

function compress(data){
    return zlib.deflateRawSync(data);
}

function decompress(data){
    return zlib.inflateRawSync(data);
}

class Client {
    constructor(){
        eventemitter.call(this);
        this.received = '';
        this.sent = '';
        this.socket = null;
    };

    error (error, client) {
        this.emit('socketerror', error.code, client);
    };

    connect (ip, port, cb) {
        this.socket = new net.createConnection(port, ip);
        let me = this;
        cb && cb();
        this.socket.on('connect', function (data, cc) {
            // me.connected()
            // 
            me.socket.on('error', function (error) {
                me.error(error, me);
            });
            me.socket.on('data', function (data) {
                me.receive(data);
            });
            me.socket.on('close', function () {
                me.disconnect(me);
            });


        });
    };

    receive (transmit) {
        console.log('transmit', transmit); 
    };

    send (id, event, content) {
        let transmit = JSON.stringify({id: id, event: event, content: content});

        this.socket.write(netBuffer.pack(zlib.deflateRawSync(transmit)));
    }

    disconnect (ss) {
        console.log('disconnect ');
        this.connected = false;
        this.emit('disconnect');
    };
}
util.inherits(Client, eventemitter);

// module.exports = new client();

// test
if (require.main !== module) return;

let client = new Client();
client.connect('192.168.1.116', 8080, function(){
    console.log('ccccccccccccc');

    client.send(8, "connected", {
        tableid : '18',
        gameid : '10000002',
        session : '88o1T3680cWE3mZuvPTyV6IMIU0hWbor'
    });
});

client.on('request', function(id, event, content){
    console.log('request id', id);
    console.log('request event', event);
    console.log('request content', content);
});

 setTimeout(function(){
    let client2 = new Client();
    client.connect('192.168.1.116', 8080);
    client.on('request', function(id, event, content){
        console.log('request id', id);
        console.log('request event', event);
        console.log('request content', content);

    });
 }, 3000);


// {
//     let testcli = new client();
//     testcli.connect(8080);
//     let socketid = 0;
//     testcli.on('request', function (id, event, content) {
//         if (event === 'connected') {
//             if(content.hasOwnProperty("socketid")){
//                 socketid = content.socketid;
//                 console.log('connected...socketid is', socketid);
//                 testcli.send(0, 'connected', {});
//             }else{
//                 testcli.send(1, 'initfishing', {session: '73HrjU70iJqJlkIN6rwW9mrN1tm6u46d', gameid: 1000002, tableid: 6});
//                 console.log('connected...2', content);
//             }
//         }
//         if (event === 'initfishing') {
//             console.log('initfishing success');
//             testcli.send(2, 'userjoin', {seatid: 1});
//         }
//         if (event === 'userjoin') {
//             console.log('userjoin success');
//             testcli.socket.destroy();
//             setTimeout(()=>reconect(), 3000);
//         }
//     });

//     function reconect() {
//         let testcli2 = new client();
//         testcli2.connect(8080);
//         testcli2.on('request', function (id, event, content) {
//             if (event === 'connected') {
//                 if(content.hasOwnProperty("socketid")){
//                     console.log('connected2...socketid is',content);
//                     testcli2.send(0, 'connected', {socketid: socketid});
//                 }
//             }else{
//                 console.log(event, content)
//             }
//         });
//     }

// }