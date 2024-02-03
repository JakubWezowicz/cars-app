package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type NewCar struct {
	Brand, Model string
	Year int
	Available bool
}

type Car struct {
	ID           primitive.ObjectID `bson:"_id"`
	Brand, Model string
	Year int
	Available bool
}

type Task struct {
	Task string
}

