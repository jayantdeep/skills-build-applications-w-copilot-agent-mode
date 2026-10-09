import { useCallback, useEffect, useState } from 'react';
import { apiBase, deleteResource, fetchResource, saveResource } from './api';

const emptyValue = (field) => field.type === 'number' ? '' : '';

function initialForm(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, emptyValue(field)]));
}

function fieldValue(field, value) {
  if (field.multilineArray) return Array.isArray(value) ? value.join('\n') : '';
  return value ?? '';
}

function ResourceManager({
  title,
  description,
  endpoint,
  fields,
  columns,
  renderRow,
  options = {},
  optionsError = '',
  apiFetch = fetchResource,
}) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(() => initialForm(fields));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRecords(await apiFetch(endpoint));
    } catch (loadError) {
      setError(loadError.message || `Unable to load ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }, [apiFetch, endpoint, title]);

  useEffect(() => {
    let ignore = false;
    apiFetch(endpoint)
      .then((data) => {
        if (!ignore) {
          setRecords(data);
          setError('');
        }
      })
      .catch((loadError) => {
        if (!ignore) setError(loadError.message || `Unable to load ${title.toLowerCase()}.`);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [apiFetch, endpoint, title]);

  const resetForm = () => {
    setForm(initialForm(fields));
    setEditingId(null);
  };

  const editRecord = (record) => {
    setEditingId(record._id || record.id);
    setForm(Object.fromEntries(fields.map((field) => {
      const value = record[field.name];
      const normalized = value && typeof value === 'object' ? value._id || value.id || '' : value;
      return [field.name, fieldValue(field, normalized)];
    })));
    setError('');
    setNotice('');
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    const payload = Object.fromEntries(fields.map((field) => {
      const value = form[field.name];
      const normalized = field.multilineArray
        ? value.split('\n').map((line) => line.trim()).filter(Boolean)
        : field.emptyAsNull && value === ''
          ? null
          : field.type === 'number' && value !== ''
            ? Number(value)
            : value;
      return [field.name, normalized];
    }));

    try {
      await saveResource(endpoint, payload, editingId);
      resetForm();
      setNotice(`${title.slice(0, -1)} ${editingId ? 'updated' : 'created'} successfully.`);
      await loadRecords();
    } catch (saveError) {
      setError(saveError.message || `Unable to save ${title.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  const removeRecord = async (record) => {
    const id = record._id || record.id;
    if (!window.confirm(`Delete this ${title.slice(0, -1).toLowerCase()}? This cannot be undone.`)) return;
    setError('');
    setNotice('');
    try {
      await deleteResource(endpoint, id);
      if (editingId === id) resetForm();
      setNotice(`${title.slice(0, -1)} deleted.`);
      await loadRecords();
    } catch (deleteError) {
      setError(deleteError.message || `Unable to delete ${title.toLowerCase()}.`);
    }
  };

  return (
    <main className="page-card">
      <div className="page-title d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="status-pill">{records.length} records</span>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {optionsError && <div className="alert alert-warning" role="alert">{optionsError}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}

      <section className="editor-panel mb-4" aria-labelledby="record-form-title">
        <h3 id="record-form-title" className="h5 mb-3">{editingId ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}</h3>
        <form onSubmit={submitForm}>
          <div className="row g-3">
            {fields.map((field) => (
              <div key={field.name} className={field.wide ? 'col-12' : 'col-md-6'}>
                <label htmlFor={`${endpoint}-${field.name}`} className="form-label">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    id={`${endpoint}-${field.name}`}
                    className="form-select"
                    value={form[field.name]}
                    onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                    required={field.required}
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {(options[field.optionsKey] || []).map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={`${endpoint}-${field.name}`}
                    className="form-control"
                    rows="2"
                    value={form[field.name]}
                    onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                    required={field.required}
                  />
                ) : (
                  <input
                    id={`${endpoint}-${field.name}`}
                    className="form-control"
                    type={field.type || 'text'}
                    min={field.type === 'number' ? field.min ?? 0 : undefined}
                    step={field.type === 'number' ? 'any' : undefined}
                    value={form[field.name]}
                    onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : `Create ${title.slice(0, -1).toLowerCase()}`}
            </button>
            {editingId && <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </section>

      {loading ? (
        <div className="loading-state">Loading {title.toLowerCase()}…</div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <h3 className="h5">No {title.toLowerCase()} yet</h3>
          <p className="mb-0 text-body-secondary">Use the form above to create the first record.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table resource-table align-middle">
            <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}<th>Actions</th></tr></thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id || record.id}>
                  {renderRow(record)}
                  <td className="text-nowrap">
                    <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => editRecord(record)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeRecord(record)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3 small text-body-secondary">Live data source: {apiBase}{endpoint}</div>
    </main>
  );
}

export default ResourceManager;
