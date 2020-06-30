#!/bin/bash

submodulePath=$1
hash=$2

cd $submodulePath

git -c advice.detachedHead=false checkout -f $hash