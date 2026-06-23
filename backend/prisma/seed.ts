import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const categories = [
    { title: 'Just Chatting', slug: 'just-chatting' },
    { title: 'Gaming', slug: 'gaming' },
    { title: 'Music', slug: 'music' },
    { title: 'IRL', slug: 'irl' },
    { title: 'Creative', slug: 'creative' },
    { title: 'Sports', slug: 'sports' },
    { title: 'Education', slug: 'education' },
    { title: 'Tech', slug: 'tech' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { title: category.title },
      update: { slug: category.slug },
      create: category,
    })
  }

  console.log('Categories seeded successfully')
}

main()
  .catch(() => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
