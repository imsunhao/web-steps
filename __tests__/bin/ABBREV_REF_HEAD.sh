#!/bin/bash

submodulePath=$1

cd $submodulePath

git rev-parse --abbrev-ref HEAD
