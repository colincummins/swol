import 'dotenv/config';
import * as exercise from './exercise_model.mjs';
import express from 'express';
import expressAsyncHandler from "express-async-handler";
import cors from 'cors';

const PORT = process.env.PORT;

if (!process.env.CORS_ORIGIN) {
    console.warn('WARNING: CORS_ORIGIN is not set. Defaulting to * (all origins). Set CORS_ORIGIN in production.');
}

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*' }));
app.use(express.json());

const validateId = (req, res, next) => {
    if (!/^\d+$/.test(req.params._id)) {
        const err = new Error(`Invalid id: ${req.params._id}`);
        err.name = 'ValidationError';
        return next(err);
    }
    next();
};

const validateBody = (req, res, next) => {
    for (const field of ['name', 'reps', 'weight', 'unit', 'date']) {
        if (req.body[field] == null) {
            const err = new Error(`Missing required field: ${field}`);
            err.name = 'ValidationError';
            return next(err);
        }
    }
    next();
};

app.post('/exercises', validateBody,
    expressAsyncHandler(async (req, res) => {
        const new_exercise = await exercise.addExercise(req.body);
        res.status(201).type('application/json').send(new_exercise);
    }));

app.get('/exercises',
    expressAsyncHandler(async (req, res) => {
        const exercises = await exercise.retrieveExercise();
        res.status(200).type('application/json').send(exercises);
    }));

app.get('/exercises/:_id', validateId,
    expressAsyncHandler(async (req, res) => {
        const found = await exercise.retrieveExerciseByID(req.params);
        if (!found) throw new ReferenceError(`No exercise with id=${req.params._id}`);
        res.status(200).type('application/json').send(found);
    }));

app.put('/exercises/:_id', validateId, validateBody,
    expressAsyncHandler(async (req, res) => {
        const result = await exercise.updateExercise(req.params, req.body);
        if (result.matchedCount === 0) throw new ReferenceError(`No exercise with id=${req.params._id}`);
        const updated = await exercise.retrieveExerciseByID(req.params);
        res.status(200).type('application/json').send(updated);
    }));

app.delete('/exercises/:_id', validateId,
    expressAsyncHandler(async (req, res) => {
        const result = await exercise.deleteExercise(req.params);
        if (result.deletedCount === 0) throw new ReferenceError(`No exercise with id=${req.params._id}`);
        res.status(204).send();
    }));

app.use((err, req, res, next) => {
    console.error(`${err.name}: ${err.message}`);
    switch (err.name) {
        case 'ReferenceError':
            res.status(404).type('application/json').send({ Error: 'Not found' });
            break;
        case 'ValidationError':
            res.status(400).type('application/json').send({ Error: err.message || 'Invalid request' });
            break;
        default:
            console.error(err);
            res.status(500).type('application/json').send({ Error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
