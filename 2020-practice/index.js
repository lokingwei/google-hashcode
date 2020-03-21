const fs= require('fs');

function solve(maxSlice, typeCnt, pizza = []) {
  pizza.sort();
  const sortedPizza = pizza.reverse();
  let currentSlice = 0;

  sortedPizza.forEach((v) => {
    if(currentSlice + v < maxSlice) {
      currentSlice += v;
    }
  })
}

const problem = ['a_example.in', 'b_small.in', 'c_medium.in', 'd_quite_big.in', 'e_also_big.in']

problem.forEach((file) => {

})

const input= fs.readFileSync(0,'utf8').trim().split('\n').slice(1)
  .filter((_,i)=>i%2);

console.log(input.map((e,i)=>`Case #${i+1}: ${solve(e)}`).join('\n'));

function solve(str) {
    const len= str.length,
          waste= Math.floor(len/2);
    let score = 0;
    for (let i= waste; i<len; i++) score+= +str[i];
    let maxScore= score;
    for (let i= 1; i<=waste; i++) {
        score+= +str[waste-i] - str[len-i];
        if (score > maxScore) maxScore= score;
    }
    return maxScore;
}