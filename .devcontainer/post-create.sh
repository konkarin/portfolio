#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Copy bashrc to home directory
cp .devcontainer/.bashrc ~/.bashrc

# Install Gemini CLI if not already installed
if ! command -v gemini &> /dev/null; then
  echo "Installing Gemini CLI..."
  npm install -g @google/gemini-cli
else
  echo "Gemini CLI is already installed."
fi

echo "post-create script finished successfully."
