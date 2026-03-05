# Encrypted Timeseries Stream Processing System

## Overview

This project implements a small backend system that:

1. Generates encrypted message streams
2. Sends them via sockets
3. Decrypts and validates data
4. Stores it in a MongoDB time-series structure
5. Displays results in real time on a frontend dashboard

The system demonstrates event-driven architecture, encryption, and real-time data processing.

---

## Architecture

Emitter Service
↓ (Socket Stream)
Listener Service
↓
MongoDB Time-Series Storage
↓
Frontend Dashboard

---

## Components

### Emitter

* Generates **49–499 random messages**
* Creates `secret_key` using **SHA-256**
* Encrypts payload using **AES-256-CTR**
* Sends encrypted stream every **10 seconds**

### Listener

* Receives encrypted stream via **Socket.IO**
* Decrypts payload
* Validates integrity using SHA-256 hash
* Adds timestamp
* Stores data in **MongoDB minute buckets**

Example schema:

```
{
  minute: Date,
  messages: [],
  totalMessages: Number
}
```

### Frontend

Displays in real time:

* Total messages
* Valid messages
* Failed messages
* Success rate

---

## Technologies Used

* Node.js
* Socket.IO
* MongoDB
* Mongoose
* AES-256 encryption
* SHA-256 hashing

---

## Running Locally

## Environment Variables

Create a `.env` file in the project root:

cp .env.example .env

Then update the MongoDB connection string.

Install dependencies:

```
npm install
```

Start Listener:

```
node src/listener.mjs
```

Start Emitter:

```
node src/emitter.mjs
```

Open dashboard:

```
http://localhost:5000
```

---

## Docker

Build image:

```
docker build -t encrypted-timeseries .
```

Run container:

```
docker run -p 4000:4000 -p 5000:5000 encrypted-timeseries
```

---

## Features

* Encrypted message streams
* Data integrity validation
* MongoDB time-series storage
* Real-time monitoring dashboard
* Event-driven architecture
