package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MovieCollection *mongo.Collection

// update 1
var UserCollection *mongo.Collection

func ConnectDB() {
	clientOptions := options.Client().ApplyURI("mongodb+srv://riddhikakundu:CaLSoft_2025@cluster0.0vn1uh4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	MovieCollection = client.Database("movieDB").Collection("movies")
	// update 2
	UserCollection = client.Database("movieDB").Collection("users")

	log.Println("Connected to MongoDB successfully!")
}

// import (
// 	"context"
// 	"log"
// 	"time"

// 	"go.mongodb.org/mongo-driver/mongo"
// 	"go.mongodb.org/mongo-driver/mongo/options"
// )

// var MovieCollection *mongo.Collection

// func ConnectDB() {
// 	clientOptions := options.Client().ApplyURI("mongodb+srv://riddhikakundu:CaLSoft_2025@cluster0.0vn1uh4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

// 	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
// 	defer cancel()

// 	client, err := mongo.Connect(ctx, clientOptions)
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	MovieCollection = client.Database("movieDB").Collection("movies")
// 	// log.Println("Connected to MongoDB successfully!")
// }
