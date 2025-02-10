import * as path from 'node:path';

// export const PATH_DB_USERS = path.join(process.cwd(), "src", "db", "db-users.json");
export const PATH_DB_USERS = path.resolve('src', 'db', 'db-users.json');

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const accessTokenLifetime = 1000 * 60 * 60 * 24;

export const refreshTokenLifetime = 1000 * 60 * 60 * 24 * 7;
