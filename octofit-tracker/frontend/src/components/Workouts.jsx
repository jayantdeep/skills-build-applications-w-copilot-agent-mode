import ResourceManager from '../ResourceManager';
import { fetch } from '../api';

const fields = [
  { name: 'title', label: 'Workout title', required: true },
  { name: 'activityType', label: 'Activity type', type: 'select', required: true, optionsKey: 'activityTypes' },
  { name: 'description', label: 'Description', type: 'textarea', required: true, wide: true },
  { name: 'level', label: 'Level', type: 'select', required: true, optionsKey: 'levels' },
  { name: 'durationMinutes', label: 'Duration (minutes)', type: 'number', min: 1, required: true },
  { name: 'instructions', label: 'Instructions (one per line)', type: 'textarea', wide: true, multilineArray: true },
];

const options = {
  activityTypes: [
    { value: 'running', label: 'Running' },
    { value: 'walking', label: 'Walking' },
    { value: 'strength-training', label: 'Strength training' },
    { value: 'other', label: 'Other' },
  ],
  levels: [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ],
};

export default function Workouts() {
  return (
    <ResourceManager
      title="Workouts"
      description="Create and maintain personalized workout suggestions."
      endpoint="/api/workouts/"
      fields={fields}
      options={options}
      apiFetch={fetch}
      columns={['Workout', 'Type', 'Level', 'Duration']}
      renderRow={(workout) => (
        <>
          <td>
            <strong>{workout.title || 'Workout'}</strong>
            <div className="small text-body-secondary">{workout.description || 'No description yet.'}</div>
          </td>
          <td>{workout.activityType || '—'}</td>
          <td>{workout.level || 'beginner'}</td>
          <td>{workout.durationMinutes || 0} min</td>
        </>
      )}
    />
  );
}
