#!/bin/bash

# start MySQL
service mysql start
mysql -e 'create database developer;'
mysql developer < ~/aquarium_basic_db.dump
rm -rf ~/aq_database_dump.sql

# set up database
cd ~/aquarium
export S3_BUCKET_NAME=""
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_REGION=""
/bin/bash -l -c 'rake db:migrate'

# start servers
/bin/bash -l -c 'rails s &'
/bin/bash -l -c "rails runner 'Krill::Server.new.run(3501)' &"

