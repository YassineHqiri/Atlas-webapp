import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import toast from 'react-hot-toast';

const STATUS_META = {
  new:        { label: 'New',        bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  contacted:  { label: 'Contacted',  bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  qualified:  { label: 'Qualified',  bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-400' },
  won:        { label: 'Won',        bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-400' },
  lost:       { label: 'Lost',       bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-400' },
};

const PIPELINE_ORDER = ['new', 'contacted', 'qualified', 'won', 'lost'];

const CrmLeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [editMode, setEditMode]   = useState(false);
  const [form, setForm]           = useState({});
  const [saving, setSaving]       = useState(false);
  const [noteText, setNoteText]   = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/crm/leads/${id}`);
      setLead(res.data.data);
      setForm({
        name: res.data.data.name || '',
        email: res.data.data.email || '',
        phone: res.data.data.phone || '',
        company: res.data.data.company || '',
        status: res.data.data.status || 'new',
        service_interest: res.data.data.service_interest || '',
        estimated_value: res.data.data.estimated_value || '',
        message: res.data.data.message || '',
      });
    } catch {
      toast.error('Lead not found');
      navigate('/admin/crm/leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.estimated_value) delete payload.estimated_value;
      const res = await api.put(`/admin/crm/leads/${id}`, payload);
      setLead(res.data.data);
      setEditMode(false);
      toast.success('Lead updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await api.put(`/admin/crm/leads/${id}`, { status: newStatus });
      setLead(res.data.data);
      setForm(f => ({ ...f, status: newStatus }));
      toast.success(`Status → ${STATUS_META[newStatus].label}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      const res = await api.post(`/admin/crm/leads/${id}/notes`, { content: noteText });
      setLead(prev => ({ ...prev, notes: [res.data.data, ...(prev.notes || [])] }));
      setNoteText('');
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await api.delete(`/admin/crm/leads/${id}/notes/${noteId}`);
      setLead(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== noteId) }));
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (!lead) return null;

  const statusMeta = STATUS_META[lead.status] || STATUS_META.new;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/crm/leads" className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          </Link>
          <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold text-lg">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{lead.name}</h1>
            {lead.company && <p className="text-sm text-gray-500">{lead.company}</p>}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.text}`}>{statusMeta.label}</span>
        </div>
        <div className="flex gap-3">
          {editMode ? (
            <>
              <button onClick={() => setEditMode(false)} className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800">
              Edit Lead
            </button>
          )}
        </div>
      </div>

      {/* Pipeline progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Pipeline Stage</p>
        <div className="flex items-center gap-1">
          {PIPELINE_ORDER.map((s, i) => {
            const m = STATUS_META[s];
            const currentIdx = PIPELINE_ORDER.indexOf(lead.status);
            const isActive = s === lead.status;
            const isPast = i < currentIdx && lead.status !== 'lost';
            return (
              <div key={s} className="flex items-center flex-1">
                <button
                  onClick={() => handleStatusChange(s)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all text-center ${
                    isActive ? `${m.bg} ${m.text} ring-2 ring-offset-1 ring-current` :
                    isPast ? 'bg-gray-100 text-gray-500' :
                    'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {m.label}
                </button>
                {i < PIPELINE_ORDER.length - 1 && <div className="w-3 h-px bg-gray-200 mx-0.5 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Left — details */}
        <div className="lg:col-span-2 space-y-5">

          {/* Info card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Contact Details</h2>
            {editMode ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Name', key: 'name', type: 'text', required: true },
                  { label: 'Company', key: 'company', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Phone', key: 'phone', type: 'text' },
                  { label: 'Service Interest', key: 'service_interest', type: 'text' },
                  { label: 'Estimated Value (DH)', key: 'estimated_value', type: 'number' },
                ].map(({ label, key, type, required }) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">{label}{required && ' *'}</label>
                    <input
                      type={type}
                      required={required}
                      value={form[key] || ''}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Message / Notes</label>
                  <textarea rows={3} value={form.message || ''} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Email',            value: lead.email },
                  { label: 'Phone',            value: lead.phone },
                  { label: 'Company',          value: lead.company },
                  { label: 'Service Interest', value: lead.service_interest },
                  { label: 'Estimated Value',  value: lead.estimated_value ? `${Number(lead.estimated_value).toLocaleString()} DH` : null },
                  { label: 'Source',           value: lead.source === 'contact_form' ? 'Contact Form' : 'Manual' },
                  { label: 'Created',          value: new Date(lead.created_at).toLocaleString() },
                  { label: 'Last Updated',     value: new Date(lead.updated_at).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-gray-800 mt-0.5">{value || <span className="text-gray-300">—</span>}</p>
                  </div>
                ))}
                {lead.message && (
                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Message</p>
                    <p className="text-sm text-gray-700 mt-0.5 bg-gray-50 rounded-xl p-3 leading-relaxed">{lead.message}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Original Contact Message (when from contact form) */}
          {lead.contact_message && (
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Original Contact Form Message
              </h2>
              <p className="text-xs text-gray-500 mb-2">{new Date(lead.contact_message.created_at).toLocaleString()}</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-blue-100">{lead.contact_message.message}</p>
            </div>
          )}

          {/* Linked Orders */}
          {lead.orders && lead.orders.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Orders ({lead.orders.length})</h2>
              <div className="space-y-3">
                {lead.orders.map((order) => (
                  <Link key={order.id} to="/admin/orders" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{order.service_pack?.name || '—'}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()} · {order.status}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{order.status}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Notes & Activity</h2>
            <form onSubmit={handleAddNote} className="flex gap-2 mb-5">
              <input
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note..."
                className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button type="submit" disabled={addingNote || !noteText.trim()}
                className="px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-40 transition-colors">
                Add
              </button>
            </form>

            {(!lead.notes || lead.notes.length === 0) ? (
              <p className="text-sm text-gray-400 text-center py-6">No notes yet. Add one above.</p>
            ) : (
              <div className="space-y-3">
                {lead.notes.map((note) => (
                  <motion.div key={note.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 group">
                    <div className="w-1 bg-purple-200 rounded-full shrink-0 mt-1" />
                    <div className="flex-1 bg-gray-50 rounded-2xl p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">{new Date(note.created_at).toLocaleString()}</p>
                        <button onClick={() => handleDeleteNote(note.id)}
                          className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all">
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Quick stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Quick Info</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.text}`}>{statusMeta.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Source</span>
                <span className="text-xs font-semibold text-gray-700">{lead.source === 'contact_form' ? 'Contact Form' : 'Manual'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Notes</span>
                <span className="text-xs font-semibold text-gray-700">{lead.notes?.length || 0}</span>
              </div>
              {lead.estimated_value && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Est. Value</span>
                  <span className="text-xs font-bold text-green-700">{Number(lead.estimated_value).toLocaleString()} DH</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {lead.email && (
                <a href={`mailto:${lead.email}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  Send Email
                </a>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`}
                  className="flex items-center gap-2.5 px-3 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-semibold hover:bg-green-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  Call
                </a>
              )}
              <Link to="/admin/crm/leads"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                All Leads
              </Link>
              <Link to="/admin/crm/pipeline"
                className="flex items-center gap-2.5 px-3 py-2.5 bg-purple-50 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-100 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
                Pipeline
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CrmLeadDetail;
