import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Client } from 'pg';
require('dotenv').config();
import path from 'path';

const FAKER_USERS = 5;
const FAKER_CALENDARS = 5;
const FAKER_EVENTS = 5;

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    // entities: [User, Event, Comment, Company, Promocode, Notification, Subscription, Theme, Format, Ticket, Payment],
    entities: [path.join(__dirname, '../models/*.{ts,js}')],
    migrations: [],
    subscribers: [],
});

export const createDatabaseIfNotExists = async () => {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: process.env.DB_PASS,
        database: 'postgres',
    });

    try {
        await client.connect();

        const result = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);

        if (result.rows.length === 0) {
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database '${process.env.DB_NAME}' has been created!`);
        } else {
            console.log(`Database '${process.env.DB_NAME}' already exists.`);
        }
    } catch (error) {
        console.error('Error while checking/creating the database:', error);
    } finally {
        await client.end();
    }
};

export const createAdmin = async () => {

};

export const seedDatabase = async () => {
    
};
