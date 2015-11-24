
const eventemitter = require('events').EventEmitter;
const util = require('util');
const zlib = require('zlib');
const compress_data = true;

function compress(data){
     return compress_data === true ? zlib.deflateRawSync(data) : common.tostring(data);
}

function decompress(data){
     return compress_data === true ? zlib.inflateRawSync(data) : common.tostring(data);
}

function get_parameter(args, param) {
    var result = {}, ended = false;
    if (!common.empty(args)) {
        for (var i in args) {
            if (typeof(args[i]) === 'function') {
                result.callback = args[i];
                ended = true;
            } else {
                if (ended === false)
                    result[param[i]] = args[i];
                else
                    result[param[i]] = undefined;
            }
        }
    } else {
        for (var i in param)
            result[param[i]] = undefined;
    }
    return result;
};

    class client {
        constructor(){
            eventemitter.call(this);
            let me = this;
            me.connected = false;
            me.received = '';
            me.sent = '';
            me.socket = null;
            me.net = require('net');
            me.netbuffer = require('./netbuffer');
        }

        error (error, client) {
            this.emit('socketerror', error.code, client);
        };

        connect () {
            var me = this, params = get_parameter(arguments, ['port', 'ip']);
            params.port = common.tonumber(params.port);
            params.ip = common.tostring(params.ip);
            params.ip = params.ip === '' ? '127.0.0.1' : params.ip;
            me.socket = new this.net.createConnection(params.port, params.ip);
            me.socket.on('connect', function () {
                me.connected = true;
                me.socket.on('error', function (error) {
                    me.error(error, me);
                });
                me.socket.on('data', function (data) {
                    me.receive(data);
                });
                me.socket.on('close', function () {
                    me.disconnect(me);
                });
                common.invokecallback(me, params.callback);
            });
        };

        receive(transmit) {
            let data = {};
            this.netbuffer.append(transmit);
            let result = false;
            while ((result = this.netbuffer.get()) !== false) {
                try {
                    this.received = decompress(this.received);
                    data = JSON.parse(this.received);
                } catch (e) {
                }
                if (!data.hasOwnProperty('id'))
                    data.id = 0;
                if (data.hasOwnProperty('event') && data.hasOwnProperty('content')) {
                    this.emit(data.id, data.event, data.content);
                }
            }
        }

        /***
         * ·¢ËÍÏìÓ¦ÄÚÈÝ
         * @param id
         * @param event
         * @param content
         * @returns {*}
         */
        send (id, event, content) {
            if (this.connected === true) {
                var transmit = '';
                try {
                    transmit = JSON.stringify({id: id, event: event, content: content});
                } catch (e) {
                }
                if (transmit !== '') {
                    this.sent = transmit;
                    transmit = compress(transmit);
                    this.writeraw(transmit);
                }
            } else
                return false;
        }

        /***
         * ¶Ï¿ªÁª½Ó
         */
        disconnect () {
            this.connected = false;
            this.emit('disconnect');
        };
    }
util.inherits(client, eventemitter);

module.exports = new client();