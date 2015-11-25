    "use strict";
    const IntSize = {
        write: 'writeUInt16BE',
        read: 'readUInt16BE',
        len: 2
    };

    class netbuffer {
        constructor(){
            this.length = -1;
            this.size = 0;
            this.buffer = new Buffer(0);
        }

        pack (Data) {
            let Length = new Buffer(IntSize.len);
            Length[IntSize.write](Data.length, 0);
            return Buffer.concat([Length, new Buffer(Data, "binary")]);
        };

        append(buff) {
            if (!Buffer.isBuffer(buff) || buff.length < 0)
                return false;
            if (this.buffer = Buffer.concat([this.buffer, buff], this.size + buff.length)) {
                this.size += buff.length;
                if (this.size > IntSize.len && this.length < 0)
                    this.length = this.buffer[IntSize.read](0);
                return true;
            }
        };

        get () {
            if (this.size > IntSize.len && this.length < 0)
                this.length = this.buffer[IntSize.read](0);
            if (this.length <= 0 || this.length > this.size - IntSize.len)
                return false;
            let result = new Buffer(this.length);
            if (this.buffer.copy(result, 0, IntSize.len, this.length + IntSize.len)) {
                this.buffer = this.buffer.slice(this.length + IntSize.len);
                this.size -= result.length + IntSize.len;
                this.length = -1;
                return result;
            } else
                return false;
        };
    }
    module.exports = new netbuffer();