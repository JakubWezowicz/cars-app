package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"testing-project/mongodb"
	"testing-project/types"

	"github.com/go-chi/chi/v5"
)

func HandleMain(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "<a href='/api/cars'>Auto są tu!</a>")
}
func HandleGetCar(w http.ResponseWriter, r *http.Request) {
	// Pobierz identyfikator użytkownika z parametru ścieżki
	id := chi.URLParam(r, "id")
	data, err :=mongodb.FetchOneCar(id)
	if err != nil {
		log.Println(err)
	}
	json, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	fmt.Fprint(w, string(json))
}

func HandlePostCar(w http.ResponseWriter, r *http.Request) {
	var car types.NewCar
	json.NewDecoder(r.Body).Decode(&car)
	res := mongodb.InsertCar(car)
	json, err := json.Marshal(res)
	if err != nil {
		log.Println(err)
	}
	fmt.Fprint(w, string(json))
}

func HandlePutCar (w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	var car types.Car
	var task types.Task
	data, err := io.ReadAll(r.Body)
	if err != nil {log.Println(err)}
	err = json.Unmarshal(data, &car)
	if err != nil {log.Println(err)}
	err = json.Unmarshal(data, &task)
	if err != nil {log.Println(err)}
	fmt.Println(task)
	if task.Task == "changeDetails" {
		fmt.Println(car)
		err = mongodb.ChangeCar(car, id, task.Task)
		if err != nil {
			log.Println(err)
		}
	} else if task.Task == "changeAvailable"{
		err = mongodb.ChangeCar(car, id, task.Task)
		if err != nil {
			log.Println(err)
		}
	}
	fmt.Fprint(w, "Changed Car")
}

func Logger (next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("Request: %v\n", r.RequestURI)
		next.ServeHTTP(w, r)
	})
}

func HandleGetCars (w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")

	if query != "" {
		data, err := mongodb.FetchCarsByQuery(query)
		if err != nil {
			log.Println(err)
		}
		json, err := json.Marshal(data)
		if err != nil {
			log.Println(err)
		}
		fmt.Fprint(w, string(json))
		return
	}
	data, err := mongodb.FetchAllCars()
	if err != nil {
		log.Println(err)
	}
	json, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	fmt.Fprint(w, string(json))
}

func HandleDeleteCar (w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	err := mongodb.DeleteCar(id)
	if err != nil {
		log.Println(err)
	}
	}