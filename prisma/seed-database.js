const { PrismaClient } = require('@prisma/client')
const { createHmac } = require('crypto')

const accountantUser = {
  name: 'Test Accountant',
  email: 'test@admin.com',
  password: createHmac('sha256', 'admin').digest('hex')
}

const load = async () => {
  const prisma = new PrismaClient()

  try {
    await prisma.user.deleteMany()
    console.log('Deleted records in user table')

    await prisma.user.create({
      data: accountantUser
    })
    console.log('Added accountant user')

  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()