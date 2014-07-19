///<reference path="../MEMORY.ts" />
/**
 * Created by nidin on 19-07-2014.
 */
module nid
{
    import MEMORY = nid.utils.MEMORY;

    export class CDGDisplay
    {
        private EOF:string = "EndOfFile";
        private SC_MASK:number = 0x3F;
        private CDG_CMD:number = 0x09;

        private MEMORY_PRESET:number = 1;
        private BORDER_PRESET:number = 2;
        private TILE_BLOCK_NORMAL:number = 6;
        private TILE_BLOCK_XOR:number = 38;
        private SCROLL_PRESET:number = 20;
        private SCROLL_COPY:number = 24;
        private DEFINE_TRANSPARENT_COLOR:number = 28;
        private LOAD_COLOR_TABLE_LO:number = 30;
        private LOAD_COLOR_TABLE_HIGH:number = 31;

        private WIDTH:number = 320;
        private HEIGHT:number = 216;

        private bytes:Uint8Array;
        private currentPos:number = -1;
        private colorTable;
        private clearColor:number;
        private currentPacket:number;
        private lastRanderdPosition:number;
        private width:number;
        private height:number;
        private pixelColorIndex;

        public imageData:ImageData;
        public bitmapData:Uint8Array;
        public speed:number = 1;
        public ready:boolean;
        public canvas;
        public context;

        private type:number;
        private C:number;
        private C0:number;
        private C1:number;
        private ROW:number;
        private COL:number;
        private SCANL:number;

        constructor(canvas?)
        {
            //Init strict typed variables
            this.type       = MEMORY.getUint8();
            this.SC_MASK    = MEMORY.getUint8();
            this.CDG_CMD    = MEMORY.getUint8();

            this.C          = MEMORY.getUint32();
            this.C0         = MEMORY.getUint32();
            this.C1         = MEMORY.getUint32();
            this.ROW        = MEMORY.getUint32();
            this.COL        = MEMORY.getUint32();
            this.SCANL      = MEMORY.getUint32();

            MEMORY.u8[this.SC_MASK] = 0x3F;
            MEMORY.u8[this.CDG_CMD] = 0x09;

            this.canvas = canvas;
            this.context = canvas.getContext('2d');
            this.imageData = this.context.createImageData(this.WIDTH,this.HEIGHT);
            this.bitmapData = this.imageData.data;
            this.colorTable = [];
        }
        public loadBytes(data:Uint8Array):void{
            this.bytes = data;
            this.currentPos = 0;
            this.currentPacket = 0;
            this.lastRanderdPosition = 0;
            this.pixelColorIndex = [];
            this.ready = true;
        }
        public render(tempPos:number, transparent:boolean = false):void
        {
            tempPos *= this.speed;
            this.context.clearRect(0, 0, this.WIDTH, this.HEIGHT);

            for (var y:number = 0; y < this.HEIGHT; y++) {
                for (var x:number = 0; x < this.WIDTH; x++) {

                    var rgb = this.colorTable[this.pixelColorIndex[y * this.WIDTH + x]];
                    if(rgb) {
                        this.bitmapData[((this.WIDTH * y) + x) * 4] = rgb[0];
                        this.bitmapData[((this.WIDTH * y) + x) * 4 + 1] = rgb[1];
                        this.bitmapData[((this.WIDTH * y) + x) * 4 + 2] = rgb[2];
                        this.bitmapData[((this.WIDTH * y) + x) * 4 + 3] = 255;
                    }
                    /*this.bitmapData[((this.WIDTH * y) + x) * 4]     = (rgb & 0xFF0000) >> 16;
                    this.bitmapData[((this.WIDTH * y) + x) * 4 + 1] = (rgb & 0x00FF00) >> 8;
                    this.bitmapData[((this.WIDTH * y) + x) * 4 + 2] = (rgb & 0x0000FF);
                    this.bitmapData[((this.WIDTH * y) + x) * 4 + 3] = 255;*/

                    /*var r = (rgb & 0xFF0000) >> 16;
                    var g = (rgb & 0x00FF00) >> 8;
                    var b = (rgb & 0x0000FF);*/

                    /*this.context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + 255 + ')';
                    this.context.fillRect(x, y, 1, 1);*/
                }
            }
            if (this.currentPos > tempPos) {
                this.currentPacket = 0;
                for (var i:number = 0; i < tempPos; i++) {
                    this.draw();
                }
            }else {
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


            this.context.putImageData(this.imageData,0,0);
        }

        public setSize(w:number, h:number):void
        {
            this.width = w;
            this.height = h;
        }

        private draw():Boolean
        {
            var i:number = this.currentPacket * 24;
            this.currentPacket++;
            if (i > this.bytes.length) {
                //dispatchEvent(new Event(this.EOF));
                console.log(this.EOF);
                return false;
            }

            var percent:number = i / this.bytes.length;

            if ((this.bytes[i] & MEMORY.u8[this.SC_MASK]) == MEMORY.u8[this.CDG_CMD])
            {
                MEMORY.u8[this.type] = (this.bytes[i + 1] & MEMORY.u8[this.SC_MASK]);

                switch (MEMORY.u8[this.type])
                {
                    case this.MEMORY_PRESET :
                        //WARN: color format changed
                        //this.clearColor = this.colorTable[(this.bytes[i + 4] & 0x0F)];
                        var repeat:number = this.bytes[i + 5] & 0x0F;
                        if (repeat == 0) {
                            this.clear((this.bytes[i + 4] & 0x0F));
                        }
                        break;

                    case this.BORDER_PRESET :
                        // not implemente
                        break;
                    case this.TILE_BLOCK_NORMAL :
                    case this.TILE_BLOCK_XOR :
                        MEMORY.u32[this.C0]  = this.bytes[i + 4] & 0x0F;
                        MEMORY.u32[this.C1]  = this.bytes[i + 5] & 0x0F;
                        var row = (this.bytes[i + 6] & 0x1F) * 12;
                        var col = (this.bytes[i + 7] & MEMORY.u8[this.SC_MASK]) * 6;

                        for (var y:number = 0; y < 12; y++)
                        {
                            MEMORY.u32[this.SCANL] = this.bytes[i + 8 + y] & MEMORY.u8[this.SC_MASK];

                            for (var l:number =0; l< 6; l++)
                            {
                                //TODO: check if (scanLine & 0x1) should forced to int

                                if(MEMORY.u32[this.SCANL] & 0x1){
                                    MEMORY.u32[this.C] = MEMORY.u32[this.C1];
                                }else{
                                    MEMORY.u32[this.C] = MEMORY.u32[this.C0];
                                }
                                // do XOR calculation if need to
                                if (MEMORY.u8[this.type] == this.TILE_BLOCK_XOR) {
                                    MEMORY.u32[this.C] = this.pixelColorIndex[
                                            (col + (5 - l)) +
                                            (row + y) * this.WIDTH
                                        ] ^ MEMORY.u32[this.C];
                                }
                                this.pixelColorIndex[
                                        (col + (5 - l)) +
                                        (row + y) * this.WIDTH
                                    ] = MEMORY.u32[this.C];
                                MEMORY.u32[this.SCANL] = MEMORY.u32[this.SCANL] >> 1;
                            }
                        }
                        break;
                    case this.DEFINE_TRANSPARENT_COLOR :
                        // not implemented
                        break;
                    case this.LOAD_COLOR_TABLE_LO :
                    case this.LOAD_COLOR_TABLE_HIGH :
                        var startIndex:number = MEMORY.u8[this.type] == this.LOAD_COLOR_TABLE_HIGH ? 8:0;
                        for (var m:number = 0; m < 8; m++)
                        {
                            var cdgColor = this.decodeColor(this.bytes[i + 4 + m * 2], this.bytes[i + 5 + m * 2]);
                            //this.colorTable[m + startIndex] = this.RGBToHex(cdgColor[0] * 17, cdgColor[1] * 17, cdgColor[2] * 17);
                            this.colorTable[m + startIndex] = [cdgColor[0] * 17, cdgColor[1] * 17, cdgColor[2] * 17];
                        }
                        break;
                }
            }
            return true;
        }
        private RGBToHex(r:number, g:number, b:number):number
        {
            var hex:number = r << 16 ^ g << 8 ^ b;
            return hex;
        }
        private clear(color:number):void
        {
            for (var y:number = 0; y < this.HEIGHT; y++) {
                for (var x:number = 0; x < this.WIDTH; x++) {
                    this.pixelColorIndex[y * this.WIDTH + x] = color;
                }
            }
        }
        private decodeColor(high:number, low:number)
        {
            return [
                ((high & MEMORY.u8[this.SC_MASK]) >> 2),
                (((high & 0x3) << 2) | ((low >> 4) & 0x3)),
                (low & 0x0F)
            ];
        }
    }
}