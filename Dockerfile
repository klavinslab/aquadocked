# Base Ubuntu16.04 image
FROM sd2e/base:ubuntu16

# Make sure it's all good
RUN apt-get update

# Get Aquarium
WORKDIR ~
RUN mkdir aquarium
COPY aquarium /root/aquarium

# Install RVM (for ruby v2.2.0)
RUN \curl -sSL https://rvm.io/mpapis.asc | gpg --import -
RUN \curl -sSL https://get.rvm.io | bash -s stable
RUN /bin/bash -l -c "rvm requirements"
RUN \touch .bashrc
RUN echo 'source /etc/profile.d/rvm.sh' > .bashrc
WORKDIR ~/aquarium
RUN /bin/bash -l -c "rvm install 2.2.0"

# Install mysql
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y libmysqlclient-dev
RUN /usr/sbin/update-rc.d mysql defaults 
RUN usermod -d /var/lib/mysql/ mysql
RUN mkdir /var/run/mysqld
RUN chown -R mysql:mysql /var/lib/mysql /var/run/mysqld
VOLUME /var/lib/mysql /var/lib/mysqld

# Install bower
RUN apt install -y npm
RUN npm install -g -y bower
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN cd /root/aquarium
RUN bower update --allow-root

# Install bundle stuff
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y libgmp3-dev 
RUN /bin/bash -l -c "cd /root/aquarium; gem install nokogiri -v '1.7.2'"
RUN /bin/bash -l -c "cd /root/aquarium; gem install bundler"
RUN /bin/bash -l -c "cd /root/aquarium; bundle install"
RUN /bin/bash -l -c "cd /root/aquarium; bundle update"

# Start servers and everything
COPY src /root
RUN ["chmod", "+x", "/root/start.sh"]
CMD ~/start.sh

