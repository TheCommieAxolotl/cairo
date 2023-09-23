#! /usr/bin/bash

CAIRO_URL="https://api.github.com/repos/TheCommieAxolotl/cairo/contents/dist/cairo"
CAIRO_PATH="/usr/local/bin/cairo"

if [ -f "$CAIRO_PATH" ]; then
    echo "Cairo is already installed."
    exit 0
fi

echo "Installing Cairo..."

curl -H 'Accept: application/vnd.github.v3.raw' \
  -o "$CAIRO_PATH" \
  -SL "$CAIRO_URL"
chmod +x "$CAIRO_PATH"

echo "Cairo has been installed."

exit 0
