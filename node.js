//practice prototype in object

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

// console.log(
//   (() => {
//     return "rishab";
//   })()
// );

//console.log(box.prototype);

const obj = {
  name: "rishab",
  myFunction: () => {
    name = "rishab raj verma";
    return name;
  },
};

const o1 = Object.create(obj);

//console.log(o1.__proto__);

function fun() {
  const name = "ronny";
}

const f1 = new fun();
fun.prototype.newFun = () => {
  console.log("hi");
};

//f1.newFun();
