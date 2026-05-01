import dotenv from 'dotenv';
dotenv.config();

if (process.env.NODE_ENV === 'development') {
    console.log('Development environment');
}   

if(!process.env.MONGODB_URI){
    console.error('Error in connecting to database.',err);
    process.exit(1);
}

if(!process.env.JWT_SECRET){
    console.error('Error in connecting to database.',err);
    process.exit(1);
}

const _config = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV || 'development',
};

export const config = Object.freeze(_config);
