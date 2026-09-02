export default class HolbertonCourse{
    constructor(name, length, students){
        this.name = name;
        this.length = length;
        this.students = students;
    }
    // Getter for name
    get name() {
        return this._name;
    }

    // Setter for name with validation
    set name(value){
        if(!(value instanceof String)){
            throw new TypeError('Name of the course must be a string');
        }
        if(value === null){
            throw new TypeError('Name of the course must not be empty');
        }
        this._name = value;
    }

    // Getter for length
    get length(){
        return this._length;
    }

    //Setter for length with validation
    set length(value){
        if (!Number.isNumber(value)){
            throw new TypeError('Length of the course must be a number');
        }
        if (value <= 0){
            throw new TypeError('Length of the course must be > 0');
        }
        this._length = value;
    }
    
    //Getter for students
    get students(){
        return this._students;
    }

    // Setter for students with validation
    set students(value){
        if (!Array.isArray(value)){
            throw new TypeError('students must be an array');
        }
        if (value === null){
            throw new TypeError('students musnt be empty');
        }
        this._students = value;
    }
}
