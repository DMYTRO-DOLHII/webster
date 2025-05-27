import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Client } from 'pg';
require('dotenv').config();
import path from 'path';
import { User } from '../models/User';
import { Project } from '../models/Project';

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

const generateTemplateJson = (width, height, variation) => {
    const backgroundColors = ["white", "#f0f0f0", "#e0e0ff"];
    const shadowColors = ["#9B34BA70", "#34BA9B70", "#349BBA70"];

    return {
        attrs: {
            width,
            height,
            scaleX: 0.73125,
            scaleY: 0.73125,
            className: `border-0 border-white shadow-[0px_0px_20px_0px_${shadowColors[variation % shadowColors.length]}]`
        },
        className: "Stage",
        children: [
            {
                attrs: {},
                className: "Layer",
                children: [
                    {
                        attrs: {
                            id: `Rect-${Date.now()}`,
                            width,
                            height,
                            fill: backgroundColors[variation % backgroundColors.length],
                            listening: false,
                            name: "Background"
                        },
                        className: "Rect"
                    },
                    {
                        attrs: {
                            borderStroke: "black",
                            borderDash: [6, 2],
                            anchorStroke: "black"
                        },
                        className: "Transformer"
                    }
                ]
            }
        ]
    };
};

export const seedDatabase = async () => {
    const userCount = await User.count();
    const projectCount = await Project.count();

    if (userCount > 0 || projectCount > 0) {
        console.log('Database already seeded. Skipping...');
        return;
    }

    // Create first user
    const user = User.create({
        login: 'mcokster',
        email: "mcokster@example.com",
        password: "mcokster",
        fullName: "McOkster Studio",
        isEmailConfirmed: true
    });
    await user.save();

    // const infos = [
    //     `{"attrs":{"width":1920,"height":1080,"scaleX":0.5651041666666666,"scaleY":0.5651041666666666,"className":"border-0 border-white shadow-[0px_0px_20px_0px_#9B34BA70]"},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"id":"Rect-1748274140746","width":1920,"height":1080,"fill":"white","listening":false,"name":"Background"},"className":"Rect"},{"attrs":{"id":"circle-1748274143197","x":696.5796385453381,"y":511.0568625254605,"name":"Figure 1","radius":30,"fill":"#000000","draggable":true,"scaleX":9.50687888853122,"scaleY":9.506878888531219},"className":"Circle"},{"attrs":{"borderStroke":"black","borderDash":[6,2],"anchorStroke":"black","x":416.68202764977013,"y":232.92521254079168},"className":"Transformer"}]}]}`,
    //     `{"attrs":{"width":1080,"height":1080,"scaleX":0.7462962962962963,"scaleY":0.7462962962962963,"className":"border-0 border-white shadow-[0px_0px_20px_0px_#9B34BA70]"},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"id":"Rect-1748274188737","width":1080,"height":1080,"fill":"white","listening":false,"name":"Background"},"className":"Rect"},{"attrs":{"id":"rect-1748274190797","x":328.1831575682373,"y":255.26054590570627,"name":"Figure 1","width":80,"height":40,"fill":"#be1e1e","draggable":true,"scaleX":4.459962300633218,"scaleY":9.518274955720077},"className":"Rect"},{"attrs":{"borderStroke":"black","borderDash":[6,2],"anchorStroke":"black"},"className":"Transformer"}]}]}`,
    //     `{"attrs":{"width":2480,"height":3508,"scaleX":0.22976054732041049,"scaleY":0.22976054732041049,"className":"border-0 border-white shadow-[0px_0px_20px_0px_#9B34BA70]"},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"id":"Rect-1748274207939","width":2480,"height":3508,"fill":"white","listening":false,"name":"Background"},"className":"Rect"},{"attrs":{"id":"line-1748274211731","x":1251.6574148414393,"y":1751.5716224170699,"name":"Figure 1","points":[-30,-30,30,30],"stroke":"#5cffde","strokeWidth":5,"draggable":true,"scaleX":24.57883325334807,"scaleY":24.5788332533481},"className":"Line"},{"attrs":{"borderStroke":"black","borderDash":[6,2],"anchorStroke":"black"},"className":"Transformer"}]}]}`,
    //     `{"attrs":{"width":3300,"height":5100,"scaleX":0.15803921568627452,"scaleY":0.15803921568627452,"className":"border-0 border-white shadow-[0px_0px_20px_0px_#9B34BA70]"},"className":"Stage","children":[{"attrs":{},"className":"Layer","children":[{"attrs":{"id":"Rect-1748274264099","width":3300,"height":5100,"fill":"white","listening":false,"name":"Background"},"className":"Rect"},{"attrs":{"id":"text-1748274266346","x":200.68725068316746,"y":1825.4962779156328,"name":"Text 2","text":"Sahur","fontSize":20,"fill":"#000000","draggable":true,"scaleX":54.361395394644205,"scaleY":54.36139539464462},"className":"Text"},{"attrs":{"borderStroke":"black","borderDash":[6,2],"anchorStroke":"black"},"className":"Transformer"}]}]}`
    // ]

    // for (let i = 1; i <= 4; i++) {
    //     const project = Project.create({
    //         title: `Template #${i}`,
    //         info: JSON.parse(infos[i]),
    //         isTemplate: true,
    //         isPremium: false,
    //         user: user,
    //     })

    //     await project.save();
    // }
};

