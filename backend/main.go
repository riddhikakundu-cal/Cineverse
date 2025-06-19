// update 1
package main

import (
	"fmt"
	"latest/database"
	"latest/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDB()

	r := gin.Default()

	// Updated CORS settings
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://127.0.0.1:5500", "http://localhost:5500"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true // Accept all origins for development (You can restrict in production)
		},
	}))

	// Handle OPTIONS pre-flight requests
	r.OPTIONS("/*path", func(c *gin.Context) {
		c.Status(204)
	})

	// API routes
	routes.RegisterMovieRoutes(r)

	fmt.Println("Server starting at port 8000...")
	r.Run(":8000")
}

// package main

// import (
// 	"fmt"
// 	"latest/backend/database"
// 	"latest/backend/routes"

// 	"github.com/gin-contrib/cors"
// 	"github.com/gin-gonic/gin"
// )

// func main() {
// 	database.ConnectDB()

// 	r := gin.Default()

// 	// Setup CORS
// 	r.Use(cors.New(cors.Config{
// 		AllowOrigins:     []string{"http://127.0.0.1:5500", "http://localhost:5500"}, // Live Server origins
// 		AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
// 		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
// 		ExposeHeaders:    []string{"Content-Length"},
// 		AllowCredentials: true,
// 	}))

// 	// Serve static files (if needed, otherwise Live Server handles frontend)
// 	//r.Static("/static", "./frontend")

// 	// API routes
// 	routes.RegisterMovieRoutes(r)

// 	fmt.Println("Server starting at port 8000...")
// 	r.Run(":8000")
// }

// func main() {
// 	// Connect to MongoDB
// 	database.ConnectDB()

// 	r := mux.NewRouter()

// 	// Register API routes with /api prefix
// 	api := r.PathPrefix("/api").Subrouter()
// 	routes.RegisterMovieRoutes(api)

// 	// Serve static files (HTML, CSS, JS)
// 	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./frontend/")))

// 	fmt.Println("Server starting at port 8000...")
// 	log.Fatal(http.ListenAndServe(":8000", r))
// }
