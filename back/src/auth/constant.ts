export const jwtSecret = process.env.JWT_SECRET ?? 'missing secret';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '60';
