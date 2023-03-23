#!/bin/bash

cd ../../common/common
npm pack --pack-destination ../../apps/backend/functions

cd ../../common/admin
npm pack --pack-destination ../../apps/backend/functions

cd ../../apps/backend/functions
npm install --save amoschan*tgz

