# Include the provider configuration
provider "aws" {
  region = var.aws_region
}


# Lambda functions for handling weather API requests
module "lambda" {
  source = "./lambda"
  lambda_execution_role_arn = module.iam.lambda_execution_role_arn
  api_calls_app_execution_arn = module.apigateway.api_calls_app_execution_arn
  database_url = module.rds.database_url
}

# API Gateway setup to expose Lambda functions as endpoints
module "apigateway" {
  source = "./apigateway"
  create_schedule_lambda_arn = module.lambda.create_schedule_lambda_arn
  delete_schedule_lambda_arn = module.lambda.delete_schedule_lambda_arn
  get_schedules_lambda_arn = module.lambda.get_schedules_lambda_arn
  update_task_type_lambda_arn = module.lambda.update_task_type_lambda_arn
}

# IAM roles for the Lambda functions
module "iam" {
  source = "./iam"
  aws_region = var.aws_region
}

# RDS setup
module "rds" {
  source = "./rds"
}

