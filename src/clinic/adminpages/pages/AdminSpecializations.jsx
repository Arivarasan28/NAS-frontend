import React, { useEffect, useState } from 'react';
import SpecializationService from '../../../services/SpecializationService';

const emptyForm = { name: '', description: '' };

const AdminSpecializations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await SpecializationService.getAll();
      setItems(res.data || []);
      setError(null);
    } catch (e) {
      setError('Failed to load specializations');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setError('Name is required');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await SpecializationService.update(editingId, form);
      } else {
        await SpecializationService.create(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (e) {
      const msg = e?.response?.data?.message || 'Save failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (it) => {
    setEditingId(it.id);
    setForm({ name: it.name || '', description: it.description || '' });
  };

  const onCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this specialization?')) return;
    try {
      await SpecializationService.delete(id);
      await load();
    } catch (e) {
      setError('Delete failed');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Specializations</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
      )}

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">{editingId ? 'Edit' : 'Add'} Specialization</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded p-2"
              placeholder="e.g., Cardiologist"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded p-2"
              rows={3}
              placeholder="Short description (optional)"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {submitting ? 'Saving...' : (editingId ? 'Update' : 'Create')}
            </button>
            {editingId && (
              <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded shadow">
        <div className="p-4 border-b font-semibold">All Specializations</div>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-gray-600">No specializations found.</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3 w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id} className="border-t">
                  <td className="p-3">{idx + 1}</td>
                  <td className="p-3">{it.name}</td>
                  <td className="p-3 text-gray-600">{it.description || '-'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => onEdit(it)} className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600 text-sm">Edit</button>
                      <button onClick={() => onDelete(it.id)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminSpecializations;
