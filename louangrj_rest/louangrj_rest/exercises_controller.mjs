import 'dotenv/config';
import * as exercises from './exercises_model.mjs';
import express from 'express';

const PORT = process.env.PORT;

const app = express();

app.use(express.json());

function isDateValid(date) {
    /*
     * @param {string} date
     * Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
     */
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

/* Create a new exercise with the name, reps, weight, unit, and date provided in the body */
/* Validate the input */
app.post('/exercises', (req, res) => {
    if (
        (req.body.name.length > 0) &&
        (req.body.reps > 0) &&
        (req.body.weight > 0) &&
        (req.body.unit == 'kgs' || 'lbs') &&
        (isDateValid(req.body.date) == true)) {

        exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
            .then(exercise => {
                res.status(201).json(exercise);
            })
            .catch(error => {
                console.log(error);
                res.status(400).json({
                    Error: "Invalid request"
                });
            })

    } else {
        res.status(400).json({
            Error: "Invalid request"
        });
    }
});


/**
 * Retrive the exercise corresponding to the ID provided in the URL.
 */
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({
                    Error: "Not found"
                });
            }
        })
        .catch(error => {
            res.status(400).json({
                Error: "Not found"
            });
        });
});

/**
 * Retrieve exercises. 
 */
app.get('/exercises', async (req, res) => {
    let filter = {};
    if (req.query._id !== undefined) {
        filter = {
            year: req.query.year
        };
    }
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.status(200).json(exercises);
        })
        .catch(error => {
            res.status(400).json({
                Error: 'Request failed'
            });
        });
});

/**
 * Update the exercise whose id is provided in the path parameter and set
 * its name, reps, weight, unit, and date to the values provided in the body.
 */
app.put('/exercises/:_id', (req, res) => {
    if (
        (req.body.name.length > 0) &&
        (req.body.reps > 0) &&
        (req.body.weight > 0) &&
        (req.body.unit == 'kgs' || 'lbs') &&
        (isDateValid(req.body.date) == true)) {

        exercises.replaceExercise(
                req.params._id,
                req.body.name,
                req.body.reps,
                req.body.weight,
                req.body.unit,
                req.body.date
            )
            .then(numUpdated => {
                if (numUpdated === 1) {
                    res.status(200).json({
                        _id: req.params._id,
                        name: req.body.name,
                        reps: req.body.reps,
                        weight: req.body.weight,
                        unit: req.body.unit,
                        date: req.body.date
                    })
                } else if (numUpdated === 0) {
                    res.status(404).json({
                        Error: 'Not found'
                    });
                }
            })

    } else {
        res.status(400).json({
            Error: 'Invalid request'
        });
    }
});

/**
 * Delete the exercise whose id is provided in the query parameters
 */
 app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'Not found '});
            }
        })
        .catch(error => {
            res.status(404).json({ Error: 'Not found '});
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});