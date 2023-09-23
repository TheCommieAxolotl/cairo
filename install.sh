#! /usr/bin/bash

CAIRO_URL="https://github.com/TheCommieAxolotl/cairo/raw/master/dist/cairo"
CAIRO_PATH="/usr/local/bin/cairo"

echo "Downloading cairo... $CAIRO_URL"
curl --fail --location --progress-bar --output $CAIRO_PATH $CAIRO_URL
chmod +x $CAIRO_PATH
echo "cairo installed to $CAIRO_PATH"