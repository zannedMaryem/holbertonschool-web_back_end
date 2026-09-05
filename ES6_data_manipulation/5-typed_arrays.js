export default function createInt8TypedArray(length, position, value){
    const Arr = new Int8Array(length);
    if (Arr.length < position){
        throw new Error('Position outside range');
    }
    Arr[position] = value;
    return Arr;
}
