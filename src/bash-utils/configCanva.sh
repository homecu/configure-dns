#!/bin/bash

# Instalar las dependencias necesarias usando Homebrew
brew install pkg-config cairo pango libpng jpeg giflib librsvg

# Crear y activar un entorno virtual de Python
python3 -m venv {{path/to/venv}}
source {{path/to/venv}}/bin/activate

# Actualizar pip e instalar setuptools
pip install --upgrade pip
pip3 install setuptools
pip3 show setuptools

nvm list
nvm use 16.13.1
npm start  
