import React, { useState } from 'react';
import { Plus, X, Save, FileText } from 'lucide-react';

const ClearanceOperation = () => {
  const [formData, setFormData] = useState({
    // Basic Info
    operationType: 'Import',
    transportMode: 'Sea',
    client: '',
    jobNo: '',
    commodity: '',
    noOfPackages: '',
    pod: '',
    line: '',
    vessel: '',
    netWeight: '',
    grossWeight: '',
    shipper: '',
    
    // Client Details
    clientRefName: '',
    lineAgent: '',
    representative: '',
    receivingRep: '',
    pol: '',
    
    // Dates and Numbers
    bayanNo: '',
    bayanDate: '',
    paymentDate: '',
    group: '',
    eta: '',
    date: '',
    yardDate: '',
    hijriDate: '',
    endDate: '',
    releaseDate: '',
    
    // Status and Notes
    status: '',
    notes: '',
    bl: '',
    poNo: ''
  });

  const [containers, setContainers] = useState([
    { id: 1, qty: '', type: '' }
  ]);

  const [bills, setBills] = useState([
    { id: 1, clientRef: '', doDate: '', doNo: '', endorseNo: '', billNo: '' }
  ]);

  const vesselOptions = ['Select', 'MSC Maya', 'OOCL Hamburg', 'Maersk Madrid', 'CMA CGM Liberty'];
  const polOptions = ['Select', 'Jeddah', 'Dubai', 'Shanghai', 'Rotterdam'];
  const containerTypes = ['20GP', '40GP', '40HC', '45HC', '20RF', '40RF'];

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addContainer = () => {
    setContainers(prev => [...prev, { id: Date.now(), qty: '', type: '' }]);
  };

  const removeContainer = (id) => {
    setContainers(prev => prev.filter(container => container.id !== id));
  };

  const updateContainer = (id, field, value) => {
    setContainers(prev => prev.map(container => 
      container.id === id ? { ...container, [field]: value } : container
    ));
  };

  const addBill = () => {
    setBills(prev => [...prev, { id: Date.now(), clientRef: '', doDate: '', doNo: '', endorseNo: '', billNo: '' }]);
  };

  const removeBill = (id) => {
    setBills(prev => prev.filter(bill => bill.id !== id));
  };

  const updateBill = (id, field, value) => {
    setBills(prev => prev.map(bill => 
      bill.id === id ? { ...bill, [field]: value } : bill
    ));
  };

  const handleAddFiles = () => {
    console.log('Add files functionality');
  };

  const handleSave = () => {
    console.log('Save functionality', { formData, containers, bills });
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 font-sans bg-slate-300 min-h-screen">
      {/* Main Title */}
      <div className="bg-slate-700 text-white text-center py-3 mb-3 rounded-lg">
        <h1 className="text-lg font-semibold uppercase tracking-wider">Clearance Operation</h1>
      </div>

      {/* Main Form Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-300 mb-3 overflow-hidden">
        <div className="bg-slate-700 text-white px-4 py-2.5 text-center">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.5px]">Clearance Operation</h2>
        </div>
        <div className="p-4 space-y-4">
          {/* First Row - Operation Type, Transport Mode, Client Ref Name, Bayan No, Date, Yard Date */}
          <div className="grid grid-cols-6 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Operation Type</label>
              <div className="flex gap-3 items-center h-8">
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="operationType"
                    value="Export"
                    checked={formData.operationType === 'Export'}
                    onChange={(e) => handleFormChange('operationType', e.target.value)}
                    className="w-3.5 h-3.5 accent-blue-500"
                  />
                  Export
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="operationType"
                    value="Import"
                    checked={formData.operationType === 'Import'}
                    onChange={(e) => handleFormChange('operationType', e.target.value)}
                    className="w-3.5 h-3.5 accent-blue-500"
                  />
                  Import
                </label>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Transport Mode</label>
              <div className="flex gap-3 items-center h-8">
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="transportMode"
                    value="Land"
                    checked={formData.transportMode === 'Land'}
                    onChange={(e) => handleFormChange('transportMode', e.target.value)}
                    className="w-3.5 h-3.5 accent-blue-500"
                  />
                  Land
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="transportMode"
                    value="Air"
                    checked={formData.transportMode === 'Air'}
                    onChange={(e) => handleFormChange('transportMode', e.target.value)}
                    className="w-3.5 h-3.5 accent-blue-500"
                  />
                  Air
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="transportMode"
                    value="Sea"
                    checked={formData.transportMode === 'Sea'}
                    onChange={(e) => handleFormChange('transportMode', e.target.value)}
                    className="w-3.5 h-3.5 accent-blue-500"
                  />
                  Sea
                </label>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Client Ref Name</label>
              <input
                type="text"
                value={formData.clientRefName}
                onChange={(e) => handleFormChange('clientRefName', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Bayan No.</label>
              <input
                type="text"
                value={formData.bayanNo}
                onChange={(e) => handleFormChange('bayanNo', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleFormChange('date', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Yard Date</label>
              <input
                type="date"
                value={formData.yardDate}
                onChange={(e) => handleFormChange('yardDate', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Second Row - Client, Line, Line Agent, Bayan Date, Hijri Date, Status */}
          <div className="grid grid-cols-6 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Client *</label>
              <input
                type="text"
                placeholder="select name"
                value={formData.client}
                onChange={(e) => handleFormChange('client', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500 placeholder-slate-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Line</label>
              <input
                type="text"
                value={formData.line}
                onChange={(e) => handleFormChange('line', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Line Agent</label>
              <input
                type="text"
                value={formData.lineAgent}
                onChange={(e) => handleFormChange('lineAgent', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Bayan Date</label>
              <input
                type="date"
                value={formData.bayanDate}
                onChange={(e) => handleFormChange('bayanDate', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Hijri Date</label>
              <input
                type="text"
                placeholder="1446-12-5"
                value={formData.hijriDate}
                onChange={(e) => handleFormChange('hijriDate', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500 placeholder-slate-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Status</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Third Row - Job No, Vessel, Representative, Payment Date, End Date, Notes */}
          <div className="grid grid-cols-6 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Job No. *</label>
              <input
                type="text"
                value={formData.jobNo}
                onChange={(e) => handleFormChange('jobNo', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Vessel</label>
              <select
                value={formData.vessel}
                onChange={(e) => handleFormChange('vessel', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              >
                {vesselOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Representative</label>
              <input
                type="text"
                value={formData.representative}
                onChange={(e) => handleFormChange('representative', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Payment Date</label>
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => handleFormChange('paymentDate', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleFormChange('endDate', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Notes</label>
              <textarea
                rows="1"
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium min-h-8 max-h-20 resize-y focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Fourth Row - Commodity, Net Weight, Receiving Rep, Group, Release Date, BL */}
          <div className="grid grid-cols-6 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Commodity</label>
              <input
                type="text"
                value={formData.commodity}
                onChange={(e) => handleFormChange('commodity', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Net Weight</label>
              <div className="flex items-stretch">
                <input
                  type="number"
                  value={formData.netWeight}
                  onChange={(e) => handleFormChange('netWeight', e.target.value)}
                  className="flex-1 px-2 py-1.5 border-2 border-emerald-400 border-r-0 rounded-l text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
                />
                <span className="bg-slate-100 border-2 border-emerald-400 border-l-0 rounded-r px-2 py-1.5 text-[10px] font-bold text-slate-600 flex items-center justify-center min-w-8">
                  KG
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Receiving Rep</label>
              <input
                type="text"
                value={formData.receivingRep}
                onChange={(e) => handleFormChange('receivingRep', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Group</label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => handleFormChange('group', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Release Date</label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => handleFormChange('releaseDate', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">BL</label>
              <input
                type="text"
                value={formData.bl}
                onChange={(e) => handleFormChange('bl', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Fifth Row - No. of Packages, Gross Weight, POL, ETA, PO No */}
          <div className="grid grid-cols-6 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">No. Of packages</label>
              <input
                type="number"
                value={formData.noOfPackages}
                onChange={(e) => handleFormChange('noOfPackages', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Gross Weight</label>
              <div className="flex items-stretch">
                <input
                  type="number"
                  value={formData.grossWeight}
                  onChange={(e) => handleFormChange('grossWeight', e.target.value)}
                  className="flex-1 px-2 py-1.5 border-2 border-emerald-400 border-r-0 rounded-l text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
                />
                <span className="bg-slate-100 border-2 border-emerald-400 border-l-0 rounded-r px-2 py-1.5 text-[10px] font-bold text-slate-600 flex items-center justify-center min-w-8">
                  KG
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">POL</label>
              <select
                value={formData.pol}
                onChange={(e) => handleFormChange('pol', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              >
                {polOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">ETA</label>
              <input
                type="text"
                value={formData.eta}
                onChange={(e) => handleFormChange('eta', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">PO No.</label>
              <input
                type="text"
                value={formData.poNo}
                onChange={(e) => handleFormChange('poNo', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              {/* Empty space */}
            </div>
          </div>

          {/* Sixth Row - POD, Shipper */}
          <div className="grid grid-cols-6 gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">POD</label>
              <input
                type="text"
                value={formData.pod}
                onChange={(e) => handleFormChange('pod', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide mb-1">Shipper</label>
              <input
                type="text"
                value={formData.shipper}
                onChange={(e) => handleFormChange('shipper', e.target.value)}
                className="px-2 py-1.5 border-2 border-emerald-400 rounded text-xs bg-white text-slate-800 font-medium h-8 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="col-span-4">
              {/* Empty space spanning 4 columns */}
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-[1fr_2fr] gap-3 mb-3">
        {/* Containers Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden">
          <div className="bg-slate-700 text-white px-4 py-2.5 flex justify-between items-center">
            <span className="text-[13px] font-semibold uppercase tracking-[0.5px]">Containers</span>
            <button
              onClick={addContainer}
              className="bg-blue-500 text-white border-0 p-1 rounded cursor-pointer transition-all duration-200 w-6 h-6 flex items-center justify-center hover:bg-blue-600"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] bg-white">
              <thead>
                <tr>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300">QTY</th>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300">TYPE</th>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300"></th>
                </tr>
              </thead>
              <tbody>
                {containers.map((container) => (
                  <tr key={container.id} className="hover:bg-slate-50">
                    <td className="p-1 border-b border-slate-200">
                      <input
                        type="number"
                        value={container.qty}
                        onChange={(e) => updateContainer(container.id, 'qty', e.target.value)}
                        className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px] bg-white text-slate-800 h-6 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-1 border-b border-slate-200">
                      <select
                        value={container.type}
                        onChange={(e) => updateContainer(container.id, 'type', e.target.value)}
                        className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px] bg-white text-slate-800 h-6 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select</option>
                        {containerTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-1 border-b border-slate-200">
                      <button 
                        onClick={() => removeContainer(container.id)}
                        disabled={containers.length === 1}
                        className="bg-red-500 text-white border-0 p-0.5 rounded cursor-pointer transition-all duration-200 w-5 h-5 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bills Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden">
          <div className="bg-slate-700 text-white px-4 py-2.5 flex justify-between items-center">
            <span className="text-[13px] font-semibold uppercase tracking-[0.5px]">Bills</span>
            <button
              onClick={addBill}
              className="bg-blue-500 text-white border-0 p-1 rounded cursor-pointer transition-all duration-200 w-6 h-6 flex items-center justify-center hover:bg-blue-600"
            >
              <Plus size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px] bg-white">
              <thead>
                <tr>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300 whitespace-nowrap">Client Ref.</th>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300 whitespace-nowrap">DO Date</th>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300 whitespace-nowrap">DO No.</th>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300 whitespace-nowrap">Endorse No.</th>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300 whitespace-nowrap">Bill No.</th>
                  <th className="bg-slate-100 px-2.5 py-2 text-left font-bold text-slate-700 text-[9px] uppercase tracking-[0.8px] border-b-2 border-slate-300"></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50">
                    <td className="p-1 border-b border-slate-200">
                      <input
                        type="text"
                        value={bill.clientRef}
                        onChange={(e) => updateBill(bill.id, 'clientRef', e.target.value)}
                        className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px] bg-white text-slate-800 h-6 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-1 border-b border-slate-200">
                      <input
                        type="date"
                        value={bill.doDate}
                        onChange={(e) => updateBill(bill.id, 'doDate', e.target.value)}
                        className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px] bg-white text-slate-800 h-6 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-1 border-b border-slate-200">
                      <input
                        type="text"
                        value={bill.doNo}
                        onChange={(e) => updateBill(bill.id, 'doNo', e.target.value)}
                        className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px] bg-white text-slate-800 h-6 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-1 border-b border-slate-200">
                      <input
                        type="text"
                        value={bill.endorseNo}
                        onChange={(e) => updateBill(bill.id, 'endorseNo', e.target.value)}
                        className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px] bg-white text-slate-800 h-6 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-1 border-b border-slate-200">
                      <input
                        type="text"
                        value={bill.billNo}
                        onChange={(e) => updateBill(bill.id, 'billNo', e.target.value)}
                        className="w-full px-1.5 py-1 border border-slate-300 rounded text-[11px] bg-white text-slate-800 h-6 focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="p-1 border-b border-slate-200">
                      <button 
                        onClick={() => removeBill(bill.id)}
                        disabled={bills.length === 1}
                        className="bg-red-500 text-white border-0 p-0.5 rounded cursor-pointer transition-all duration-200 w-5 h-5 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3 mt-4">
        <button
          onClick={handleAddFiles}
          className="px-4 py-2 border-0 rounded text-xs font-bold cursor-pointer transition-all duration-200 flex items-center gap-1.5 uppercase tracking-[0.3px] bg-blue-500 text-white hover:bg-blue-600 hover:-translate-y-px hover:shadow-md"
        >
          <FileText size={14} />
          Add Files
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 border-0 rounded text-xs font-bold cursor-pointer transition-all duration-200 flex items-center gap-1.5 uppercase tracking-[0.3px] bg-emerald-500 text-white hover:bg-emerald-600 hover:-translate-y-px hover:shadow-md"
        >
          <Save size={14} />
          Save
        </button>
      </div>
    </div>
  );
};

export default ClearanceOperation;