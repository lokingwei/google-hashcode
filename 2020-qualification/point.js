const fs= require('fs');

const problemList = [
  'a_example',
  'b_read_on',
  'c_incunabula',
  'd_tough_choices',
  'e_so_many_books',
  'f_libraries_of_the_world'
]

problemList.forEach((problem) => {
  const inputFileName = `${problem}.in`
  const outputFileName = `${problem}.point`

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

  function out(data) {
    lg(data)
    fs.appendFileSync(outputFileName, data);
  }

  function lg(data) {
    console.log(data)
  }
  
  function solve(input) {
    const totalPoint = input.bookScores.reduce((sum, v) => {
      sum += v
      return sum
    }, 0)
    const libWithScore = input.libs.map(v => {
      const score = v.bookIds.reduce((sum, b) => {
        sum += input.bookScores[b]
        return sum
      }, 0)
      const scorePerDay = score/(v.signUpDays + v.shipNum/v.bookIds.length)
      return {
        score: score,
        scorePerDay: scorePerDay
      }
    })
  
    const avgScorePerDay = libWithScore.reduce((sum, v) => {
      sum += v.scorePerDay
      return sum
    }, 0)/libWithScore.length
  
    const bookOccurance = input.libs.reduce((obj, v) => {
      v.bookIds.forEach(b => {
        if(obj[b]) {
          obj[b] += 1
        } else {
          obj[b] = 1
        }
      })
      return obj
    }, {})
  
    const uniqueBookCnt = Object.entries(bookOccurance).reduce((sum, entry) => {
      if(entry[1] === 1) {
        sum += 1
      }
      return sum
    }, 0)

    const totalSignUp = input.libs.reduce((sum, v) => {
      sum += v.signUpDays
      return sum
    }, 0)

    const utilizeAllDay = avgScorePerDay * input.days
  
    out(`=== Problem ${problem} =====`);
    out(`total day: ${input.days}`);
    out(`total day needed to sign up: ${totalSignUp}`);
    out(`average day for 1 lib: ${totalSignUp/input.libs.length}`);
    out(`average lib for problem: ${input.days/(totalSignUp/input.libs.length)}`);
    out(`average score per day: ${avgScorePerDay}`);
    out(`total point: ${totalPoint}`);
    out(`utilize all day: ${utilizeAllDay}`);
    out(`unique book: ${uniqueBookCnt}`);
    out(`==============================`);
  }

  fs.writeFileSync(outputFileName, '')
  solve(input)
})
