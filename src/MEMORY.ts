module nid.utils
{
    export class MEMORY
    {
        /**
         * UNSIGNED INTEGERS
         */
        static u8Index:number=0;
        static u16Index:number=0;
        static u32Index:number=0;
        static u8:Uint32Array;
        static u16:Uint32Array;
        static u32:Uint32Array;

        static allocateUint8(len:number):void{
            MEMORY.u8 = new Uint8Array(len);
        }
        static allocateUint16(len:number):void{
            MEMORY.u16 = new Uint16Array(len);
        }
        static allocateUint32(len:number):void{
            MEMORY.u32 = new Uint32Array(len);
        }
        static getUint8():number{
            if(!MEMORY.u8){
                MEMORY.allocateUint8(10);
            }
            return MEMORY.u8Index++;
        }
        static getUint16():number{
            if(!MEMORY.u16){
                MEMORY.allocateUint16(24);
            }
            return MEMORY.u16Index++;
        }
        static getUint32():number{
            if(!MEMORY.u32){
                MEMORY.allocateUint32(10);
            }
            return MEMORY.u32Index++;
        }
        /**
         * SIGNED INTEGERS
         */
        static i8Index:number=0;
        static i16Index:number=0;
        static i32Index:number=0;
        static i8:Int8Array;
        static i16:Int16Array;
        static i32:Int32Array;

        static allocateInt8(len:number):void{
            MEMORY.i8 = new Int8Array(len);
        }
        static allocateInt16(len:number):void{
            MEMORY.i16 = new Int16Array(len);
        }
        static allocateInt32(len:number):void{
            MEMORY.i32 = new Int32Array(len);
        }
        static getInt8():number{
            if(!MEMORY.i8){
                MEMORY.allocateInt8(10);
            }
            return MEMORY.i8Index++;
        }
        static getInt16():number{
            if(!MEMORY.i16){
                MEMORY.allocateInt16(24);
            }
            return MEMORY.i16Index++;
        }
        static getInt32():number{
            if(!MEMORY.i32){
                MEMORY.allocateInt32(10);
            }
            return MEMORY.i32Index++;
        }

        /**
         * FLOAT
         */
        static f32Index:number=0;
        static f64Index:number=0;
        static f32:Float32Array;
        static f64:Float64Array;

        static allocateFloat32(len:number):void{
            MEMORY.f32 = new Float32Array(len);
        }
        static allocateFloat64(len:number):void{
            MEMORY.f64 = new Float64Array(len);
        }
        static getFloat32():number{
            if(!MEMORY.f32){
                MEMORY.allocateFloat32(10);
            }
            return MEMORY.f32Index++;
        }
        static getFloat64():number{
            if(!MEMORY.f64){
                MEMORY.allocateFloat64(10);
            }
            return MEMORY.f64Index++;
        }
    }
}