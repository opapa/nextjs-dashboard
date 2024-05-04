// const { db } = require('@vercel/postgres');
const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    // Insert data into the "users" table
    const insertedQuery = `INSERT INTO users (id, name, email, password)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id) DO NOTHING;`
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return client.query(insertedQuery, [
          user.id,
          user.name,
          user.email,
          hashedPassword
        ])
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(client) {
  try {
    console.log(`Created "invoices" table`);

    const insertedQuery = `INSERT INTO invoices (customer_id, amount, status, date)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id) DO NOTHING;`
    // Insert data into the "invoices" table
    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => client.query(insertedQuery, [
          invoice.customer_id,
          invoice.amount,
          invoice.status,
          invoice.date
        ])
      ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  try {
    console.log(`Created "customers" table`);

    const insertedQuery = `
    INSERT INTO customers (id, name, email, image_url)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (id) DO NOTHING;
  `
    // Insert data into the "customers" table
    const insertedCustomers = await Promise.all(
      customers.map(
        (customer) => client.query(insertedQuery,
        [
          customer.id, customer.name, customer.email, customer.image_url
        ])
      ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {

    console.log(`Created "revenue" table`);

    const insertedQuery = `
    INSERT INTO revenue (month, revenue)
    VALUES ($1, $2)
    ON CONFLICT (id) DO NOTHING;
  `

    // Insert data into the "revenue" table
    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => client.query(insertedQuery, [
          rev.month,
          rev.revenue
        ])
      ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  // const { rows } = await pool.query('SELECT * FROM your_table_name');
  // res.status(200).json(rows);

  // const client = await db.connect();
  console.log('0')
  // await seedUsers(pool);
  // console.log('1')
  // await seedCustomers(pool);
  // console.log('2')
  // await seedInvoices(pool);
  console.log('3')
  await seedRevenue(pool);
  console.log('4')

  // await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
