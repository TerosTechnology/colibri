#!/bin/bash

cd src/config/helpers/
python3 generate_config.py
python3 generate_web.py
cd ../../../

npm install
rm -rf ../teroshdl/node_modules/teroshdl2/out/
cp -R out ../teroshdl/node_modules/teroshdl2/
