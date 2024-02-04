#!/bin/sh

echo "copying oasdiff..."
cp oasdiff ~/.local/bin
chmod 755 ~/.local/bin/oasdiff

echo "copying oas script..."
cp oas ~/.local/bin
chmod 755 ~/.local/bin/oas

echo "installing spectral..."
sudo npm install -g @stoplight/spectral-cli

echo "cloning git repo..."
cd && git clone https://github.com/ObjectIsAdvantag/DEVWKS-2525
