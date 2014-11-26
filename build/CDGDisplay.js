var nid;
(function (nid) {
    var utils;
    (function (utils) {
        var MEMORY = (function () {
            function MEMORY() {
            }
            MEMORY.allocateUint8 = function (len) {
                MEMORY.u8 = new Uint8Array(len);
            };
            MEMORY.allocateUint16 = function (len) {
                MEMORY.u16 = new Uint16Array(len);
            };
            MEMORY.allocateUint32 = function (len) {
                MEMORY.u32 = new Uint32Array(len);
            };
            MEMORY.getUint8 = function () {
                if (!MEMORY.u8) {
                    MEMORY.allocateUint8(10);
                }
                return MEMORY.u8Index++;
            };
            MEMORY.getUint16 = function () {
                if (!MEMORY.u16) {
                    MEMORY.allocateUint16(24);
                }
                return MEMORY.u16Index++;
            };
            MEMORY.getUint32 = function () {
                if (!MEMORY.u32) {
                    MEMORY.allocateUint32(10);
                }
                return MEMORY.u32Index++;
            };
            MEMORY.allocateInt8 = function (len) {
                MEMORY.i8 = new Int8Array(len);
            };
            MEMORY.allocateInt16 = function (len) {
                MEMORY.i16 = new Int16Array(len);
            };
            MEMORY.allocateInt32 = function (len) {
                MEMORY.i32 = new Int32Array(len);
            };
            MEMORY.getInt8 = function () {
                if (!MEMORY.i8) {
                    MEMORY.allocateInt8(10);
                }
                return MEMORY.i8Index++;
            };
            MEMORY.getInt16 = function () {
                if (!MEMORY.i16) {
                    MEMORY.allocateInt16(24);
                }
                return MEMORY.i16Index++;
            };
            MEMORY.getInt32 = function () {
                if (!MEMORY.i32) {
                    MEMORY.allocateInt32(10);
                }
                return MEMORY.i32Index++;
            };
            MEMORY.allocateFloat32 = function (len) {
                MEMORY.f32 = new Float32Array(len);
            };
            MEMORY.allocateFloat64 = function (len) {
                MEMORY.f64 = new Float64Array(len);
            };
            MEMORY.getFloat32 = function () {
                if (!MEMORY.f32) {
                    MEMORY.allocateFloat32(10);
                }
                return MEMORY.f32Index++;
            };
            MEMORY.getFloat64 = function () {
                if (!MEMORY.f64) {
                    MEMORY.allocateFloat64(10);
                }
                return MEMORY.f64Index++;
            };
            /**
             * UNSIGNED INTEGERS
             */
            MEMORY.u8Index = 0;
            MEMORY.u16Index = 0;
            MEMORY.u32Index = 0;
            /**
             * SIGNED INTEGERS
             */
            MEMORY.i8Index = 0;
            MEMORY.i16Index = 0;
            MEMORY.i32Index = 0;
            /**
             * FLOAT
             */
            MEMORY.f32Index = 0;
            MEMORY.f64Index = 0;
            return MEMORY;
        })();
        utils.MEMORY = MEMORY;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="../MEMORY.ts" />
/**
 * Created by nidin on 19-07-2014.
 */
var nid;
(function (nid) {
    var MEMORY = nid.utils.MEMORY;
    var CDGDisplay = (function () {
        function CDGDisplay(canvas) {
            this.EOF = "EndOfFile";
            this.SC_MASK = 0x3F;
            this.CDG_CMD = 0x09;
            this.MEMORY_PRESET = 1;
            this.BORDER_PRESET = 2;
            this.TILE_BLOCK_NORMAL = 6;
            this.TILE_BLOCK_XOR = 38;
            this.SCROLL_PRESET = 20;
            this.SCROLL_COPY = 24;
            this.DEFINE_TRANSPARENT_COLOR = 28;
            this.LOAD_COLOR_TABLE_LO = 30;
            this.LOAD_COLOR_TABLE_HIGH = 31;
            this.WIDTH = 320;
            this.HEIGHT = 216;
            this.currentPos = -1;
            this.speed = 1;
            //Init strict typed variables
            this.type = MEMORY.getUint8();
            this.SC_MASK = MEMORY.getUint8();
            this.CDG_CMD = MEMORY.getUint8();
            this.C = MEMORY.getUint32();
            this.C0 = MEMORY.getUint32();
            this.C1 = MEMORY.getUint32();
            this.ROW = MEMORY.getUint32();
            this.COL = MEMORY.getUint32();
            this.SCANL = MEMORY.getUint32();
            MEMORY.u8[this.SC_MASK] = 0x3F;
            MEMORY.u8[this.CDG_CMD] = 0x09;
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
            this.imageData = this.context.createImageData(this.WIDTH, this.HEIGHT);
            this.bitmapData = this.imageData.data;
            this.colorTable = [];
        }
        CDGDisplay.prototype.loadBytes = function (data) {
            this.bytes = data;
            this.currentPos = 0;
            this.currentPacket = 0;
            this.lastRanderdPosition = 0;
            this.pixelColorIndex = [];
            this.ready = true;
        };
        CDGDisplay.prototype.render = function (tempPos, transparent) {
            if (transparent === void 0) { transparent = false; }
            tempPos *= this.speed;
            this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);
            for (var y = 0; y < this.HEIGHT; y++) {
                for (var x = 0; x < this.WIDTH; x++) {
                    var rgb = this.colorTable[this.pixelColorIndex[y * this.WIDTH + x]];
                    if (rgb) {
                        this.bitmapData[((this.WIDTH * y) + x) * 4] = rgb[0];
                        this.bitmapData[((this.WIDTH * y) + x) * 4 + 1] = rgb[1];
                        this.bitmapData[((this.WIDTH * y) + x) * 4 + 2] = rgb[2];
                        this.bitmapData[((this.WIDTH * y) + x) * 4 + 3] = 255;
                    }
                }
            }
            if (this.currentPos > tempPos) {
                this.currentPacket = 0;
                for (var i = 0; i < tempPos; i++) {
                    this.draw();
                }
            }
            else {
                for (i = this.currentPos; i < tempPos; i++) {
                    this.draw();
                }
            }
            this.currentPos = tempPos;
            //var scale:number = Math.min(this.width / this.WIDTH, this.width / this.HEIGHT);
            //var bd:BitmapData = new BitmapData(this.WIDTH * scale, this.HEIGHT * scale, true, 0x00000000);
            //bd.draw(bitData);
            //bitData.dispose();
            //bitData = null;
            //if (transparent && this.clearColor) {
            //bd.threshold(bd, new Rectangle(0, 0, this.WIDTH * scale, this.HEIGHT * scale), new Point(0, 0), "==", this.clearColor + 0xff000000, 0x00000000, 0xFFFFFFFF, true);
            //}
            this.context.putImageData(this.imageData, 0, 0);
        };
        CDGDisplay.prototype.setSize = function (w, h) {
            this.width = w;
            this.height = h;
        };
        CDGDisplay.prototype.draw = function () {
            var i = this.currentPacket * 24;
            this.currentPacket++;
            if (i > this.bytes.length) {
                //dispatchEvent(new Event(this.EOF));
                console.log(this.EOF);
                return false;
            }
            var percent = i / this.bytes.length;
            if ((this.bytes[i] & MEMORY.u8[this.SC_MASK]) == MEMORY.u8[this.CDG_CMD]) {
                MEMORY.u8[this.type] = (this.bytes[i + 1] & MEMORY.u8[this.SC_MASK]);
                switch (MEMORY.u8[this.type]) {
                    case this.MEMORY_PRESET:
                        //WARN: color format changed
                        //this.clearColor = this.colorTable[(this.bytes[i + 4] & 0x0F)];
                        var repeat = this.bytes[i + 5] & 0x0F;
                        if (repeat == 0) {
                            this.clear((this.bytes[i + 4] & 0x0F));
                        }
                        break;
                    case this.BORDER_PRESET:
                        break;
                    case this.TILE_BLOCK_NORMAL:
                    case this.TILE_BLOCK_XOR:
                        MEMORY.u32[this.C0] = this.bytes[i + 4] & 0x0F;
                        MEMORY.u32[this.C1] = this.bytes[i + 5] & 0x0F;
                        var row = (this.bytes[i + 6] & 0x1F) * 12;
                        var col = (this.bytes[i + 7] & MEMORY.u8[this.SC_MASK]) * 6;
                        for (var y = 0; y < 12; y++) {
                            MEMORY.u32[this.SCANL] = this.bytes[i + 8 + y] & MEMORY.u8[this.SC_MASK];
                            for (var l = 0; l < 6; l++) {
                                //TODO: check if (scanLine & 0x1) should forced to int
                                if (MEMORY.u32[this.SCANL] & 0x1) {
                                    MEMORY.u32[this.C] = MEMORY.u32[this.C1];
                                }
                                else {
                                    MEMORY.u32[this.C] = MEMORY.u32[this.C0];
                                }
                                // do XOR calculation if need to
                                if (MEMORY.u8[this.type] == this.TILE_BLOCK_XOR) {
                                    MEMORY.u32[this.C] = this.pixelColorIndex[(col + (5 - l)) + (row + y) * this.WIDTH] ^ MEMORY.u32[this.C];
                                }
                                this.pixelColorIndex[(col + (5 - l)) + (row + y) * this.WIDTH] = MEMORY.u32[this.C];
                                MEMORY.u32[this.SCANL] = MEMORY.u32[this.SCANL] >> 1;
                            }
                        }
                        break;
                    case this.DEFINE_TRANSPARENT_COLOR:
                        break;
                    case this.LOAD_COLOR_TABLE_LO:
                    case this.LOAD_COLOR_TABLE_HIGH:
                        var startIndex = MEMORY.u8[this.type] == this.LOAD_COLOR_TABLE_HIGH ? 8 : 0;
                        for (var m = 0; m < 8; m++) {
                            var cdgColor = this.decodeColor(this.bytes[i + 4 + m * 2], this.bytes[i + 5 + m * 2]);
                            //this.colorTable[m + startIndex] = this.RGBToHex(cdgColor[0] * 17, cdgColor[1] * 17, cdgColor[2] * 17);
                            this.colorTable[m + startIndex] = [cdgColor[0] * 17, cdgColor[1] * 17, cdgColor[2] * 17];
                        }
                        break;
                }
            }
            return true;
        };
        CDGDisplay.prototype.RGBToHex = function (r, g, b) {
            var hex = r << 16 ^ g << 8 ^ b;
            return hex;
        };
        CDGDisplay.prototype.clear = function (color) {
            for (var y = 0; y < this.HEIGHT; y++) {
                for (var x = 0; x < this.WIDTH; x++) {
                    this.pixelColorIndex[y * this.WIDTH + x] = color;
                }
            }
        };
        CDGDisplay.prototype.decodeColor = function (high, low) {
            return [
                ((high & MEMORY.u8[this.SC_MASK]) >> 2),
                (((high & 0x3) << 2) | ((low >> 4) & 0x3)),
                (low & 0x0F)
            ];
        };
        return CDGDisplay;
    })();
    nid.CDGDisplay = CDGDisplay;
})(nid || (nid = {}));
//# sourceMappingURL=CDGDisplay.js.map