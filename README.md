# Installation

## Development environment

With docker installed, run the following command to start the postgresql db
```bash
docker-compose up
```  

Open a new terminal and install all the project dependencies
```bash
npm install
```  

Generate the prisma client, push the schema to the db and seed the database with a test user
```bash
npx prisma generate
npx prisma db push
npm run seed
```
**Test user credentials**:  
email: test@admin.com  
password: admin  

Now, run the development server:
```bash
npm run dev
```  

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

