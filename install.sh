#!/bin/bash

# Install Bun if not installed
if ! command -v bun &> /dev/null; then
    echo "Bun not found. Installing..."
    curl -fsSL https://bun.sh/install | bash
fi

# Run bun install
echo "Installing dependencies with Bun..."
bun install

# Install Ollama if not installed
if ! command -v ollama &> /dev/null; then
    echo "Ollama not found. Installing..."
    curl -fsSL https://ollama.com/install.sh | sh
fi

# Pull and run the llama3.1 model
echo "Pulling and running Llama3.1 model..."
ollama pull llama3.1
ollama run llama3.1
