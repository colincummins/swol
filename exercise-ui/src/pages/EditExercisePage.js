import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

export const EditExercisePage = ({exerciseToEdit}) => {
    const history = useHistory();

    const [name, setName] = useState(exerciseToEdit.name);
    const [reps, setReps] = useState(exerciseToEdit.reps);
    const [weight, setWeight] = useState(exerciseToEdit.weight);
    const [unit, setUnit] = useState(exerciseToEdit.unit);
    const [date, setDate] = useState(exerciseToEdit.date);

    const editExercise = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/exercises/${exerciseToEdit._id}`, {
            method: 'PUT',
            body: JSON.stringify({name: name, reps: reps, weight: weight, unit: unit, date: date}),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if(response.status === 200){
            alert("Successfully edited the exercise!");
        } else {
            alert(`Failed to edit exercise, status code = ${response.status}`);
        }     history.push("/");
    };

    return (
        <div>
            <h1>Edit Exercise</h1>
            <div className="input_block">
                <label for="Name">Name</label><br/>
                <input
                name="name"
                type="text"
                placeholder={name}
                value={name}
                onChange={e => setName(e.target.value)} />
            </div>
            <div className="input_block">
                <label for="reps">Reps</label><br/>
                <input
                name="reps"
                type="text"
                placeholder={reps}
                value={reps}
                onChange={e => setReps(e.target.value)} />
            </div>
            <div className="input_block">
                <label for="weight">Weight</label><br/>
                <input
                    name="weight"
                    type="text"
                    placeholder={weight}
                    value={weight}
                    onChange={e => setWeight(e.target.value)} />
            </div>
            <div className="input_block">
                <label for="unit">Unit</label><br/>
                <select
                name="unit"
                onChange={e => setUnit(e.target.value)}>
                <option value={unit}>{unit}</option>
                <option value="kgs">kgs</option>
                <option value="lbs">lbs</option>
            </select>
            </div>
            <div className="input_block">
                <label for="date">Date</label><br/>
                <input
                name="date"
                type="text"
                placeholder={date}
                value={date}
                onChange={e => setDate(e.target.value)} />
            </div>
            <button
                onClick={editExercise}
            >Edit</button>
        </div>
    );
}

export default EditExercisePage;
