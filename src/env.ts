import { envSchema } from './utils/validations';

export const env = envSchema.parse(process.env)