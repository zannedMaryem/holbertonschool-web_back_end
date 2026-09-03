export default class Car {
  constructor(brand, motor, color) {
    this._barnd = brand;
    this._motor = motor;
    this._color = color;
  }

  get brand() {
    return this._barnd;
  }

  get motor() {
    return this._motor;
  }

  get color() {
    return this._color;
  }

  // Clone method
  cloneCar() {
    // Use the constructor symbol to ensure a new instance of the same class
    const NewCar = this.constructor[Symbol.species] || this.constructor;
    return new NewCar(this._brand, this._motor, this._color);
  }

  // Define Symbol.species to control what cloneCar returns
  static get [Symbol.species]() {
    return this;
  }
}
