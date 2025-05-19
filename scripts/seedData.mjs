import { faker } from '@faker-js/faker';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'mobile_clone_db',
    user: 'postgres',
    password: 'pass',
});

const USER_COUNT = 100000; // 100k users
const LISTINGS_PER_USER = 10; // 10 listings per user = 1M listings

async function seed() {
  console.time('Seeding');

  for (let i = 0; i < USER_COUNT; i++) {
    const { rows } = await pool.query(
      'INSERT INTO users (first_name, last_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING id',
      [
        faker.person.firstName(),
        faker.person.lastName(),
        faker.internet.email(),
        faker.phone.number(),
      ]
    );
    const userId = rows[0].id;

    const listingsInsertQuery = `
      INSERT INTO listings (user_id, image_url, title, price, make, model, description, manufacture_year, mileage, engine_size, horsepower, transmission, fuel_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    `;
    const listings = Array.from({ length: LISTINGS_PER_USER }, () => [
      userId,
      `https://loremflickr.com/640/480/car?random=${faker.number.int({ min: 1, max: 100 })}`,
      faker.vehicle.vehicle(),
      faker.number.int({ min: 1000, max: 50000 }),
      faker.vehicle.manufacturer(),
      faker.vehicle.model(),
      faker.lorem.sentence(10),
      faker.date.past({ years: 15 }).getFullYear(),
      faker.number.int({ min: 1000, max: 200000 }),
      faker.number.int({ min: 1000, max: 5000 }),
      faker.number.int({ min: 100, max: 500 }),
      faker.helpers.arrayElement(['MANUAL', 'AUTOMATIC']),
      faker.helpers.arrayElement(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
    ]);

    for (const listing of listings) {
      await pool.query(listingsInsertQuery, listing);
    }
      
    if (i % 1000 === 0) console.log(`Inserted ${i} users...`);
  }

  console.timeEnd('Seeding');
  await pool.end();
}

seed().catch(console.error);