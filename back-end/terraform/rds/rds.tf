# Security Group to allow public access
resource "aws_security_group" "rds_security_group" {
  name_prefix = "rds-sg-"

  # Allow public access on PostgreSQL port 5432
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Public access from all IPs
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Allow all protocols
    cidr_blocks = ["0.0.0.0/0"]
  }
}

data "aws_ssm_parameter" "db_user" {
  name = "/DB_USER" # The name of your parameter in SSM
}

data "aws_ssm_parameter" "db_password" {
  name = "/DB_PASSWORD" # The name of your parameter in SSM
}

data "aws_ssm_parameter" "db_name" {
  name = "/DB_NAME" # The name of your parameter in SSM
}

resource "aws_db_instance" "my_db" {
  identifier         = "my-database"
  engine             = "postgres"
  instance_class     = "db.t3.micro"
  allocated_storage  = 20
  username           = data.aws_ssm_parameter.db_user.value
  password           = data.aws_ssm_parameter.db_password.value
  db_name            = data.aws_ssm_parameter.db_name.value

  publicly_accessible = true # Allow public access not for prod

  vpc_security_group_ids = [aws_security_group.rds_security_group.id] # Attach the security group

  skip_final_snapshot = true
}

output "database_url" {
  value = "postgresql://${data.aws_ssm_parameter.db_user.value}:${data.aws_ssm_parameter.db_password.value}@${aws_db_instance.my_db.endpoint}/${data.aws_ssm_parameter.db_name.value}"
  description = "The JDBC URL for the PostgreSQL database"
}

output "database_host" {
  value = aws_db_instance.my_db.endpoint
  description = "The JDBC URL for the PostgreSQL database"
}
