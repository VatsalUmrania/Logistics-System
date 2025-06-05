import { useState } from 'react';
import { 
  Truck, FileText, FilePlus, FileEdit, FileSearch, 
  Plus, X, ChevronLeft, Settings, ClipboardList, 
  Package, DollarSign, CreditCard, List, User, 
  Clock, Box, Scale, Calendar, Phone, PenTool 
} from 'lucide-react';

const DeliveryNotePage = () => {
  const [activeMenu, setActiveMenu] = useState('delivery-note');
  const [deliveryNoteNo, setDeliveryNoteNo] = useState('');
  const [blNo, setBlNo] = useState('');
  const [shipper, setShipper] = useState('');
  const [personInCharge, setPersonInCharge] = useState('');
  const [notifyConsignee, setNotifyConsignee] = useState('');
  const [retNo, setRetNo] = useState('');
  const [defaults, setDefaults] = useState('');
  const [loadingPoint, setLoadingPoint] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureTime, setDepartureTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Delivery Note Submitted');
    // Form submission logic here
  };

  const menuItems = [
    { id: 'invoice', icon: <FileText size={18} />, label: 'Invoice' },
    { id: 'invoice-credit-trade', icon: <CreditCard size={18} />, label: 'Invoice CredTrade' },
    { id: 'credit-trade-search', icon: <FileSearch size={18} />, label: 'CredTrade Search' },
    { id: 'invoice-edit', icon: <FileEdit size={18} />, label: 'Invoice CredTrade Edit' },
    { id: 'job-changes', icon: <Settings size={18} />, label: 'Job Other Charges' },
    { id: 'receipt-cancellation', icon: <FileText size={18} />, label: 'Receipt Cancellation' },
    { id: 'delivery-note', icon: <Package size={18} />, label: 'Delivery Note' },
    { id: 'delivery-note-edit', icon: <FileEdit size={18} />, label: 'Delivery Note Edit' },
    { id: 'delivery-note-search', icon: <FileSearch size={18} />, label: 'Delivery Note Search' },
    { id: 'expense-pooling', icon: <List size={18} />, label: 'Expense Pooling' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Package className="w-8 h-8 mr-3 text-indigo-600" />
              DELIVERY NOTE
            </h1>
            <p className="text-gray-600 mt-2">Manage delivery notes for logistics operations</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Clearance Operation */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button className="mr-2 text-white">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-lg font-bold text-white">Add Clearance Operation</h2>
                </div>
              </div>
              <p className="text-indigo-200 text-sm mt-1 ml-7">Edit Clearance Operation</p>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Passion Expense</h3>
              </div>
              
              <ul className="space-y-2">
                {menuItems.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveMenu(item.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                        activeMenu === item.id 
                          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-indigo-600 mr-3">{item.icon}</span>
                      <span className="font-medium">#{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Add Delivery Note */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <FilePlus className="w-5 h-5 mr-2" />
                  Add Delivery Note
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="py-2 pr-4 font-medium text-gray-700">Delivery Note No.:</td>
                        <td className="py-2">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={deliveryNoteNo}
                            onChange={(e) => setDeliveryNoteNo(e.target.value)}
                          />
                        </td>
                        <td className="px-4 text-gray-400">:</td>
                        <td className="px-4 text-gray-400">:</td>
                        <td className="px-4 text-gray-400">:</td>
                      </tr>
                      
                      <tr>
                        <td className="py-2 pr-4 font-medium text-gray-700">BL No.:</td>
                        <td className="py-2" colSpan={4}>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={blNo}
                            onChange={(e) => setBlNo(e.target.value)}
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="py-2 pr-4 font-medium text-gray-700">Shipper / Loading Party:</td>
                        <td className="py-2" colSpan={4}>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={shipper}
                            onChange={(e) => setShipper(e.target.value)}
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="py-2 pr-4 font-medium text-gray-700">Person In Charge:</td>
                        <td className="py-2" colSpan={4}>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={personInCharge}
                            onChange={(e) => setPersonInCharge(e.target.value)}
                          />
                        </td>
                      </tr>
                      
                      <tr>
                        <td className="py-2 pr-4 font-medium text-gray-700">Notify/Consignee:</td>
                        <td className="py-2" colSpan={4}>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={notifyConsignee}
                            onChange={(e) => setNotifyConsignee(e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </div>

            {/* Ret No. Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-3 text-left font-medium text-gray-700">Ret No.:</th>
                      <th className="p-3 text-gray-400">:</th>
                      <th className="p-3 text-gray-400">:</th>
                      <th className="p-3 text-gray-400">:</th>
                      <th className="p-3 text-gray-400">:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-gray-200">
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={retNo}
                          onChange={(e) => setRetNo(e.target.value)}
                        />
                      </td>
                      <td className="p-3 border border-gray-200 text-gray-400">:</td>
                      <td className="p-3 border border-gray-200 text-gray-400">:</td>
                      <td className="p-3 border border-gray-200 text-gray-400">:</td>
                      <td className="p-3 border border-gray-200 text-gray-400">:</td>
                    </tr>
                    
                    <tr>
                      <td className="p-3 border border-gray-200 font-medium text-gray-700">Defaults</td>
                      <td className="p-3 border border-gray-200" colSpan={4}>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          value={defaults}
                          onChange={(e) => setDefaults(e.target.value)}
                        />
                      </td>
                    </tr>
                    
                    {[1, 2, 3].map((row) => (
                      <tr key={row}>
                        <td className="p-3 border border-gray-200 text-gray-400">:</td>
                        <td className="p-3 border border-gray-200 text-gray-400">:</td>
                        <td className="p-3 border border-gray-200 text-gray-400">:</td>
                        <td className="p-3 border border-gray-200 text-gray-400">:</td>
                        <td className="p-3 border border-gray-200 text-gray-400">:</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Record Options */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h2 className="text-lg font-bold text-white">Record Options</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Error:
                      </label>
                      <div className="flex space-x-4">
                        <button className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center">
                          <X className="w-5 h-5 mr-2" />
                          Error
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Actions:
                      </label>
                      <div className="flex space-x-4">
                        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center">
                          <Plus className="w-5 h-5 mr-2" />
                          Add
                        </button>
                        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center">
                          <Plus className="w-5 h-5 mr-2" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Goods Information */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                {/* Person in Charge Section */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                    Notify/Consignee:
                  </h2>
                  
                  <h3 className="text-md font-medium text-gray-700 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-indigo-500" />
                    Person in Charge:
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium mr-2">التحصي السؤال:</span>
                      <div className="flex-1 border-b-2 border-dashed border-gray-300 h-8"></div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium mr-2">نقطة العميل:</span>
                      <div className="flex-1 border-b-2 border-dashed border-gray-300 h-8"></div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-gray-700 font-medium mr-2">Loading Point :</span>
                      <input
                        type="text"
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        value={loadingPoint}
                        onChange={(e) => setLoadingPoint(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Goods Information Table */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-semibold text-gray-800 flex items-center">
                      <Box className="w-5 h-5 mr-2 text-indigo-600" />
                      Marks & Nos : Description of Goods
                    </h3>
                    
                    <h3 className="text-md font-semibold text-gray-800 flex items-center">
                      <Scale className="w-5 h-5 mr-2 text-indigo-600" />
                      Packages : Volume/Weight
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Marks & Nos</th>
                          <th className="border border-gray-300 p-2 text-left">Description of Goods</th>
                          <th className="border border-gray-300 p-2 text-left">رصد البضاعة</th>
                          <th className="border border-gray-300 p-2 text-left">Packages</th>
                          <th className="border border-gray-300 p-2 text-left">رسم</th>
                          <th className="border border-gray-300 p-2 text-left">Volume/Weight</th>
                          <th className="border border-gray-300 p-2 text-left">رسم</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2">Party</td>
                          <td className="border border-gray-300 p-2">حل</td>
                          <td className="border border-gray-300 p-2">Shipper</td>
                          <td className="border border-gray-300 p-2">أغنى</td>
                          <td className="border border-gray-300 p-2">Consignee</td>
                          <td className="border border-gray-300 p-2">الترجيل فيه</td>
                          <td className="border border-gray-300 p-2">Driver</td>
                        </tr>
                        
                        <tr>
                          <td className="border border-gray-300 p-2">Name</td>
                          <td className="border border-gray-300 p-2">اسم</td>
                          <td className="border border-gray-300 p-2" colSpan="5">
                            <input
                              type="text"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter name"
                            />
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="border border-gray-300 p-2">Mobile No.</td>
                          <td className="border border-gray-300 p-2">رمز الصوت</td>
                          <td className="border border-gray-300 p-2" colSpan="5">
                            <input
                              type="text"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter mobile number"
                            />
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="border border-gray-300 p-2">Signature</td>
                          <td className="border border-gray-300 p-2">التوقيع</td>
                          <td className="border border-gray-300 p-2" colSpan="5">
                            <div className="flex items-center justify-center h-12 border border-dashed border-gray-400 rounded-lg">
                              <PenTool className="w-5 h-5 text-gray-400" />
                              <span className="ml-2 text-gray-500">Signature Area</span>
                            </div>
                          </td>
                        </tr>
                        
                        <tr>
                          <td className="border border-gray-300 p-2">Arrival Time</td>
                          <td className="border border-gray-300 p-2">وقد الوصول</td>
                          <td className="border border-gray-300 p-2" colSpan="2">
                            <input
                              type="time"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              value={arrivalTime}
                              onChange={(e) => setArrivalTime(e.target.value)}
                            />
                          </td>
                          <td className="border border-gray-300 p-2">Departure Time</td>
                          <td className="border border-gray-300 p-2">وقد الماندوء</td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="time"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              value={departureTime}
                              onChange={(e) => setDepartureTime(e.target.value)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center">
                    <FilePlus className="w-5 h-5 mr-2" />
                    Save Delivery Note
                  </button>
                  <button className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center">
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryNotePage;