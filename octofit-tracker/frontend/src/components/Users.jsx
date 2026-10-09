import { useEffect, useState } from 'react';
import ResourceManager from '../ResourceManager';
import { fetch } from '../api';

const endpoint = '/api/users/';
const fields = [
  { name: 'displayName', label: 'Display name', required: true },
  { name: 'username', label: 'Username', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'team', label: 'Team', type: 'select', optionsKey: 'teams', emptyAsNull: true },
];

export default function Users() {
  const [teams, setTeams] = useState([]);
  const [teamsError, setTeamsError] = useState('');

  useEffect(() => {
    fetch('/api/teams/')
      .then((records) => setTeams(records.map((team) => ({
        value: team._id || team.id,
        label: team.name,
      }))))
      .catch((error) => setTeamsError(`Teams could not be loaded for assignment: ${error.message}`));
  }, []);

  return (
    <ResourceManager
      title="Students"
      description="Manage athlete profiles and team assignments."
      endpoint={endpoint}
      fields={fields}
      options={{ teams }}
      optionsError={teamsError}
      apiFetch={fetch}
      columns={['Name', 'Username', 'Email', 'Team']}
      renderRow={(user) => (
        <>
          <td>{user.displayName || 'Student'}</td>
          <td>{user.username || '—'}</td>
          <td>{user.email || '—'}</td>
          <td>{user.team?.name || user.team || 'No team assigned'}</td>
        </>
      )}
    />
  );
}
