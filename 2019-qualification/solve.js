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

function buildTagObj(list) {
  return list.reduce((obj, photo) => {
    photo.splice(1).forEach(tag => {
      obj[tag] = (obj[tag] || 0) + 1
    })
    return obj
  }, {})
}

function buildMaxGroup(list) {
  const group = list.reduce((obj, hPhoto) => {
    const max = Math.floor(Number(hPhoto[0]) / 2)
    obj[max] ? obj[max].push(hPhoto) : obj[max] = [hPhoto]
    return obj
  }, {})
  const sortedKey = Object.keys(group).sort().reverse()
  return sortedKey.reduce((obj,v) => {
    obj[v] = group[v]
    return obj
  }, {})
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
  input.sort((l, r) => l[2] < r[2])
  input.sort((l, r) => Number(r[1]) - Number(l[1]))

  const chain = [[]]
  let currentInterestPoint = 0
  let noMoreHorizontal = false
  const possiblePoint = Number(input[0][2])
  const firstHIndex = input.findIndex(v => v[1] === 'H')
  if(firstHIndex < 0) {
    throw new Error()
  }
  const horizontal = input.splice(firstHIndex, 1)[0]
  last(chain).push(horizontal)
  while(input.length > 0 && possiblePoint > 0 && !noMoreHorizontal) {
    const left = last(last(chain))
    let toCompareIndex = 0
    let allowLess = 0
    let lessLimit = 5
    let skip = false
    lg(input.length)
    while(toCompareIndex < input.length && !skip) {
      const toCompare = input[toCompareIndex]
      const interestPoint = findInterestPoint(left.slice(3), toCompare.slice(3))
      const perfect = Math.floor(Number(toCompare[2]) / 2)
      if(allowLess > lessLimit) {
        const firstHIndex = input.findIndex(v => v[1] === 'H')
        if(firstHIndex < 0) {
          noMoreHorizontal = true
          break;
        }
        const horizontal = input.splice(firstHIndex, 1)[0]
        chain.push([])
        last(chain).push(horizontal)
        break;
      }
      if(interestPoint > perfect - allowLess) {
        match = true
        currentInterestPoint += interestPoint
        lg(currentInterestPoint)
        last(chain).push(input.splice(toCompareIndex, 1)[0])
        if(toCompare[1] === 'V') {
          const firstHIndex = input.findIndex(v => v[1] === 'H')
          if(firstHIndex < 0) {
            noMoreHorizontal = true
            break;
          }
          const horizontal = input.splice(firstHIndex, 1)[0]
          chain.push([])
          last(chain).push(horizontal)
        }
        break;
      }
      ++toCompareIndex
      if(!match && toCompareIndex === input.length) {
        allowLess += 1
        toCompareIndex = 0
      }
    }
  } 
  let result = []

  for(let i = 0; i < chain.length; ++i) {
    if(i === chain.length -1) {
      if(input.length > 0) {
        result = result.concat(chain[i].map(v => [v[0]]))
        last(result).push(input[0][0])
      }
      break;
    } 
    if(i % 2 === 1) {
      chain[i].reverse()
      last(result).push(chain[i].splice(1)[0][0])
      result = result.concat(chain[i].map(v => [v[0]]))
    } else {
      result = result.concat(chain[i].map(v => [v[0]]))
    }
  }
  out(result.length)
  out('\n')
  result.forEach((v) => {
    out(v.join(' '))
    out('\n')
  })
  // const vertical = input.filter(v => v[0] === 'V').map(v => v.splice(1));
  // const horizontal = input.filter(v => v[0] === 'H').map(v => v.splice(1));
  // const groupedHorizontal = buildMaxGroup(horizontal)
  // const groupedVertical = buildMaxGroup(vertical)
  // const singleArray = Object.keys(groupedHorizontal)
  // // lg(groupedHorizontal)
  // // lg(groupedVertical)
  // const chains = [[]]

  // const points = Object.keys(groupedHorizontal);
  // const pointIndex = 0;
  // while(pointIndex < points.length) {
  //   const currentPoint = points[pointIndex]
  //   if(currentPoint === 0) {
  //     break
  //   } else {
  //     const currentGroup = groupedHorizontal[currentPoint]
  //     const toCheck = currentGroup.shift()
  //     chains[chains.length - 1].push(toCheck)
  //     const left = chains.splice(-1).splice(-1)
  //     let foundRight = false
  //     while(currentGroup.length > 0 && !foundRight) {
  //       let toCompareIndex = 0
  //       while(toCompareIndex < currentGroup.length) {
  //         const toCompare = currentGroup[toCompareIndex]
  //         const interestPoint = findInterestPoint(left.splice(1), toCompare.splice(1))
  //         lg(interestPoint);
  //         if(interestPoint === currentPoint) {
  //           chains[chains.length - 1].push(currentGroup[toCompareIndex].shift())
  //           foundRight = true
  //           break
  //         }
  //         ++toCompareIndex;
  //       }
  //     }
  //   }
  //   ++pointIndex
  // }
  // lg(chain)
}

solve(input)