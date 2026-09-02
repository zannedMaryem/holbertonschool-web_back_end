export default class Currency{
  constructor(code, name){
		this.code = code;
    this.name = name;
  }

	// Getter for code
	get code() {
		return this._code;
	}

	// Setter for code
	set code(value){
		if (typeof value !== 'string') {
			throw new TypeError('code must be a string');
		}
		if (value.length === 0) {
      throw new TypeError('Code must not be empty');
    }
		this._code = value;
	}

	// Getter for name
	get name() {
		return this._name;
	}

	// Setter for name
	set name(value) {
		if (typeof value !== 'string'){
			throw new TypeError('Name must be a string');
		}
		if (value.length === 0) {
      throw new TypeError('Name must not be empty');
    }
		this._name = value;
	}

	displayFullCurrency() {
		return `${this.name} (${this.code})`;
	}
}
