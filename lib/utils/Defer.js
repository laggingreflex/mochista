module.exports = class Defer {
  constructor() {
    this.reset();
  }
  reset() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    })
  }
  get then() { return this.promise.then.bind(this.promise) }
  get catch() { return this.promise.catch.bind(this.promise) }
}
