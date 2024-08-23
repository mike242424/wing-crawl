const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const locations = [
    {
      name: 'The Royal American',
      wing: 'Magic Wings',
    },
    {
      name: 'Home Team BBQ',
      wing: "Fiery Ron's Smoked Chicken Wings",
    },
    {
      name: "Heavy's Barburger",
      wing: "Heavy's Jumbo Wings",
    },
    {
      name: "Moe's Crosstown Tavern",
      wing: 'Hot Wings',
    },
    {
      name: 'Pink Bellies',
      wing: 'Garlic KFC Wings',
    },
    {
      name: 'Prohibition',
      wing: 'Charred Wings',
    },
    {
      name: 'Charleston Beer Works',
      wing: 'House Hot Wings',
    },
    {
      name: 'The Brick',
      wing: 'Hot Buffalo Wings',
    },
    {
      name: 'Bay Street Biergarten',
      wing: 'Crispy Fried Buffalo Wings',
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
