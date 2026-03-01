import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import toast from 'react-hot-toast';

const STATUS_META = {
  new:        { label: 'New',        bg: 'bg-blue-100',   text: 'text-blue-700' },
  contacted:  { label: 'Contacted',  bg: 'bg-yellow-100', text: 'text-yellow-700' },
  qualified:  { label: 'Qualified',  bg: 'bg-purple-100', text: 'text-purple-700' },
  won:        { label: 'Won',        bg: 'bg-green-100',  text: 'text-green-700' },
  lost:       { label: 'Lost',       bg: 'bg-red-100',    text: 'text-red-700' },
};

const SOURCE_META = {
  manual:       { label: 'Manual',       bg: 'bg-gray-100',   text: 'text-gray-600' },
  contact_form: { label: 'Contact Form', bg: 'bg-pink-100',   text: 'text-pink-700' },
};

const BLANK_FORM = {
  name: '', email: '', phone: '', company: '',
  status: 'new', service_interest: '', estimated_value: '', message: '',
};

const CrmLeads = () => {
  const [leads, setLeads]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilter]   = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [form, setForm]             = useState(BLANK_FORM);
  const [saving, setSaving]         = useState(false);
  const [deleteId, setDeleteId]     = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (search) params.search = search;
      const res = await api.get('/admin/crm/leads', { params });
      setLeads(res.data.data || []);
    } catch {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [filterStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.estimated_value) delete payload.estimated_value;
      await api.post('/admin/crm/leads', payload);
      toast.success('Lead created!');
      setShowModal(false);
      setForm(BLANK_FORM);
      fetchLeads();
    } catch {
      toast.error('Failed to create lead');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/crm/leads/${deleteId}`);
      toast.success('Lead deleted');
      setDeleteId(null);
      fetchLeads();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const StatusBadge = ({ status }) => {
    const m = STATUS_META[status] || STATUS_META.new;
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${m.bg} ${m.text}`}>{m.label}</span>;
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">CRM — Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track all your leads and contacts.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/crm/pipeline" className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            Pipeline View
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            New Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search name, email, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button type="submit" className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors">Search</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {[{ v: '', l: 'All' }, ...Object.entries(STATUS_META).map(([v, m]) => ({ v, l: m.label }))].map(({ v, l }) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${filterStatus === v ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-7 h-7 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            No leads found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{lead.name}</p>
                          {lead.company && <p className="text-xs text-gray-400">{lead.company}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      <p>{lead.email || '—'}</p>
                      <p className="text-xs text-gray-400">{lead.phone || ''}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{lead.service_interest || '—'}</td>
                    <td className="px-5 py-4"><StatusBadge status={lead.status} /></td>
                    <td className="px-5 py-4">
                      {(() => { const s = SOURCE_META[lead.source] || SOURCE_META.manual; return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>; })()}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{lead.notes_count ?? 0}</td>
                    <td className="px-5 py-4 text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/crm/leads/${lead.id}`} className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                          View
                        </Link>
                        <button onClick={() => setDeleteId(lead.id)} className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                          Delete
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-gray-900">New Lead</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Name *</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Company</label>
                    <input value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Service Interest</label>
                    <input value={form.service_interest} onChange={e => setForm({...form, service_interest: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Estimated Value (DH)</label>
                    <input type="number" min="0" value={form.estimated_value} onChange={e => setForm({...form, estimated_value: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300">
                    {Object.entries(STATUS_META).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Notes / Message</label>
                  <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={saving} className="flex-1 py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50">
                    {saving ? 'Creating...' : 'Create Lead'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Delete Lead?</h3>
              <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default CrmLeads;
