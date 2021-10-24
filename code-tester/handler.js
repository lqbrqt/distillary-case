const fs = require('fs')
const { exec } = require('child_process')

const commandExecute = ({ cmd, cwd }) => {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout) => {
      if (error) {
        return reject(stdout)
      }
      return resolve(stdout)
    })
  })
}

module.exports.hello = async (event) => {
  const { questionId, args, expectedResponse, code, userId } = JSON.parse(event.body)

  const fileNameString = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10)

  fs.writeFileSync(`${fileNameString}.js`, `${args}\n${code}\nconsole.log(testFunction())`)

  const res = await commandExecute({ cmd: `node ${fileNameString}.js`, cws: __dirname })
  const executeResult = res.replace(/(\r\n|\n|\r)/gm, '')

  const isExpectedResponse = executeResult === expectedResponse

  return {
    statusCode: 200,
    body: JSON.stringify({
      response: executeResult,
      isExpectedResponse,
      questionId,
      userId,
    }),
  }
}
