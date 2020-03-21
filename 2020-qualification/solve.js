const fs= require('fs');

const [,,problem] = process.argv
const inputFileName = `${problem}.in`
const outputFileName = `${problem}.out`

const lines = fs.readFileSync(inputFileName,'utf8').trim().split('\n');
const [bookNum, libNum, days] = lines[0].split(' ').map(v => Number(v))
const bookScores = lines[1].split(' ').map(v => Number(v))
let libs = []
for(let i = 2; i < lines.length; i += 2) {
    let [bookNum, signUpDays, shipNum] = lines[i].split(' ').map(v => Number(v))
    let bookIds = lines[i+1].split(' ').map(v => Number(v))
    libs.push({
        bookIds,
        bookNum,
        signUpDays,
        shipNum
    })
}
const input = {
    bookNum,
    libNum,
    days,
    bookScores,
    libs
}

fs.writeFileSync(outputFileName, '')

function out(data) {
  fs.appendFileSync(outputFileName, data);
}

function lg(data) {
  console.log(data)
}

function last(array) {
  return array[array.length - 1];
}


function solve(input) {
  let libBookWithCnt = input.libs.reduce((obj, v) => {
    v.bookIds.forEach(b => {
      if(obj[b]) {
        obj[b] += 1
      } else {
        obj[b] = 1
      }
    })
    return obj
  }, {})
  let sortedBook = Object.keys(libBookWithCnt).map(v => ({
    id: v,
    score: input.bookScores[v],
    cnt: libBookWithCnt[v]
  })).sort((l, r) => {
    const diff = l.cnt - r.cnt
    if(diff === 0) {
      return r.score - l.score
    }
    return diff
  })
  let dayLeft = input.days
  const libWithScore = input.libs.map((v, id) => ({
    ...v,
    id,
    maxScore: v.bookIds.reduce((sum, b) => {
      // const score = libBookWithCnt[b] === 1 ? 0 : 1
      const score = input.bookScores[b]
      sum += score
      return sum
    }, 0),
    bookIds: v.bookIds.sort((l, r) => {
      const diff = libBookWithCnt[l] - libBookWithCnt[r]
      if(diff === 0) {
        return input.bookScores[r] - input.bookScores[l]
      }
      return diff
      // const diff = input.bookScores[r] - input.bookScores[l]
      // if(diff === 0) {
      //   return libBookWithCnt[l] - libBookWithCnt[r]
      // }
      // return diff
    })
  }))
  const sortLib = libWithScore.sort((l, r) => {
    // return r.maxScore - l.maxScore
    // const diff = l.signUpDays - r.signUpDays
    // if(diff === 0) {
    //   return r.maxScore - l.maxScore
    // }
    // return diff
     const diff = r.maxScore - l.maxScore
    if(diff === 0) {
      return r.maxScore - l.maxScore
    }
    return diff
    // return l.signUpDays - r.signUpDays
  })
  lg(sortLib.slice(0, 30).map(v => v.signUpDays))
  lg(sortLib.slice(0, 30).map(v => v.maxScore))

  const result = []
  while(sortLib.length > 0 && dayLeft > 0) {
    const selectedLib = sortLib.splice(0, 1)[0]
    dayLeft -= selectedLib.signUpDays
    result.push(selectedLib)
  }

  out(result.length)
  out('\n')
  result.forEach(v => {
    out(v.id)
    out(' ')
    out(v.bookIds.length)
    out('\n')
    out(v.bookIds.join(' '))
    out('\n')
  })
}

solve(input)
