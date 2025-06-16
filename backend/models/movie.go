package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Movie struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Isbn     string             `json:"isbn"`
	Title    string             `json:"title"`
	Genre    string             `json:"genre"`
	Year     int                `json:"year"`
	Director *Director          `json:"director"`
}

type Director struct {
	Firstname string `json:"firstname"`
	Lastname  string `json:"lastname"`
}
