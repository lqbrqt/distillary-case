import { Router, json } from 'express'

import prisma from '../prisma-client'

const router = Router()

router.get('/test/random', async (req, res) => {
  const testsCount = await prisma.test.count()
  const skip = Math.floor(Math.random() * testsCount)

  return prisma.test.findMany({
    take: 1,
    skip,
    orderBy: {
      id: 'desc',
    },
  })[0]
})

router.get('/test/:id', async (req, res) => {
  return prisma.test.findFirst({
    where: {
      id: req.params.id,
    },
  })
})

router.post('/test/:id', async (req, res) => {
  const answers = req.body.answers

  console.log(answers)

  // DO SOMETHING WITH ANSWERS
})

export default router
