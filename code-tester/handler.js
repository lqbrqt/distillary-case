module.exports.hello = async (event) => {
  const { questionId, args, expectedResponse, code, userId } = JSON.parse(event.body)

  // eslint-disable-next-line no-eval
  const testFunction = eval(code)
  const response = testFunction(args)

  const isExpectedResponse = JSON.stringify(response) === JSON.stringify(expectedResponse)

  return {
    statusCode: 200,
    body: JSON.stringify({
      response,
      isExpectedResponse,
      questionId,
      userId,
    }),
  }
}
