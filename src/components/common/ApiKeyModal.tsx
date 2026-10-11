import React, { useState } from 'react';
import { X, Sparkles, Key, Check, ShieldCheck } from 'lucide-react';
import { getStoredApiKey, saveStoredApiKey } from '../../services/gemini';
import { useCafe } from '../../store/cafeStore';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState<string>(getStoredApiKey());
  const [saved, setSaved] = useState<boolean>(false);
  const { refreshAiReasoning } = useCafe();

  if (!isOpen) return null;

  const handleSave = () => {
    saveStoredApiKey(key.trim());
    setSaved(true);
    refreshAiReasoning();
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-stone-900">Gemini AI Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-stone-100 text-stone-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-3">
          <p className="text-xs text-stone-600 leading-relaxed">
            By default, <strong>Café Companion</strong> uses an embedded high-fidelity queue reasoning engine. Enter your Google Gemini API key to run live real-time model inferences!
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
              Google Gemini API Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs font-mono border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              Stored securely in your browser's local storage.
            </p>
          </div>

          <div className="bg-blue-50/80 rounded-xl p-3 border border-blue-200/70 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span className="text-[11px] text-blue-900">
              Works without a key too! The app will gracefully fall back to our deterministic queue simulation.
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Saved!</span>
            </>
          ) : (
            <span>Save & Apply</span>
          )}
        </button>
      </div>
    </div>
  );
};
