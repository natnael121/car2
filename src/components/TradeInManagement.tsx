import React, { useState, useEffect } from 'react';
import { ClipboardList, DollarSign, CheckCircle, XCircle, Filter, Search, Eye, Phone, Mail, Car, Trash2, Tag, X } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { TradeIn, TradeInStatus } from '../types';
import { TradeInModal } from './TradeInModal';
import { format } from 'date-fns';

export const TradeInManagement: React.FC = () => {
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<TradeInStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tradeInsQuery = query(collection(db, 'trade_ins'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(tradeInsQuery, (snapshot) => {
      const tradeInsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TradeIn[];
      setTradeIns(tradeInsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (tradeInId: string, newStatus: TradeInStatus) => {
    try {
      await updateDoc(doc(db, 'trade_ins', tradeInId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating trade-in status:', error);
    }
  };

  const handleUpdateOffer = async (tradeInId: string) => {
    const offerAmount = prompt('Enter offer amount:');
    if (offerAmount && !isNaN(Number(offerAmount))) {
      try {
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 7);

        await updateDoc(doc(db, 'trade_ins', tradeInId), {
          offerAmount: Number(offerAmount),
          offerValidUntil: validUntil.toISOString(),
          status: 'offer-made',
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error updating offer:', error);
      }
    }
  };

  const handleDelete = async (tradeInId: string) => {
    if (window.confirm('Are you sure you want to delete this trade-in?')) {
      try {
        await deleteDoc(doc(db, 'trade_ins', tradeInId));
      } catch (error) {
        console.error('Error deleting trade-in:', error);
      }
    }
  };

  const handleAddTag = async (tradeInId: string, currentTags: string[] = []) => {
    const tag = prompt('Enter a tag:');
    if (tag && tag.trim()) {
      try {
        const updatedTags = [...currentTags, tag.trim()];
        await updateDoc(doc(db, 'trade_ins', tradeInId), {
          tags: updatedTags,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error adding tag:', error);
      }
    }
  };

  const handleRemoveTag = async (tradeInId: string, tagToRemove: string, currentTags: string[]) => {
    try {
      const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
      await updateDoc(doc(db, 'trade_ins', tradeInId), {
        tags: updatedTags,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error removing tag:', error);
    }
  };

  const filteredTradeIns = tradeIns.filter((ti) => {
    const matchesSearch =
      ti.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ti.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${ti.vehicle.make} ${ti.vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ti.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    pending: tradeIns.filter((ti) => ti.status === 'submitted').length,
    evaluating: tradeIns.filter((ti) => ti.status === 'evaluating' || ti.status === 'inspected').length,
    offersMade: tradeIns.filter((ti) => ti.status === 'offer-made').length,
    completed: tradeIns.filter((ti) => ti.status === 'completed').length,
  };

  const getStatusColor = (status: TradeInStatus) => {
    const colors = {
      submitted: 'bg-yellow-100 text-yellow-800',
      evaluating: 'bg-blue-100 text-blue-800',
      inspected: 'bg-blue-100 text-blue-800',
      'offer-made': 'bg-green-100 text-green-800',
      approved: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
      accepted: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trade-In Management</h1>
          <p className="text-gray-600 mt-1">Evaluate and process trade-in requests</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          New Trade-In Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <ClipboardList className="text-orange-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Evaluating</p>
              <p className="text-2xl font-bold text-blue-600">{stats.evaluating}</p>
            </div>
            <Eye className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Offers Made</p>
              <p className="text-2xl font-bold text-green-600">{stats.offersMade}</p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <CheckCircle className="text-blue-600" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search trade-ins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TradeInStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="evaluating">Evaluating</option>
            <option value="inspected">Inspected</option>
            <option value="offer-made">Offer Made</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <Eye size={48} className="mx-auto mb-4 text-gray-400 animate-spin" />
            <p>Loading trade-ins...</p>
          </div>
        ) : filteredTradeIns.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList size={48} className="mx-auto mb-4 text-gray-400" />
            <p>No trade-ins found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Condition</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Offer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tags</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTradeIns.map((tradeIn) => (
                  <tr key={tradeIn.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{tradeIn.customerName}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Mail size={14} /> {tradeIn.customerEmail}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Phone size={14} /> {tradeIn.customerPhone}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {tradeIn.vehicle.year} {tradeIn.vehicle.make} {tradeIn.vehicle.model}
                        </p>
                        <p className="text-sm text-gray-600">{tradeIn.vehicle.mileage.toLocaleString()} miles</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="capitalize text-gray-900">{tradeIn.vehicle.condition}</span>
                    </td>
                    <td className="py-4 px-4">
                      {tradeIn.offerAmount ? (
                        <div>
                          <p className="font-semibold text-green-600">${tradeIn.offerAmount.toLocaleString()}</p>
                          {tradeIn.offerValidUntil && (
                            <p className="text-xs text-gray-600">
                              Valid until {format(new Date(tradeIn.offerValidUntil), 'MMM dd')}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUpdateOffer(tradeIn.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Make Offer
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tradeIn.status)}`}>
                        {tradeIn.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 items-center">
                        {tradeIn.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tradeIn.id, tag, tradeIn.tags || [])}
                              className="hover:text-green-900"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        <button
                          onClick={() => handleAddTag(tradeIn.id, tradeIn.tags)}
                          className="p-1 text-gray-400 hover:text-green-600 transition"
                          title="Add tag"
                        >
                          <Tag size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={tradeIn.status}
                          onChange={(e) => handleStatusUpdate(tradeIn.id, e.target.value as TradeInStatus)}
                          className="text-sm px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="evaluating">Evaluating</option>
                          <option value="inspected">Inspected</option>
                          <option value="offer-made">Offer Made</option>
                          <option value="approved">Approved</option>
                          <option value="declined">Declined</option>
                          <option value="accepted">Accepted</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => handleDelete(tradeIn.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TradeInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
