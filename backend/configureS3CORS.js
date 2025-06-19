const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const corsConfiguration = {
    CORSRules: [
        {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: ['*'],
            ExposeHeaders: ['ETag', 'Content-Length', 'Content-Type'],
            MaxAgeSeconds: 3000
        }
    ]
};

async function configureS3CORS() {
    try {
        const command = new PutBucketCorsCommand({
            Bucket: 'vip-completed-invoices',
            CORSConfiguration: corsConfiguration
        });

        await s3Client.send(command);
        console.log('CORS configuration updated successfully for vip-completed-invoices bucket');
    } catch (error) {
        console.error('Error configuring CORS:', error);
    }
}

configureS3CORS(); 