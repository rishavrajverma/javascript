//practice protype in object

//console.log(jobType.__proto__);
// console.log(jobType.constructor);
function box(value) {
  this.value = value;
}
box.prototype.getValue = function () {
  return this.value;
};
box.prototype.name = "rishab";
const b1 = new box(4);

// console.log(b1.getValue());
// console.log(b1);

console.log(
  (() => {
    return "rishab";
  })()
);
