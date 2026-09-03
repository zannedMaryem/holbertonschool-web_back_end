export default class HolbertonClass{
    constructor(size, location){
        this.size = size;
        this.location = location;
    }

    // getter for size
    get size(){
        return this._size;
    }

    // setter for size
    set size(value){
        if (typeof value !== 'number'){
            throw new TypeError('size must be a number');
        }
        this._size = value;
    }

    //getter for location
    get location(){
        return this._location;
    }

    // setter for location
    set location(value){
        if (typeof value !== 'string'){
            throw new TypeError('location must be a string');
        }
        this._location = value;
    }

    [Symbol.toPrimitive](hint){
        if (hint === 'number'){
            return `${this.size}`;
        }
        if (hint === 'string'){
            return `${this.location}`;
        }
    }
}
