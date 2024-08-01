FROM ollama/ollama as ollama

ARG model=phi3:medium

# Start the ollama server in the background and wait for it to initialize
RUN ollama serve & sleep 2 && ollama pull $model

EXPOSE 11434

CMD ["serve"]