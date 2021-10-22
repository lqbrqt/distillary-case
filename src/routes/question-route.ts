import { Router, json } from 'express'

import prisma from '../prisma-client'

const router = Router()

router.get('/question/:id', (req, res) => {
  return prisma.question.findFirst({
    where: {
      id: req.params.id,
    },
  })
})

export default router
