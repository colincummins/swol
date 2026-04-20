import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool();

pool.on('error', (err) => {
    console.error('Unexpected pg client error:', err);
});

try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS exercises (
            id      SERIAL PRIMARY KEY,
            name    TEXT NOT NULL,
            reps    INTEGER NOT NULL CHECK (reps >= 1),
            weight  NUMERIC NOT NULL CHECK (weight >= 1),
            unit    TEXT NOT NULL CHECK (unit IN ('kgs', 'lbs')),
            date    TEXT NOT NULL
        )
    `);
    console.log('Connected to PostgreSQL and verified exercises table.');
} catch (err) {
    console.error('Failed to initialize database:', err.message);
    console.error('Check PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD in .env');
    process.exit(1);
}

// pg constraint/cast violations → named errors the controller middleware understands
const PG_VALIDATION_CODES = new Set(['23502', '23514', '23505', '22P02']);
const translateError = (err) => {
    if (PG_VALIDATION_CODES.has(err.code)) {
        err.name = 'ValidationError';
        err.message = err.detail ?? err.message;
    }
    throw err;
};

const toDoc = row => ({ ...row, _id: row.id });

const addExercise = async ({ name, reps, weight, unit, date }) => {
    try {
        const { rows } = await pool.query(
            'INSERT INTO exercises (name, reps, weight, unit, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, reps, weight, unit, date]
        );
        return toDoc(rows[0]);
    } catch (err) { translateError(err); }
};

const retrieveExercise = async () => {
    const { rows } = await pool.query('SELECT * FROM exercises');
    return rows.map(toDoc);
};

const retrieveExerciseByID = async ({ _id }) => {
    try {
        const { rows } = await pool.query('SELECT * FROM exercises WHERE id = $1', [_id]);
        return rows.length ? toDoc(rows[0]) : null;
    } catch (err) { translateError(err); }
};

const updateExercise = async ({ _id }, { name, reps, weight, unit, date }) => {
    try {
        const result = await pool.query(
            'UPDATE exercises SET name=$1, reps=$2, weight=$3, unit=$4, date=$5 WHERE id=$6',
            [name, reps, weight, unit, date, _id]
        );
        return { matchedCount: result.rowCount };
    } catch (err) { translateError(err); }
};

const deleteExercise = async ({ _id }) => {
    const result = await pool.query('DELETE FROM exercises WHERE id = $1', [_id]);
    return { deletedCount: result.rowCount };
};

export { addExercise, retrieveExercise, retrieveExerciseByID, updateExercise, deleteExercise };
