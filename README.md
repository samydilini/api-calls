# api-calls

API endpoints for managing schedules and tasks using TypeScript.
This demonstrates CRUD with four basic endpoints. They are,
i.   CREATE or POST createSchedule
ii.  READ or GET getSchedule
iii. UPDATE or PUT updateTaskType
iv.  DELETE deleteSchedule

## Local testing with integration testing

1. installing api calls and prisma
   from back-end/lambda folder
   create a file.env and copy the content or .env.local to it

`npm install`

   `prisma generate`

2. build docker for local environment. This is used for integration tests. 
`docker-compose --env-file .env.local up --build`

if that gives issue use below,

`docker-compose --env-file .env.local up --force-recreate`
3. run all the unit and integration tests

`npm test`

## Deploying to AWS

I've used parameter store to store secrets as secrets manager is not free

1. add following values to parameter store
   use simple strings for now
   `DB_USER`
   `DB_PASSWORD` # change to secure if have time
   `DB_NAME`

2. Build the lambdas and zip 

         run the script OR use steps

           option 1  - running script 
              - cd to back-end folder and find the scirpt build_and_zip.sh
              - give rights 
                    `chmod +x build_and_zip.sh`
                  Note: if there are any permission issues use  `sudo chown -R $(whoami) ~/.cache/prisma`
              - run script 
                    `./build_and_zip.sh`


           option 2 - use the steps 
             - cd in to lambda folder and run
                    `npm run build`
             - generate prisma `prisma generate`
             - create individual zip files
                  cd lambda/dist/src
                  -zip createSchedule lambda
                      `zip -r createSchedule.zip createSchedule.js ./services ./utils node_modules`
                  - zip getSchedules lambda
                      `zip -r getSchedules.zip getSchedules.js ./services ./utils node_modules`
                  - Zip deleteSchedule lambda
                      `zip -r deleteSchedule.zip deleteSchedule.js ./services ./utils node_modules`
                  - Zip updateTaskType lambda
                       `zip -r updateTaskType.zip updateTaskType.js ./services ./utils node_modules`


3. Run terraform
   cd to api-calls/back-end/terraform

   - `terraform init`
   - `terraform validate`
   - `terraform apply`

   4. run scipt in db
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

6. end points 
  get api_gateway_url from terraform out puts
for example it will look something like api_gateway_url = "https://8flms2za4h.execute-api.ap-southeast-2.amazonaws.com"
   i. createSchedule request  
   url =POST `${api_gateway_url}/prod/create/schedule`
   request = 
            `{
               "account_id": 100,
               "agent_id": 2,
               "start_time": "2024-12-19T08:00:00Z",
               "end_time": "2024-12-19T10:00:00Z",
               "tasks": [
               {
               "account_id": 123,
               "start_time": "2024-12-19T08:15:00Z",
               "duration": 30,
               "type": "postman"
               }
               ]
               }`
   for lambda >> 
           `{
             "body": "{\"account_id\": 100, \"agent_id\": 2, \"start_time\": \"2024-12-19T08:00:00Z\", \"end_time\": \"2024-12-19T10:00:00Z\", \"tasks\": [{ \"account_id\": 123, \"start_time\": \"2024-12-19T08:15:00Z\", \"duration\": 30, \"type\": \"eat\" }]}",
             "headers": {},
             "requestContext": {},
             "isBase64Encoded": false
           }`
   response = the created schedule
   ii. deleteSchedule request  
   url =DELETE `${api_gateway_url}/prod/delete/schedule/${scheduleId}`
   response = `"Schedule with ${scheduleId} was sucessfully deleted"`

   
   iii. getSchedule request
   url =GET `${api_gateway_url}/prod/schedules`
   response = all the schedules

   iv. updateTaskType request  
   url =PUT `${api_gateway_url}/prod/update/taskType`
   request = 
         `{
         "taskId": "9842d32c-bcaa-4ffd-99ad-310e2a3449d1",
         "type": "sleepy"
         }`

for lambda >>
`{
             "body": "{\"taskId\": \"9842d32c-bcaa-4ffd-99ad-310e2a3449d1\", \"type\": \"lambda test\"}",
             "headers": {},
             "requestContext": {},
             "isBase64Encoded": false
           }`
   response = updated task 