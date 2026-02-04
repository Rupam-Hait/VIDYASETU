import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, DollarSign, Calendar, Plus, Save, Wallet, IndianRupee, X, Smartphone, Landmark, Briefcase, TrendingUp } from 'lucide-react';
import { User, UserRole } from '../types';

export const Fees: React.FC<{ user: User }> = ({ user }) => {
  // Mock State for Student Fees (12 Months)
  const [fees, setFees] = useState([
    { id: 1, month: 'January 2024', amount: 3500, status: 'PAID', date: '2024-01-10', invoice: 'INV-001' },
    { id: 2, month: 'February 2024', amount: 3500, status: 'PAID', date: '2024-02-11', invoice: 'INV-002' },
    { id: 3, month: 'March 2024', amount: 3500, status: 'PAID', date: '2024-03-10', invoice: 'INV-003' },
    { id: 4, month: 'April 2024', amount: 3500, status: 'PAID', date: '2024-04-12', invoice: 'INV-004' },
    { id: 5, month: 'May 2024', amount: 3500, status: 'PAID', date: '2024-05-10', invoice: 'INV-005' },
    { id: 6, month: 'June 2024', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
    { id: 7, month: 'July 2024', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
    { id: 8, month: 'August 2024', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
    { id: 9, month: 'September 2024', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
    { id: 10, month: 'October 2024', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
    { id: 11, month: 'November 2024', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
    { id: 12, month: 'December 2024', amount: 3500, status: 'PENDING', date: '-', invoice: '-' },
  ]);

  // Mock State for Teacher Salary (12 Months)
  const [salaries] = useState([
    { id: 1, month: 'January 2024', amount: 45000, status: 'CREDITED', date: '2024-01-31', ref: 'SAL-001' },
    { id: 2, month: 'February 2024', amount: 45000, status: 'CREDITED', date: '2024-02-29', ref: 'SAL-002' },
    { id: 3, month: 'March 2024', amount: 45000, status: 'CREDITED', date: '2024-03-31', ref: 'SAL-003' },
    { id: 4, month: 'April 2024', amount: 45000, status: 'CREDITED', date: '2024-04-30', ref: 'SAL-004' },
    { id: 5, month: 'May 2024', amount: 45000, status: 'CREDITED', date: '2024-05-31', ref: 'SAL-005' },
    { id: 6, month: 'June 2024', amount: 45000, status: 'SCHEDULED', date: '-', ref: '-' },
    { id: 7, month: 'July 2024', amount: 45000, status: 'SCHEDULED', date: '-', ref: '-' },
    { id: 8, month: 'August 2024', amount: 45000, status: 'SCHEDULED', date: '-', ref: '-' },
    { id: 9, month: 'September 2024', amount: 45000, status: 'SCHEDULED', date: '-', ref: '-' },
    { id: 10, month: 'October 2024', amount: 45000, status: 'SCHEDULED', date: '-', ref: '-' },
    { id: 11, month: 'November 2024', amount: 45000, status: 'SCHEDULED', date: '-', ref: '-' },
    { id: 12, month: 'December 2024', amount: 45000, status: 'SCHEDULED', date: '-', ref: '-' },
  ]);

  // Mock State for Admin
  const [classFee, setClassFee] = useState({ class: '10-A', amount: 3500 });
  const [successMsg, setSuccessMsg] = useState('');

  // Payment Modal State
  const [selectedFeeId, setSelectedFeeId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'UPI'>('CARD');
  const [processing, setProcessing] = useState(false);

  const initiatePayment = (id: number) => {
    setSelectedFeeId(id);
    setPaymentMethod('CARD');
  };

  const processPayment = () => {
    setProcessing(true);
    // Simulate Payment Gateway delay
    setTimeout(() => {
        if (selectedFeeId) {
             setFees(prev => prev.map(f => f.id === selectedFeeId ? { ...f, status: 'PAID', date: new Date().toLocaleDateString(), invoice: `INV-00${4 + Math.floor(Math.random() * 100)}` } : f));
        }
        setProcessing(false);
        setSelectedFeeId(null);
        alert("Payment Successful! Receipt generated.");
    }, 2000);
  };

  const handleGooglePay = () => {
    const fee = fees.find(f => f.id === selectedFeeId);
    if (fee) {
        const params = new URLSearchParams({
            pa: 'vidyasetu@sbi',
            pn: 'VidyaSetu School',
            am: fee.amount.toString(),
            cu: 'INR',
            tn: `Fee Payment ${fee.month}`
        });
        
        const upiUrl = `upi://pay?${params.toString()}`;
        const link = document.createElement('a');
        link.href = upiUrl;
        link.target = '_blank'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setProcessing(true);
        setTimeout(() => {
             if (selectedFeeId) {
                 setFees(prev => prev.map(f => f.id === selectedFeeId ? { ...f, status: 'PAID', date: new Date().toLocaleDateString(), invoice: `INV-GP-${Math.floor(Math.random() * 1000)}` } : f));
            }
            setProcessing(false);
            setSelectedFeeId(null);
            alert("Payment Verified via UPI");
        }, 5000);
    }
  };

  // --- ADMIN VIEW ---
  if (user.role === UserRole.ADMIN) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Wallet className="text-cyan-400" /> Fee Administration
        </h2>

        <div className="glass-panel p-8 rounded-2xl mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Set Monthly Fees</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-slate-400 mb-2 text-sm">Select Class</label>
              <select 
                value={classFee.class}
                onChange={(e) => setClassFee({...classFee, class: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:border-cyan-500 outline-none"
              >
                <option value="10-A">Class 10-A</option>
                <option value="10-B">Class 10-B</option>
                <option value="11-A">Class 11-A</option>
                <option value="12-A">Class 12-A</option>
              </select>
            </div>
            
            <div>
              <label className="block text-slate-400 mb-2 text-sm">Monthly Fee Amount (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                <input 
                  type="number"
                  value={classFee.amount}
                  onChange={(e) => setClassFee({...classFee, amount: Number(e.target.value)})}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-10 pr-4 py-3 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              setSuccessMsg(`Fee structure updated for ${classFee.class}`);
              setTimeout(() => setSuccessMsg(''), 3000);
            }}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition"
          >
            <Save className="w-5 h-5" /> Update Structure
          </button>
          
          {successMsg && (
            <div className="mt-4 p-3 bg-green-500/20 text-green-300 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> {successMsg}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Total Collections (This Month)</p>
            <p className="text-3xl font-bold text-white mt-2">₹4,50,000</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Pending Dues</p>
            <p className="text-3xl font-bold text-orange-400 mt-2">₹1,25,000</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <p className="text-slate-400 text-sm">Defaulters</p>
            <p className="text-3xl font-bold text-red-400 mt-2">8 Students</p>
          </div>
        </div>
      </div>
    );
  }

  // --- TEACHER VIEW (Salary) ---
  if (user.role === UserRole.TEACHER) {
    const totalReceived = salaries.filter(s => s.status === 'CREDITED').reduce((acc, curr) => acc + curr.amount, 0);
    const totalPending = salaries.filter(s => s.status === 'SCHEDULED').reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Briefcase className="text-cyan-400 w-8 h-8" /> Salary & Compensation
            </h2>
            <p className="text-slate-400 mt-1">Track your monthly payouts and annual package.</p>
          </div>
          <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700">
             <p className="text-xs text-slate-400">Annual Package</p>
             <p className="text-lg font-bold text-white">₹{(totalReceived + totalPending).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-panel p-6 rounded-2xl border-l-4 border-green-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                    <TrendingUp className="w-24 h-24 text-green-500" />
                </div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wide mb-2">Total Salary Received</h3>
                <p className="text-4xl font-bold text-white">₹{totalReceived.toLocaleString('en-IN')}</p>
                <div className="mt-4 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4" /> Paid till May 2024
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-l-4 border-slate-500 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                    <Calendar className="w-24 h-24 text-slate-500" />
                </div>
                <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wide mb-2">Salary Remaining (Yearly)</h3>
                <p className="text-4xl font-bold text-white">₹{totalPending.toLocaleString('en-IN')}</p>
                <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm">
                    <Briefcase className="w-4 h-4" /> To be credited monthly
                </div>
            </div>
        </div>

        {/* Salary List */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="p-4 bg-slate-800/50 border-b border-slate-700">
             <h3 className="font-bold text-white">Payroll History 2024</h3>
          </div>
          <div className="grid grid-cols-4 bg-slate-800/30 p-4 text-slate-400 text-sm font-semibold border-b border-slate-700/50">
            <div className="col-span-1">Month</div>
            <div>Amount</div>
            <div>Status</div>
            <div className="text-right">Ref ID / Date</div>
          </div>
          <div className="divide-y divide-slate-700/50 max-h-[500px] overflow-y-auto">
             {salaries.map((sal) => (
                 <div key={sal.id} className="grid grid-cols-4 p-4 items-center hover:bg-slate-800/30 transition">
                    <div className="col-span-1 font-medium text-white">{sal.month}</div>
                    <div className="text-slate-200 font-mono">₹{sal.amount.toLocaleString('en-IN')}</div>
                    <div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            sal.status === 'CREDITED' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-slate-700/50 text-slate-400'
                        }`}>
                            {sal.status === 'CREDITED' ? <CheckCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                            {sal.status}
                        </span>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                        {sal.status === 'CREDITED' ? (
                            <>
                                <p className="text-cyan-400">{sal.ref}</p>
                                <p>{sal.date}</p>
                            </>
                        ) : (
                            <span>Scheduled</span>
                        )}
                    </div>
                 </div>
             ))}
          </div>
        </div>
      </div>
    );
  }

  // --- STUDENT VIEW ---
  if (user.role === UserRole.STUDENT) {
    const totalPending = fees.filter(f => f.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div className="p-6 max-w-5xl mx-auto animate-fadeIn relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <CreditCard className="text-cyan-400 w-8 h-8" /> Fees & Payments
            </h2>
            <p className="text-slate-400 mt-1">Manage your tuition and school fees securely.</p>
          </div>
          
          {totalPending > 0 ? (
             <div className="bg-orange-500/10 border border-orange-500/50 px-6 py-4 rounded-2xl flex items-center gap-4">
                <div>
                   <p className="text-orange-300 text-xs font-bold uppercase tracking-wider">Total Due</p>
                   <p className="text-2xl font-bold text-white">₹{totalPending.toLocaleString('en-IN')}</p>
                </div>
                <button 
                  onClick={() => {
                      const firstPending = fees.find(f => f.status === 'PENDING');
                      if(firstPending) initiatePayment(firstPending.id);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm"
                >
                  Pay Next Due
                </button>
             </div>
          ) : (
             <div className="bg-green-500/10 border border-green-500/50 px-6 py-4 rounded-2xl flex items-center gap-3">
                <CheckCircle className="text-green-400 w-8 h-8" />
                <div>
                   <p className="text-green-300 text-xs font-bold uppercase tracking-wider">Status</p>
                   <p className="text-xl font-bold text-white">All Clear</p>
                </div>
             </div>
          )}
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="grid grid-cols-5 bg-slate-800/50 p-4 text-slate-400 text-sm font-semibold border-b border-slate-700">
            <div className="col-span-2">Month / Description</div>
            <div>Amount</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>
          
          <div className="divide-y divide-slate-700/50 max-h-[600px] overflow-y-auto">
            {fees.map((fee) => (
              <div key={fee.id} className="grid grid-cols-5 p-4 items-center hover:bg-slate-800/30 transition">
                <div className="col-span-2">
                  <p className="text-white font-medium">{fee.month}</p>
                  <p className="text-xs text-slate-500">Invoice: {fee.invoice}</p>
                </div>
                <div className="text-slate-200 font-mono">
                  ₹{fee.amount.toLocaleString('en-IN')}
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    fee.status === 'PAID' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {fee.status === 'PAID' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {fee.status}
                  </span>
                  {fee.status === 'PAID' && <p className="text-[10px] text-slate-500 mt-1">Paid on {fee.date}</p>}
                </div>
                <div className="text-right">
                  {fee.status === 'PENDING' ? (
                    <button 
                      onClick={() => initiatePayment(fee.id)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg shadow-cyan-500/20"
                    >
                      Pay Now
                    </button>
                  ) : (
                    <button className="text-slate-500 hover:text-white text-sm transition">
                      Download Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {selectedFeeId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-3xl max-w-md w-full relative shadow-2xl">
                <button 
                onClick={() => setSelectedFeeId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
                >
                <X className="w-6 h-6" />
                </button>
                
                <h3 className="text-xl font-bold text-white mb-1">Complete Payment</h3>
                <p className="text-slate-400 text-sm mb-6">Secure Gateway</p>

                {/* Amount Display */}
                <div className="bg-slate-800 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-700">
                    <span className="text-slate-400">Total Amount</span>
                    <span className="text-2xl font-bold text-white">₹{fees.find(f => f.id === selectedFeeId)?.amount.toLocaleString('en-IN')}</span>
                </div>

                {/* Method Tabs */}
                <div className="flex p-1 bg-slate-800 rounded-xl mb-6 border border-slate-700">
                    <button 
                        onClick={() => setPaymentMethod('CARD')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${paymentMethod === 'CARD' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <CreditCard className="w-4 h-4" /> Card
                    </button>
                    <button 
                        onClick={() => setPaymentMethod('UPI')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${paymentMethod === 'UPI' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Smartphone className="w-4 h-4" /> UPI / GPay
                    </button>
                </div>

                {/* Form Fields */}
                <div className="min-h-[220px]">
                    {paymentMethod === 'CARD' && (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-cyan-500 outline-none font-mono text-sm" />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none font-mono text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">CVV</label>
                                    <input type="password" placeholder="123" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none font-mono text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Card Holder Name</label>
                                <input type="text" placeholder="John Doe" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500 outline-none text-sm" />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'UPI' && (
                        <div className="space-y-4 animate-fadeIn">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Enter UPI ID</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
                                    <input type="text" placeholder="username@oksbi" className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-cyan-500 outline-none text-sm" />
                                </div>
                            </div>
                            
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-700"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-2 bg-slate-900 text-slate-500 font-bold">FAST CHECKOUT</span>
                                </div>
                            </div>

                            <button onClick={handleGooglePay} className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition shadow-lg">
                                <span className="text-xl font-bold tracking-tighter"><span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span> Pay</span>
                            </button>
                            <button onClick={processPayment} className="w-full bg-[#5f259f] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#4b1d7e] transition shadow-lg">
                                PhonePe
                            </button>
                        </div>
                    )}
                </div>

                <button 
                    onClick={processPayment}
                    disabled={processing}
                    className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        </>
                    ) : (
                        <>Pay Securely <div className="w-px h-4 bg-white/20 mx-1"></div> ₹{fees.find(f => f.id === selectedFeeId)?.amount.toLocaleString('en-IN')}</>
                    )}
                </button>

                <p className="text-center text-[10px] text-slate-500 mt-4 flex items-center justify-center gap-1">
                    <Landmark className="w-3 h-3" /> Payments processed via 256-bit secured gateway
                </p>

            </div>
            </div>
        )}
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <CreditCard className="w-8 h-8 opacity-50" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Access Restricted</h3>
      <p>This module is not available for your user role.</p>
    </div>
  );
};