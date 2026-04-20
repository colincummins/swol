import React from 'react';
import { Link } from 'react-router-dom';
import ExerciseList from '../components/ExerciseList';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function HomePage({setExerciseToEdit}) {
    const [exercises, setExercises] = useState([]);
    const history = useHistory()

    const loadExercises = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/exercises`);
        const exercises = await response.json();
        setExercises(exercises);
    }

    const onDelete = async id => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/exercises/${id}`, { method: 'DELETE' });
        if (response.status === 204) {
            const getResponse = await fetch(`${import.meta.env.VITE_API_URL}/exercises`);
            const exercises = await getResponse.json();
            setExercises(exercises);
        } else {
            console.error(`Failed to delete exercise with id = ${id}, status code = ${response.status}`)
        }
    }

    const onEdit = async exerciseToEdit => {
        setExerciseToEdit(exerciseToEdit);
        history.push("/edit-exercise");
    }

    useEffect(() => {
        loadExercises();
    }, []);

    return (
        <>
            <h1>Exercise History</h1>
            <ExerciseList exercises={exercises} onDelete={onDelete} onEdit={onEdit} setExerciseToEdit={setExerciseToEdit}/>
            <Link to="/add-exercise">Create Exercise</Link>
        </>
    );
}

export default HomePage;