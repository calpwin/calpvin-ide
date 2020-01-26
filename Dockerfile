FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive

ENV USER root

RUN apt-get update && apt-get -y install sudo

## User account
RUN adduser --disabled-password --gecos '' developer && \
    adduser developer sudo && \
    echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers;    


##### Main installation for developer user    
USER developer    
WORKDIR /home/project    

#Common deps
RUN sudo sudo apt-get -y install curl xz-utils wget gpg nano

## Git and sudo (sudo needed for user override)
RUN sudo apt-get -y install git

#Install nvm, node (10.18.1-lts), yarn
RUN sudo wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
## RUN /bin/bash -c "source /home/developer/.nvm/nvm.sh install lts/dubnium"                    !!!!!!!!!!!!!!!!!!!!!!!
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - && \
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN sudo apt update && sudo apt install -y --no-install-recommends yarn

#Theia
##Needed for node-gyp, nsfw build
RUN sudo apt-get install -y python build-essential
RUN sudo apt-get install -y make pkg-config gcc libx11-dev libxkbfile-dev libsecret-1-dev fakeroot rpm

EXPOSE 3000
EXPOSE 8080



