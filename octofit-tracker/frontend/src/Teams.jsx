import ResourceManager from './ResourceManager';
import { fetch } from './api';

const fields = [
  { name: 'name', label: 'Team name', required: true },
  { name: 'description', label: 'Description', type: 'textarea', wide: true },
];

export default function Teams() {
  return (
    <ResourceManager
      title="Teams"
      description="Create and manage squads for friendly competition."
      endpoint="/api/teams/"
      fields={fields}
      apiFetch={fetch}
      columns={['Team', 'Description', 'Members']}
      renderRow={(team) => (
        <>
          <td>{team.name || 'New team'}</td>
          <td>{team.description || 'No description yet.'}</td>
          <td>{team.members?.length ?? 0}</td>
        </>
      )}
    />
  );
}
