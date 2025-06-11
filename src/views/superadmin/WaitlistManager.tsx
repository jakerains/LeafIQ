import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Download, 
  Trash2, 
  Search, 
  X, 
  Mail, 
  Calendar, 
  Filter, 
  ExternalLink, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { supabase } from '../../lib/supabase';

interface WaitlistSignup {
  id: string;
  email: string;
  created_at: string;
  source: string;
  notes: string | null;
  // UI-only fields
  isSelected?: boolean;
}

const WaitlistManager: React.FC = () => {
  const [waitlist, setWaitlist] = useState<WaitlistSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [addingEmail, setAddingEmail] = useState(false);

  useEffect(() => {
    fetchWaitlist();
  }, []);

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('Error fetching waitlist:', fetchError);
        setError('Failed to load waitlist data');
        return;
      }
      
      setWaitlist(data || []);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) return fetchWaitlist();
    
    const filtered = waitlist.filter(item => 
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setWaitlist(filtered);
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedRows.size} selected entries?`)) {
      return;
    }
    
    try {
      const idsToDelete = Array.from(selectedRows);
      const { error } = await supabase
        .from('waitlist_signups')
        .delete()
        .in('id', idsToDelete);
      
      if (error) {
        console.error('Error deleting waitlist entries:', error);
        setError('Failed to delete selected entries');
        return;
      }
      
      // Remove deleted entries from the local state
      setWaitlist(prev => prev.filter(item => !selectedRows.has(item.id)));
      setSelectedRows(new Set()); // Clear selection
      setSelectAll(false);
    } catch (err) {
      console.error('Unexpected error during deletion:', err);
      setError('An unexpected error occurred during deletion');
    }
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail.trim() || !/\S+@\S+\.\S+/.test(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setAddingEmail(true);
      
      const { error } = await supabase
        .from('waitlist_signups')
        .insert({
          email: newEmail.toLowerCase().trim(),
          source: 'admin_added',
          notes: 'Added by admin'
        });
      
      if (error) {
        if (error.code === '23505') {
          setError('This email is already on the waitlist');
        } else {
          console.error('Error adding email:', error);
          setError('Failed to add email to waitlist');
        }
        return;
      }
      
      // Refresh the list
      await fetchWaitlist();
      
      // Reset form
      setNewEmail('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Unexpected error adding email:', err);
      setError('An unexpected error occurred');
    } finally {
      setAddingEmail(false);
    }
  };

  const handleExportCSV = () => {
    // Filter selected rows or use all if none selected
    const dataToExport = selectedRows.size > 0
      ? waitlist.filter(item => selectedRows.has(item.id))
      : waitlist;
    
    if (dataToExport.length === 0) {
      setError('No data to export');
      return;
    }
    
    // Create CSV content
    const headers = ['Email', 'Signup Date', 'Source', 'Notes'];
    const csvRows = [
      headers.join(','),
      ...dataToExport.map(item => [
        item.email,
        new Date(item.created_at).toLocaleString(),
        item.source || '',
        (item.notes || '').replace(/,/g, ' ') // Remove commas from notes to prevent CSV issues
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger it
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leafiq-waitlist-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRowSelect = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    
    // Update selectAll state if all visible rows are now selected
    setSelectAll(newSelected.size === waitlist.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedRows(new Set());
    } else {
      // Select all visible rows
      const allIds = waitlist.map(item => item.id);
      setSelectedRows(new Set(allIds));
    }
    setSelectAll(!selectAll);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-purple-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Waitlist Signups</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {waitlist.length} email{waitlist.length !== 1 ? 's' : ''} collected
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline" 
                onClick={handleExportCSV}
                disabled={waitlist.length === 0}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export</span> CSV
              </Button>
              
              <Button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {showAddForm ? 'Cancel' : 'Add Email'}
              </Button>
            </div>
          </div>
        </div>

        {/* Add Email Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-100"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Email to Waitlist</h3>
              <form onSubmit={handleAddEmail} className="flex gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  disabled={addingEmail}
                  className="bg-purple-600 hover:bg-purple-700 text-white min-w-[100px]"
                >
                  {addingEmail ? 'Adding...' : 'Add Email'}
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Search Bar and Actions */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search emails or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 w-full px-4 py-2 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    fetchWaitlist();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Search
              </Button>
              
              {selectedRows.size > 0 && (
                <Button
                  variant="outline"
                  onClick={handleDeleteSelected}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete ({selectedRows.size})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100">
            <div className="flex items-center text-red-700">
              <XCircle size={16} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Waitlist Table */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading waitlist data...</p>
          </div>
        ) : waitlist.length === 0 ? (
          <div className="p-12 text-center">
            <Mail size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No waitlist signups yet</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No results match your search query.' : 'When users sign up for the waitlist, they will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="pl-6 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signup Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {waitlist.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 ${selectedRows.has(item.id) ? 'bg-purple-50' : ''}`}
                  >
                    <td className="pl-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail size={16} className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{item.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(item.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-purple-100 text-purple-800">
                        {item.source || 'website'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{item.notes || '-'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination or Summary (can be expanded later) */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {waitlist.length} waitlist signup{waitlist.length !== 1 ? 's' : ''}
            </div>
            {selectedRows.size > 0 && (
              <div className="text-sm text-gray-600">
                {selectedRows.size} row{selectedRows.size !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistManager;