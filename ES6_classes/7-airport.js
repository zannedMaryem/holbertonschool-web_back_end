export default class Airport {
  constructor(name, code) {
    this.name = name;
    this.code = code;
  }

  // Getter for name
  get name() {
    return this._name;
  }

  // setter for name
  set name(value) {
    if (typeof value !== 'string') {
      throw new TypeError('name must be a string');
    }
    this._name = value;
  }

  // getter for code
  get code() {
    return this._code;
  }

  // setter for code
  set code(value) {
    if (typeof value !== 'string') {
      throw new TypeError('code must be string');
    }
    this._code = value;
  }

  // Override default string description
  toString() {
    return `[object ${this.code}]`;
  }
}
