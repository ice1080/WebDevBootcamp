
function printReverse(arr) {
	while (arr.length > 0) {
		console.log(arr.pop());
	}
}

// printReverse([1,2,3,4]);
// printReverse(["a", "b", "c"]);

function isUniform(arr) {
	var firstItem = arr.shift();
	var isEqual = true;
	arr.forEach(function(item) {
		if (item !== firstItem) {
			isEqual = false;
		}
	});
	return isEqual;
}

// console.log(isUniform([1,2,1,1]));
// console.log(isUniform(["a", "b", "p"]));
// console.log(isUniform(["b", "b", "b"]));

function sumArray(arr) {
	var total = 0;
	arr.forEach(function(item) {
		total += item;
	});
	return total;
}

// console.log(sumArray([1,2,3]));
// console.log(sumArray([10,3,10,4]));
// console.log(sumArray([-5,100]));

function max(arr) {
	var maxNum = Number.MIN_VALUE;
	arr.forEach(function(item) {
		if (item > maxNum) {
			maxNum = item;
		}
	});
	return maxNum
}

console.log(max([1,2,3]));
console.log(max([10,3,10,4]));
console.log(max([-5,100]));

