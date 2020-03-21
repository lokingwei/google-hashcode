const fs= require('fs');

const [,,problem] = process.argv
const inputFileName = `${problem}.in`
const outputFileName = `${problem}.out`

const input = fs.readFileSync(inputFileName,'utf8').trim().split('\n').splice(1).map(v => {
  return v.split(' ')
})

const output = fs.readFileSync(outputFileName,'utf8').trim().split('\n').splice(1).map(v => {
  return v.split(' ').map(v => Number(v))
})

function judge(input, output) {
  // console.log(input)
  // console.log(output)
  const tags = []
  for(let i = 0; i <= output.length -1; ++i) {
    const slide = output[i]
    tags.push(slide.reduce((arr, v) => {
      return arr.concat(input[v].splice(2))
    }, []))
  }
  // console.log(tags)
  let interest = 0;
  for(let i = 0; i < tags.length -1; ++i) {
    const current = tags[i]
    const next = tags[i + 1]
    const intersect = current.filter(v => next.includes(v))
    const left = current.filter(v => !next.includes(v))
    const right = next.filter(v => !current.includes(v))
    interest += Math.min(intersect.length, left.length, right.length)
    // console.log(interest)
    // console.log(intersect)
    // console.log(left)
    // console.log(right)
  }
  console.log('Total interest:', interest)
}

judge(input, output)