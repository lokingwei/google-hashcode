const fs= require('fs');

const [,,problem] = process.argv
const inputFileName = `${problem}.in`
const outputFileName = `${problem}.out`

const input = fs.readFileSync(inputFileName,'utf8').trim().split('\n').splice(1).map((v, index) => {
  return [index].concat(v.split(' '))
})

fs.writeFileSync(outputFileName, '')

function out(data) {
  fs.appendFileSync(outputFileName, data);
}

function lg(data) {
  console.log(data)
}

function findInterestPoint(listA, listB) {
  const intersect = listA.filter(v => listB.includes(v))
  const left = listA.filter(v => !listB.includes(v))
  const right = listB.filter(v => !listA.includes(v))
  return Math.min(intersect.length, left.length, right.length)
}

function last(array) {
  return array[array.length - 1];
}

function solve(input) {
  input.sort((l, r) => l[1] < r[1])
  input.sort((l, r) => Number(r[2]) - Number(l[2]))

  const chain = [[]]
  let oriLength = input.length
  let currentInterestPoint = 0

  while(input.length > 0 && oriLength - input.length < 1000) {
    const selectedIndex = input.findIndex(v => v[1] === 'H')
    const selected = input.splice(selectedIndex, 1)[0]
    last(chain).push(selected)

    let dump = true
    let perfect = 999
    let perfectLimit = 15
    let interestPercentage = 0.6
    let toCompareIndex = 0

    lg(input.length)
    while(toCompareIndex < input.length &&  perfect > perfectLimit && dump) {
      const toCompare = input[toCompareIndex]
      const interestPoint = findInterestPoint(selected.slice(3), toCompare.slice(3))
      perfect = Math.min(Math.floor(Number(selected[2]) / 2), Math.floor(Number(toCompare[2]) / 2))

      if(interestPoint * interestPercentage >= perfect) {
        dump = false
        currentInterestPoint += interestPoint
        lg(interestPoint)
        last(chain).push(input.splice(toCompareIndex, 1)[0])
        if(toCompare[1] === 'V') {
          chain.push([])
        }
      }
      ++toCompareIndex
    }

    if(dump) {
      chain.push([])
    }
  }
  chain.pop()

  let result = chain.filter(v => last(v)[1] === 'H').reduce((arr, v) => {
    arr = arr.concat(v.map(v2 => [v2[0]]))
    return arr
  }, [])
  const withVerticalEnd = chain.filter(v => last(v)[1] === 'V')

  for(let i = 0; i < withVerticalEnd.length; ++i) {
    if(i % 2 === 1) {
      withVerticalEnd[i].reverse()
      last(result).push(withVerticalEnd[i].splice(0, 1)[0][0])
      result = result.concat(withVerticalEnd[i].map(v => [v[0]]))
    } else {
      result = result.concat(withVerticalEnd[i].map(v => [v[0]]))
    }
  }

  lg(result)

  out(result.length)
  out('\n')
  result.forEach((v) => {
    out(v.join(' '))
    out('\n')
  })
}

solve(input)