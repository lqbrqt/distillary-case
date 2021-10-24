import { Router, json } from 'express'

import request from 'request-promise-native'
import prisma from '../prisma-client'

const router = Router()

const getSynonims = async (text) => {
  const result = await request.post('http://paraphraser.ru/api', {
    formData: {
      token: '8004cba6441267f0bb2fdb0f446d0ef56d690a89',
      // eslint-disable-next-line id-length
      c: 'syns',
      lang: 'ru',
      top: 5,
      query: text,
      forms: 0,
      scores: 0,
    },
  })

  return JSON.parse(result).response['1'].syns
}

const getTestWithoutAnswers = (test: any) => {
  const questionsWitoutAnswers = test.questions.reduce((acc: any, curr) => {
    const ans = curr

    ans.answer = undefined
    ans.expectedResult = undefined
    acc.push(curr)
    return acc
  }, [])

  test.questions = questionsWitoutAnswers
  return test
}

router.get('/test/random', async (req, res) => {
  const testsCount = await prisma.test.count()
  const skip = Math.floor(Math.random() * testsCount)
  const rawTests = await prisma.test.findMany({
    take: 1,
    skip,
    orderBy: {
      id: 'desc',
    },
    include: {
      questions: true,
    },
  })

  const rawTest = rawTests[0]
  const test = getTestWithoutAnswers(rawTest)

  res.send(test)
})

router.get('/test/:id', async (req, res) => {
  const rawTest = await prisma.test.findFirst({
    where: {
      id: Number.parseInt(req.params.id, 10),
    },
    include: {
      questions: true,
    },
  })

  const test = getTestWithoutAnswers(rawTest)

  res.send(test)
})

const checkCodeOnLambda = async (rawCode, questionId, rawCodeArgs, expectedResponse) => {
  const codeArgs = {}
  let codeBody = '({'

  let counter = 0

  await rawCodeArgs.forEach((element) => {
    codeArgs[`arg${counter}`] = element
    codeBody += `arg${counter}`
    if (counter !== rawCodeArgs.length - 1) {
      codeBody += ', '
    }
    counter++
  })

  codeBody = `${codeBody}}) => { ${rawCode} }`

  const options = {
    method: 'POST',
    uri: 'https://gr6xx3za2a.execute-api.us-east-1.amazonaws.com/dev/test',
    body: {
      questionId,
      args: codeArgs,
      expectedResponse,
      userId: 'noUser',
      code: codeBody,
    },
    json: true,
  }

  const lambdaPayload = await request(options)

  if (lambdaPayload.isExpectedResponse) {
    return true
  }
  return false
}

router.post('/test/:id', async (req, res) => {
  const answers = req.body.answers

  const testWithAnswers = await prisma.test.findFirst({
    where: {
      id: Number.parseInt(req.params.id, 10),
    },
    include: {
      questions: true,
    },
  })

  const rightQuestions = testWithAnswers.questions

  let rightAnswersCounter = 0

  const questionsResult = []

  const mapped = answers.map(async (answer) => {
    switch (answer.type) {
      case 'codeQuestion': {
        const question = rightQuestions.find((elem) => elem.id === answer.id)

        if (await checkCodeOnLambda(answer.text.replace(/\\n/g, ''), answer.id, question.codeArgs, question.expectedResult)) {
          rightAnswersCounter++
          questionsResult.push({
            questionId: answer.id,
            isRight: true,
          })
        } else {
          questionsResult.push({
            questionId: answer.id,
            isRight: false,
          })
        }
        break
      }

      case 'textQuestion': {
        const question = rightQuestions.find((elem) => elem.id === answer.id)

        if (question.answer.toLowerCase() === answer.text.toLowerCase() || (await getSynonims(question.answer.toLowerCase())).includes(answer.text.toLowerCase())) {
          rightAnswersCounter++
          questionsResult.push({
            questionId: answer.id,
            isRight: true,
          })
        } else {
          questionsResult.push({
            questionId: answer.id,
            isRight: false,
          })
        }
        break
      }

      default : {
        break
      }
    }
  })

  await Promise.all(mapped)

  const user = await prisma.user.findFirst({
    where: {
      OR: {
        nickname: req.body.user.nickname,
        phoneNumber: req.body.user.phoneNumber,
      },
    },
  })

  let userId

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        phoneNumber: req.body.user.phoneNumber,
        nickname: req.body.user.nickname,
      },
    })

    userId = newUser.id
  } else {
    userId = user.id
  }

  await prisma.completeTest.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      rightAnswers: rightAnswersCounter,
      answers: {
        createMany: {
          data: questionsResult,
        },
      },
    },
  })

  res.send({ right: rightAnswersCounter })
})

export default router
