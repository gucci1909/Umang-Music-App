// const handlePromise = () => {
// try {
// const response = new Promise((res, err) => {});

// } catch (error) {

// }
// };

// const myPromise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject("foo");
//   }, 300);
// });

// myPromise
//   .then((handleFulfilledA)=>{
//     console.log(handleFulfilledA);
//   })
//   .catch((err)=>{
//     console.log("error:",err);
//   })

const isOdd = (input) => {
  const myPromise = new Promise((res, rej) => {
    if (typeof input === "number") {
      setTimeout(() => {
        if (input % 2 !== 0) {
          res(true);
        } else {
          res(false);
        }
      }, 3000);
    } else {
      rej("input is incorrect");
    }
  });
  myPromise
    .then((res) => {
      console.log("response", res);
    })
    .catch((err) => {
      console.log("error:", err);
    });
};

// isOdd(2);

const array = [8, 2, 3, 2, 4, 3, 1, 4, 6, 7];
let arr2 = {};

for (var i = 0; i < array.length; i++) {
  let x = array[i];
  if (arr2[x] === undefined) {
    arr2[x] = 1;
  } else {
    arr2[x]++;
  }
}

let arr3 = [];

for (let y in arr2) {
  arr3.push(y);
}

// console.log(arr3);

var string = "umang is presenting ";

function reverse(string) {
  var str = "";

  for (var i = string.length - 1; i >= 0; i--) {
    if (string[i] === " ") {
      for (var j = i + 1; j < string.length; j++) {
        if (string[j] === " ") {
          str += " ";
          break;
        }
        str += string[j];
        if (j === string.length - 1) {
          str += " ";
        }
      }
    }
    if (i === 0) {
      for (var k = i; k < string.length; k++) {
        if (string[k] === " ") {
          break;
        } else {
          str += string[k];
        }
      }
    }
  }
  
  console.log(str);
}

reverse(string);
