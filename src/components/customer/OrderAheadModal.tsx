import { useState } from 'react';
import { X } from 'lucide-react';
import { MOCK_MENU } from '../../data/mockMenu';
import { MenuItem, OrderItem } from '../../types/cafe';
import { useCafe } from '../../store/cafeStore';

interface OrderAheadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderAheadModal: React.FC<OrderAheadModalProps> = ({ isOpen, onClose }) => {
  const { addNewOrder } = useCafe();
  const [selectedItem, setSelectedItem] = useState<MenuItem>(MOCK_MENU[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [milk, setMilk] = useState<'Whole' | 'Oat' | 'Almond' | 'None'>('Oat');
  const [customerName, setCustomerName] = useState<string>('Alex');

  if (!isOpen) return null;

  const handlePlaceOrder = () => {
    const orderItems: OrderItem[] = [
      {
        menuItem: selectedItem,
        quantity,
        customizations: {
          milk,
          hot: true
        }
      }
    ];

    addNewOrder(customerName, orderItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-stone-200 animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-lg text-stone-900">New Coffee Order</h3>
            <p className="text-xs text-stone-500">Add an order to watch the dynamic queue update</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name input */}
        <div className="my-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="w-full text-sm font-medium border border-stone-200 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Your name"
          />
        </div>

        {/* Menu item choices */}
        <div className="my-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Select Drink / Item
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {MOCK_MENU.map(item => {
              const isSelected = selectedItem.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-300'
                      : 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-stone-900">{item.name}</div>
                    <div className="text-[11px] text-stone-500 line-clamp-1">{item.description}</div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <span className="font-bold font-mono text-xs text-stone-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-amber-700 font-medium">
                      ~{Math.round(item.basePrepTimeSec / 60)}m prep
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milk selection if coffee */}
        {selectedItem.category === 'coffee' && (
          <div className="my-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Milk Choice
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(['Oat', 'Whole', 'Almond', 'None'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMilk(m)}
                  className={`py-1.5 rounded-xl border font-medium transition-all ${
                    milk === m
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-amber-600/30 hover:from-amber-700 hover:to-amber-800 transition-all flex items-center justify-center space-x-2 text-sm"
        >
          <span>Confirm & Join Queue</span>
          <span className="font-mono text-xs opacity-90">(${(selectedItem.price * quantity).toFixed(2)})</span>
        </button>
      </div>
    </div>
  );
};
