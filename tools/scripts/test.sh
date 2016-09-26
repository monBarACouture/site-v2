#! /bin/bash

source "$PWD/tools/scripts/.env"

mocha --compilers js:babel-core/register --recursive "$PWD/tests"
