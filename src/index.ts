import { Context, S3Event, S3Handler } from 'aws-lambda';

export const handler: S3Handler = (event: S3Event, context: Context): Promise<void> => {
  console.log('Called:', event);
  return Promise.resolve();
};
