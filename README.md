# api-calls

API endpoints for managing schedules and tasks using TypeScript.

npm install
prisma generate

docker-compose --env-file .env.local up --build
docker-compose --env-file .env.local up --force-recreate

npm test

using parameter store as secrets manager is not free

deploying

1. add following values to parameter store
   use simple strings for now
   DB_USER
   DB_PASSWORD # change to secure if have time
   DB_NAME

2. Build the lambdas
   cd in to lambda folder and run
   `npm run build`

3. Create lambda zip files to upload to AWS
   //automate this if i have time

- cd lambda/dist/src
- zip createSchedule lambda
  `zip -r createSchedule.zip createSchedule.js ./services ./utils node_modules`
- zip getSchedules lambda
  `zip -r getSchedules.zip getSchedules.js ./services ./utils node_modules`
- Zip deleteSchedule lambda
  `zip -r deleteSchedule.zip deleteSchedule.js ./services ./utils node_modules`

4. Run terraform
   cd to api-calls/back-end/terraform

   - `terraform init`
   - `terraform validate`
   - `terraform apply`

5. run scipt in db
   recommend run the liquibase script in a CI/CD don't have time/ or prisma migrations
   currently running in pgAdmin
   `-- ChangeSet 1: Create "schedule" table
   CREATE TABLE public.schedule (
   id UUID PRIMARY KEY,
   account_id INT,
   agent_id INT,
   start_time TIMESTAMP,
   end_time TIMESTAMP
   );

-- ChangeSet 2: Create "task" table
CREATE TABLE public.task (
id UUID PRIMARY KEY,
schedule_id UUID NOT NULL,
account_id INT,
start_time TIMESTAMP,
duration INT,
type VARCHAR(50),
CONSTRAINT fk_schedule FOREIGN KEY (schedule_id) REFERENCES public.schedule (id)
);
`

`{
  "body": "{\"account_id\": 100, \"agent_id\": 2, \"start_time\": \"2024-12-19T08:00:00Z\", \"end_time\": \"2024-12-19T10:00:00Z\", \"tasks\": [{ \"account_id\": 123, \"start_time\": \"2024-12-19T08:15:00Z\", \"duration\": 30, \"type\": \"eat\" }]}",
  "headers": {},
  "requestContext": {},
  "isBase64Encoded": false
}`
