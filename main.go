package main

import (
	"fmt"
	"testing-project/handlers"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"

	"net/http"
)

const PORT = ":8080"

func main() {
	r := chi.NewRouter()
	r.Use(handlers.Logger)
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"http://localhost:5173"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	r.Get("/", handlers.HandleMain)
	r.Get("/api/cars/{id}", handlers.HandleGetCar)
	r.Get("/api/cars", handlers.HandleGetCars)
	r.Post("/api/cars", handlers.HandlePostCar)
	r.Put("/api/cars/{id}", handlers.HandlePutCar)
	r.Delete("/api/cars/{id}", handlers.HandleDeleteCar)
	fmt.Printf("Server is listening on http://localhost%v\n", PORT)
	http.ListenAndServe(PORT, r)
}
