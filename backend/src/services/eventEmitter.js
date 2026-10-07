// services/eventEmitter.js

import { EventEmitter } from "events";

export const myEmitter = new EventEmitter();

import PgBoss from 'pg-boss';

export const boss = new PgBoss(process.env.DATABASE_URL);
