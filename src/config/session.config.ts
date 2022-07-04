import session from "express-session";
import connectRedis from "connect-redis";
import { createClient } from "redis";

import { sessionStoreUrl } from "../utilities/constants";

const RedisStore = connectRedis(session);
const redisClient = createClient({ legacyMode: true, url: sessionStoreUrl });
redisClient.connect().catch(console.error);

export { redisClient, RedisStore, session };
