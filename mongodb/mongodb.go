package mongodb

import (
	"context"
	"fmt"
	"log"
	"testing-project/types"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// creating type for db resources

const URI = "mongodb://localhost:27017"

func createConnection () (clnt *mongo.Client, cx context.Context,err error){
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	// connecting to mongo
	client, err := mongo.Connect(ctx, nil)
	if err != nil { return nil, nil, fmt.Errorf("%v", err)}

	return client,ctx, nil
}
func FetchAllCars() (data []types.Car, err error){
	client, ctx,err := createConnection()
		defer func () {
		if err = client.Disconnect(ctx); err != nil {
			log.Println(err)
		}
	}()
	if err != nil {
		log.Println(err)
	}
	var results []types.Car
	coll := client.Database("cars-app").Collection("cars")
	cur, err := coll.Find(ctx, bson.D{{}},nil)
	if err !=nil {
		return nil, fmt.Errorf("%v", err)

	}
	if err = cur.All(ctx,&results); err != nil {
		return nil, fmt.Errorf("%v", err)

	}
	return results, nil
}

func FetchOneCar (id string) (data types.Car, err error){
	client, ctx,err := createConnection()
	defer func () {
	if err = client.Disconnect(ctx); err != nil {
		log.Println(err)
	}
}()
		if err != nil {
			log.Println(err)
		}
		var result types.Car
		coll := client.Database("cars-app").Collection("cars")
		objID, err := primitive.ObjectIDFromHex(id)
		if err != nil {
			return types.Car{}, fmt.Errorf("%v", err)
		}
		filter := bson.D{{Key: "_id", Value: objID}}
		coll.FindOne(ctx, filter,nil).Decode(&result)
		return result, nil 
}

func InsertCar (car types.NewCar )(id interface{}){
	client, ctx,err := createConnection()
	defer func () {
	if err = client.Disconnect(ctx); err != nil {
		log.Println(err)
	}
}()
	if err != nil {
		log.Println(err)
	}
	coll := client.Database("cars-app").Collection("cars")
	result, err := coll.InsertOne(ctx, car, nil)
	if err != nil {
		log.Println(err)
	}
	fmt.Printf("Inserted car with id: %v\n", result.InsertedID)
	return result.InsertedID
}

func ChangeCar (car types.Car, carId string) (err error){
	client, ctx,err := createConnection()
	defer func () {
	if err = client.Disconnect(ctx); err != nil {
		log.Println(err)
	}
}()
	if err != nil {
		log.Println(err)
	}
	coll := client.Database("cars-app").Collection("cars")
	id, _ := primitive.ObjectIDFromHex(carId)
	filter := bson.D{{"_id", id}}
	update := bson.D{{"$set", bson.D{{"available", !!car.Available}}}}
	result, err := coll.UpdateOne(ctx, filter,update)
	if err != nil {
		log.Println(err)
	}
	fmt.Println(result)
	fmt.Printf("Changed car's available with id: %v to: %v\n", id, !!car.Available)
	return nil
}

func DeleteCar (carId string) (err error) {
	client, ctx,err := createConnection()
	defer func () {
	if err = client.Disconnect(ctx); err != nil {
		log.Println(err)
	}
}()
if err != nil {
	return err
}
coll := client.Database("cars-app").Collection("cars")
id, _ := primitive.ObjectIDFromHex(carId)
	filter := bson.D{{"_id", id}}
result, err := coll.DeleteOne(ctx, filter, nil)
if err != nil {return err}
fmt.Println(result)
fmt.Printf("Deleted car with id: %v\n", id)
return nil 
}

func FetchCarsByQuery(query string) ([]types.Car, error) {
	client, ctx,err := createConnection()
	defer func () {
	if err = client.Disconnect(ctx); err != nil {
		log.Println(err)
	}
}()
if err != nil {
	return nil, err
}
    collection := client.Database("cars-app").Collection("cars")
    filter := bson.M{"$or": []bson.M{
        {"brand": bson.M{"$regex": primitive.Regex{Pattern: query, Options: "i"}}},
        {"model": bson.M{"$regex": primitive.Regex{Pattern: query, Options: "i"}}},
    }}
    cursor, err := collection.Find(ctx, filter)
    if err != nil {
        return nil, err
    }
    var results []types.Car
    if err = cursor.All(ctx, &results); err != nil {
        return nil, err
    }
    return results, nil
}
