// update 1
package routes

import (
	"latest/backend/handlers"
	"latest/backend/middlewares"

	"github.com/gin-gonic/gin"
)

func RegisterMovieRoutes(r *gin.Engine) {
	r.POST("/api/signup", handlers.Signup)
	r.POST("/api/login", handlers.Login)

	r.GET("/api/movies", handlers.GetMovies)
	r.POST("/api/movies", middlewares.AuthMiddleware("admin"), handlers.CreateMovie)
	r.DELETE("/api/movies/:id", middlewares.AuthMiddleware("admin"), handlers.DeleteMovie)
}

// package routes

// import (
// 	"latest/backend/handlers"

// 	"github.com/gin-gonic/gin"
// )

// func RegisterMovieRoutes(r *gin.Engine) {
// 	r.GET("/api/movies", handlers.GetMovies)
// 	r.POST("/api/movies", handlers.CreateMovie)
// 	r.DELETE("/api/movies/:id", handlers.DeleteMovie)
// }

// func RegisterMovieRoutes(r *mux.Router) {
// 	r.HandleFunc("/movies", handlers.GetMovies).Methods("GET")
// 	r.HandleFunc("/movies", handlers.CreateMovie).Methods("POST")
// 	r.HandleFunc("/movies/{id}", handlers.DeleteMovie).Methods("DELETE")
// }
