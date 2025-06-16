package handlers

import (
	"context"
	"latest/backend/database"
	"latest/backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetMovies(c *gin.Context) {
	searchQuery := c.Query("search") // Capture the search query from the URL

	var filter bson.M
	if searchQuery != "" {
		filter = bson.M{"title": bson.M{"$regex": searchQuery, "$options": "i"}} // Case-insensitive search
	} else {
		filter = bson.M{} // No filter, fetch all
	}

	cursor, err := database.MovieCollection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching movies"})
		return
	}
	defer cursor.Close(context.TODO())

	var movies []models.Movie
	for cursor.Next(context.TODO()) {
		var movie models.Movie
		if err := cursor.Decode(&movie); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding movie"})
			return
		}
		movies = append(movies, movie)
	}

	c.JSON(http.StatusOK, movies)
}

func CreateMovie(c *gin.Context) {
	var movie models.Movie
	if err := c.BindJSON(&movie); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := database.MovieCollection.InsertOne(context.TODO(), movie)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	movie.ID = res.InsertedID.(primitive.ObjectID)
	c.JSON(http.StatusOK, movie)
}

func DeleteMovie(c *gin.Context) {
	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	_, err = database.MovieCollection.DeleteOne(context.TODO(), bson.M{"_id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Movie deleted successfully"})
}

// import (
// 	"context"
// 	"encoding/json"
// 	"net/http"

// 	"latest/backend/database"
// 	"latest/backend/models"

// 	"github.com/gorilla/mux"
// 	"go.mongodb.org/mongo-driver/bson"
// 	"go.mongodb.org/mongo-driver/bson/primitive"
// )

// func GetMovies(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")

// 	cursor, err := database.MovieCollection.Find(context.TODO(), bson.M{})
// 	if err != nil {
// 		http.Error(w, "Error fetching movies", http.StatusInternalServerError)
// 		return
// 	}
// 	defer cursor.Close(context.TODO())

// 	var movies []models.Movie
// 	for cursor.Next(context.TODO()) {
// 		var movie models.Movie
// 		if err := cursor.Decode(&movie); err != nil {
// 			http.Error(w, "Error decoding movie", http.StatusInternalServerError)
// 			return
// 		}
// 		movies = append(movies, movie)
// 	}

// 	json.NewEncoder(w).Encode(movies)
// }

// func CreateMovie(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
// 	var movie models.Movie
// 	if err := json.NewDecoder(r.Body).Decode(&movie); err != nil {
// 		http.Error(w, err.Error(), http.StatusBadRequest)
// 		return
// 	}

// 	res, err := database.MovieCollection.InsertOne(context.TODO(), movie)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	movie.ID = res.InsertedID.(primitive.ObjectID)
// 	json.NewEncoder(w).Encode(movie)
// }

// func DeleteMovie(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
// 	params := mux.Vars(r)
// 	id, err := primitive.ObjectIDFromHex(params["id"])
// 	if err != nil {
// 		http.Error(w, "Invalid ID format", http.StatusBadRequest)
// 		return
// 	}

// 	_, err = database.MovieCollection.DeleteOne(context.TODO(), bson.M{"_id": id})
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	json.NewEncoder(w).Encode(bson.M{"message": "Movie deleted successfully"})
// }
