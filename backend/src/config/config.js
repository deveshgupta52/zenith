import dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV === 'development') {
    console.log('Development environment');
}   

if(!process.env.MONGODB_URI){
    console.log('MONGODB_URI is missing');
    process.exit(1);
}

if(!process.env.JWT_SECRET){
    console.log('JWT_SECRET is missing');
    process.exit(1);
}

const _config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export const config = Object.freeze(_config);
