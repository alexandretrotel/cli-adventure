#!/bin/bash

# Install Bun if not installed
if ! command -v bun &> /dev/null; then
    echo "Bun not found. Installing..."
    curl -fsSL https://bun.sh/install | bash
fi

# Run bun install
echo "Installing dependencies with Bun..."
bun install

# Instructions for installing LM Studio
echo "Install LM Studio at https://lmstudio.ai/"
echo "Then, open LM Studio, download the qwen2.5-7b-instruct-1m model, and start the server."
echo "Also, you can change the model whenever you want by changing the model name in the 'src/data/settings.ts' file."
echo "Finally, once running, you can start the game by running 'bun run start'."
