# Ollama Setup Instructions

## What is Ollama?
Ollama lets you run AI models locally on your computer - completely free with unlimited usage!

## Installation Steps:

### 1. Download and Install Ollama
- Go to: https://ollama.ai/download
- Download for Windows
- Run the installer

### 2. Download the AI Model
Open terminal and run:
```bash
ollama pull llama2
```

This downloads a free 7B parameter model (~4GB).

### 3. Start Ollama Server
```bash
ollama serve
```

Keep this terminal open while using the chatbot.

## Alternative Models:
- `ollama pull mistral` - Slightly better quality
- `ollama pull phi` - Smaller, faster (1.3GB)
- `ollama pull codellama` - Good for tech questions

## Usage:
Once Ollama is running, your chatbot will automatically use it!
No API keys, no quotas, completely free! 🎉
