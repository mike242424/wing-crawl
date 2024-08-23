const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const locations = [
    {
      name: 'Bay Street Biergarten',
      wing: 'Crispy Fried Buffalo Wings',
    },
    {
      name: 'Bedford Falls',
      wing: 'Hot Wings',
    },
    {
      name: 'Charleston Beer Works',
      wing: 'House Hot Wings',
    },
    {
      name: 'The Brick',
      wing: 'Hot Buffalo Tavern Wings',
    },
    {
      name: 'Rusty Bull Brewing Co.',
      wing: 'Hot Wings',
    },
    {
      name: 'The Griffon',
      wing: 'Buffalo HOT Wings',
    },
  ];

  for (const location of locations) {
    await prisma.location.create({
      data: location,
    });
  }

  console.log('Locations seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
