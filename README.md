# Fragments Repository

> Fragments is [Microservice](https://aws.amazon.com/microservices/) that can convert Images and Text in different formats.

> It is fully connected to AWS like Cognito, ECR, Elastic Beanstalk and S3.

> It uses Continuous Integration using GitHub actions through this [yml](https://github.com/xguhx/Fragments-Microservice--Back-end/blob/main/.github/workflows/ci.yml) file.

> It uses Continuous Delivery using GitHub actions through this [yml](https://github.com/xguhx/Fragments-Microservice--Back-end/blob/main/.github/workflows/cd.yml) file.

---

### This app was made using:

- @Aws-sdk/client-dynamodb
- @Aws-sdk/client-s3
- @Aws-sdk/lib-dynamodb
- Aws-jwt-verify
- Compression
- Content-type
- Cors
- Crypto
- Express
- Helmet
- Http-auth
- Http-auth-passport
- Markdown-it
- Nanoid
- Passport
- Passport-http-bearer
- Pino
- Sharp
- Stoppable
- Jest
- Supertest

### How to use it?

- Create an account through AWS Cognito.
- Post a fragment or upload a Image.
- Convert a fragment to the desired format.

### Running the Scripts:

- `npm run lint`
  Run the linter through the files of the project.

- `npm start`
  Start the server with live updates.

- `npm run dev`
  Start the server in dev mode.

- `npm run debug`
  Start the server in debug mode..
