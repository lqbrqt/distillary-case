import request from 'request-promise-native'


const main = async () => {
  const result = await request.post('http://paraphraser.ru/api', {
    formData: {
      token: '8004cba6441267f0bb2fdb0f446d0ef56d690a89',
      c: 'syns',
      lang: 'ru',
      top: 5,
      query: 'кот ест малины',
      forms: 0,
      scores: 0,
    },
  })

  console.log(JSON.parse(result).response['1'].syns);
}

main()
