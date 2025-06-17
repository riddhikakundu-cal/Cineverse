# Start from the official Golang image
FROM golang:1.20

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download Go module dependencies
RUN go mod download

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 8000

# Build the Go application
RUN go build -o cineverse-app

# Command to run the application
CMD ["./cineverse-app"]
