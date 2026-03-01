import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import toast from 'react-hot-toast';

const COLUMNS = [
  { key: 'new',       label: 'New',       color: 'bg-blue-500',   light: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  { key: 'contacted', label: 'Contacted', color: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  { key: 'qualified', label: 'Qualified', color: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { key: 'won',       label: 'Won',       color: 'bg-green-500',  light: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
  { key: 'lost',      label: 'Lost',      color: 'bg-red-400',    light: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
];

const CrmPipeline = () => {
  const [pipeline, setPipeline] = useState({});
  const [loading, setLoading]   = useState(true);
  const [moving, setMoving]     = useState(null);

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/crm/pipeline');
      setPipeline(res.data.data || {});
    } catch {
      toast.error('Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPipeline(); }, []);

  const moveCard = async (leadId, newStatus) => {
    setMoving(leadId);
    try {
      await api.put(`/admin/crm/leads/${leadId}`, { status: newStatus });
      await fetchPipeline();
      toast.success(`Moved to ${COLUMNS.find(c => c.key === newStatus)?.label}`);
    } catch {
      toast.error('Failed to move lead');
    } finally {
      setMoving(null);
    }
  };

  const totalLeads = Object.values(pipeline).reduce((s, arr) => s + arr.length, 0);
  const wonLeads   = (pipeline.won || []).length;
  const wonValue   = (pipeline.won || []).reduce((s, l) => s + Number(l.estimated_value || 0), 0);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">CRM — Pipeline</h1>
          <p className="text-sm text-gray-500 mt-0.5">Drag leads through your sales stages.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/crm/leads" className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            List View
          </Link>
          <Link to="/admin/crm/leads" className="px-4 py-2 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            New Lead
          </Link>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Leads', value: totalLeads, color: 'text-gray-900', bg: 'bg-white' },
          { label: 'Won',         value: wonLeads,   color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Won Value',   value: wonValue > 0 ? `${wonValue.toLocaleString()} DH` : '0 DH', color: 'text-green-700', bg: 'bg-green-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 p-4 text-center`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
          {COLUMNS.map(col => {
            const cards = pipeline[col.key] || [];
            return (
              <div key={col.key} className={`${col.light} rounded-2xl border ${col.border} overflow-hidden`}>
                {/* Column header */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${col.text}`}>{col.label}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white ${col.text}`}>{cards.length}</span>
                </div>

                {/* Cards */}
                <div className="px-3 pb-3 space-y-2 min-h-[120px]">
                  <AnimatePresence>
                    {cards.length === 0 ? (
                      <div className="text-center py-6 text-xs text-gray-400">No leads</div>
                    ) : (
                      cards.map(lead => (
                        <motion.div key={lead.id}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-white rounded-2xl border border-white shadow-sm p-4 hover:shadow-md transition-shadow">
                          {/* Avatar + name */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-7 h-7 rounded-full ${col.light} ${col.text} flex items-center justify-center text-xs font-bold shrink-0 border border-current/20`}>
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link to={`/admin/crm/leads/${lead.id}`} className="text-xs font-bold text-gray-900 hover:text-purple-600 truncate block transition-colors">
                                {lead.name}
                              </Link>
                              {lead.company && <p className="text-[10px] text-gray-400 truncate">{lead.company}</p>}
                            </div>
                          </div>

                          {/* Service interest */}
                          {lead.service_interest && (
                            <p className="text-[10px] text-gray-500 mb-2 flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                              {lead.service_interest}
                            </p>
                          )}

                          {/* Value */}
                          {lead.estimated_value && (
                            <p className="text-[10px] font-bold text-green-600 mb-2">{Number(lead.estimated_value).toLocaleString()} DH</p>
                          )}

                          {/* Notes count */}
                          {lead.notes_count > 0 && (
                            <p className="text-[10px] text-gray-400 mb-2">{lead.notes_count} note{lead.notes_count !== 1 ? 's' : ''}</p>
                          )}

                          {/* Move buttons */}
                          <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                            {COLUMNS.filter(c => c.key !== col.key).map(target => (
                              <button
                                key={target.key}
                                onClick={() => moveCard(lead.id, target.key)}
                                disabled={moving === lead.id}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${target.light} ${target.text} hover:opacity-80 transition-opacity disabled:opacity-40`}
                              >
                                → {target.label}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default CrmPipeline;
