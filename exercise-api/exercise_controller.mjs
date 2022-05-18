import 'dotenv/config';
import * as exercise from './exercise_model.mjs';
import express from 'express';
import expressAsyncHandler from "express-async-handler";
import {retrieveExercise} from "./exercise_model.mjs";

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

/**
 * Create a new exercise record
 */
app.post("/exercises",
    expressAsyncHandler(async (req, res, next) => {
            const new_exercise = await exercise.addExercise(req.body);
            res.status(201).type("application/json").send(new_exercise);
    }))

/**
 * Retrieve all exercises.
 */
app.get("/exercises",
    expressAsyncHandler(async (req, res, next) => {
        const new_query = await retrieveExercise({});
        res.status(200).type("application/json").send(new_query);
    }))

/**
 * Retrieve the exercise corresponding to the ID provided in the URL.
 */
app.get("/exercises/:_id",
    expressAsyncHandler(async (req, res, next) => {
            const new_query = await retrieveExercise(req.params);
            res.status(200).type("application/json").send(new_query);
    }))

/**
 * Update the movie whose id is provided in the path parameter and set
 * its title, year and language to the values provided in the body.
 */
app.put('/movies/:_id', (req, res, next) => {
    res.status(501).send({ Error: "Not implemented yet" });
});

/**
 * Delete the movie whose id is provided in the query parameters
 */
app.delete('/movies/:_id', (req, res, next) => {
    res.status(501).send({ Error: "Not implemented yet" });
});

app.use((err, req, res, next) => {
    console.log("Error: ", err.name)
    switch (err.name) {
        case "CastError":
            res.status(404).type("application/json").send({ Error: "Not found"})
            break;

        case "ValidationError":
            console.log("made it")
            res.status(400).type("application/json").send({ Error: "Invalid request"})
            break;

        default:
            console.log("Unhandled Error: ", err.name)
    }
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});