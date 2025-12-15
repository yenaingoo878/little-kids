import React, { useRef, useState } from 'react';
import { Camera, Loader2, Tag, X } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface AddMemoryProps {
  newMemory: any;
  setNewMemory: (v: any) => void;
  editingId?: string | null;
  isSaving: boolean;
  onSave: () => void;
  onCancel?: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatDateDisplay: (date: string) => string;
  language: Language;
}

export const AddMemory: React.FC<AddMemoryProps> = ({
  newMemory,
  setNewMemory,
  editingId,
  isSaving,
  onSave,
  onCancel,
  handleImageUpload,
  formatDateDisplay,
  language,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState('');
  const [dateInputType, setDateInputType] = useState<'text' | 'date'>('text');

  // ✅ correct translation function
  const t = (key: string) => getTranslation(language, key);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (newMemory.tags.includes(tagInput.trim())) return;
    setNewMemory({ ...newMemory, tags: [...newMemory.tags, tagInput.trim()] });
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setNewMemory({ ...newMemory, tags: newMemory.tags.filter((t: string) => t !== tag) });
  };

  return (
    <div className="pb-32 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {editingId ? t('edit_memory_title') : t('add_memory_title')}
        </h2>
        {editingId && onCancel && (
          <button onClick={onCancel} className="text-sm text-slate-500 dark:text-slate-300">
            {t('cancel_btn')}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border">
        <div
          onClick={triggerFileInput}
          className="relative w-full h-48 md:h-64 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border-2 border-dashed mb-6 cursor-pointer overflow-hidden"
        >
          {newMemory.imageUrl ? (
            <img src={newMemory.imageUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Camera className="w-6 h-6 text-slate-400" />
              <p className="mt-2 text-sm text-slate-400">{t('choose_photo')}</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              value={newMemory.title}
              onChange={e => setNewMemory({ ...newMemory, title: e.target.value })}
              placeholder={t('form_title_placeholder')}
              className="px-4 py-3 rounded-xl border"
            />
            <input
              type={dateInputType}
              value={dateInputType === 'date' ? newMemory.date : formatDateDisplay(newMemory.date)}
              onFocus={() => setDateInputType('date')}
              onBlur={() => setDateInputType('text')}
              onChange={e => setNewMemory({ ...newMemory, date: e.target.value })}
              className="px-4 py-3 rounded-xl border"
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {newMemory.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-200">
                  <Tag className="w-3 h-3 mr-1" />{tag}
                  <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddTag()}
                placeholder={t('add_tag_placeholder')}
                className="flex-1 px-4 py-3 rounded-xl border"
              />
              <button onClick={handleAddTag} className="px-4 rounded-xl bg-slate-200">
                {t('add')}
              </button>
            </div>
          </div>

          <textarea
            value={newMemory.desc}
            onChange={e => setNewMemory({ ...newMemory, desc: e.target.value })}
            placeholder={t('form_desc_placeholder')}
            className="h-32 px-4 py-3 rounded-xl border"
          />

          <button
            onClick={onSave}
            disabled={isSaving}
            className="w-full bg-primary text-white py-4 rounded-xl flex justify-center"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : editingId ? t('update_btn') : t('record_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
// import React, { useRef, useState } from 'react';
// import { Camera, Loader2, Tag, X, Sparkles, ImagePlus } from 'lucide-react';
// import { Language } from '../types';
// import { getTranslation } from '../translations';

// interface AddMemoryProps {
//   newMemory: any;
//   setNewMemory: (v: any) => void;
//   editingId?: string | null;
//   isSaving: boolean;
//   onSave: () => void;
//   onCancel?: () => void;
//   handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   formatDateDisplay: (date: string) => string;
//   language: Language;
// }

// export const AddMemory: React.FC<AddMemoryProps> = ({
//   newMemory,
//   setNewMemory,
//   editingId,
//   isSaving,
//   onSave,
//   onCancel,
//   handleImageUpload,
//   formatDateDisplay,
//   language,
// }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [tagInput, setTagInput] = useState('');
//   const [dateInputType, setDateInputType] = useState<'text' | 'date'>('text');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const t = (key: string) => getTranslation(language, key);

//   const triggerFileInput = () => fileInputRef.current?.click();

//   const handleAddTag = () => {
//     if (!tagInput.trim()) return;
//     if (newMemory.tags.includes(tagInput.trim())) return;
//     setNewMemory({ ...newMemory, tags: [...newMemory.tags, tagInput.trim()] });
//     setTagInput('');
//   };

//   const handleRemoveTag = (tag: string) => {
//     setNewMemory({ ...newMemory, tags: newMemory.tags.filter((t: string) => t !== tag) });
//   };

//   const handleAIAnalyze = async () => {
//     if (!newMemory.imageUrl) return;
//     setIsAnalyzing(true);
//     try {
//       const result = await analyzeImage(newMemory.imageUrl);
//       setNewMemory((prev: any) => ({
//         ...prev,
//         title: result.title || prev.title,
//         desc: result.desc || prev.desc,
//         tags: [...new Set([...prev.tags, ...result.tags])]
//       }));
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };

//   return (
//     <div className="pb-32 animate-slide-up max-w-2xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
//           {editingId ? t('edit_memory_title') : t('add_memory_title')}
//         </h2>
//         {editingId && onCancel && (
//           <button onClick={onCancel} className="text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
//             {t('cancel_btn')}
//           </button>
//         )}
//       </div>

//       <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
//         <div
//           onClick={triggerFileInput}
//           className={`group relative w-full h-56 md:h-72 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border-2 border-dashed ${newMemory.imageUrl ? 'border-transparent' : 'border-slate-300 dark:border-slate-600'} hover:border-primary dark:hover:border-primary transition-all cursor-pointer overflow-hidden mb-6`}
//         >
//           {newMemory.imageUrl ? (
//             <>
//               <img src={newMemory.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Memory" />
//               <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                 <p className="text-white font-medium flex items-center gap-2">
//                   <ImagePlus className="w-5 h-5" /> Change Photo
//                 </p>
//               </div>
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full text-slate-400 group-hover:text-primary transition-colors">
//               <Camera className="w-10 h-10 mb-3" />
//               <p className="text-sm font-medium">{t('choose_photo')}</p>
//             </div>
//           )}
//           <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//         </div>

//         {newMemory.imageUrl && (
//           <div className="flex justify-end mb-6">
//             <button
//               onClick={handleAIAnalyze}
//               disabled={isAnalyzing}
//               className="flex items-center gap-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70"
//             >
//               {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
//               {t('ai_analyze_btn')}
//             </button>
//           </div>
//         )}

//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <div className="space-y-1">
//               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Title</label>
//               <input
//                 value={newMemory.title}
//                 onChange={e => setNewMemory({ ...newMemory, title: e.target.value })}
//                 placeholder={t('form_title_placeholder')}
//                 className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Date</label>
//               <input
//                 type={dateInputType}
//                 value={dateInputType === 'date' ? newMemory.date : formatDateDisplay(newMemory.date)}
//                 onFocus={() => setDateInputType('date')}
//                 onBlur={() => setDateInputType('text')}
//                 onChange={e => setNewMemory({ ...newMemory, date: e.target.value })}
//                 className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
//               />
//             </div>
//           </div>

//           <div className="space-y-1">
//              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Tags</label>
//             <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
//               {newMemory.tags.map((tag: string) => (
//                 <span key={tag} className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-indigo-800">
//                   <Tag className="w-3 h-3 mr-1.5 opacity-70" />{tag}
//                   <button className="ml-2 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5 transition-colors" onClick={() => handleRemoveTag(tag)}>
//                      <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               ))}
//             </div>
//             <div className="flex gap-2">
//               <input
//                 value={tagInput}
//                 onChange={e => setTagInput(e.target.value)}
//                 onKeyDown={e => e.key === 'Enter' && handleAddTag()}
//                 placeholder={t('add_tag_placeholder')}
//                 className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
//               />
//               <button onClick={handleAddTag} className="px-6 rounded-xl bg-slate-100 dark:bg-slate-700 font-medium text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
//                 {t('add')}
//               </button>
//             </div>
//           </div>

//           <div className="space-y-1">
//              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Description</label>
//             <textarea
//               value={newMemory.desc}
//               onChange={e => setNewMemory({ ...newMemory, desc: e.target.value })}
//               placeholder={t('form_desc_placeholder')}
//               className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none dark:text-white"
//             />
//           </div>

//           <button
//             onClick={onSave}
//             disabled={isSaving}
//             className="w-full bg-primary hover:bg-indigo-600 text-white py-4 rounded-xl flex justify-center items-center gap-2 font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
//           >
//             {isSaving ? <Loader2 className="animate-spin" /> : editingId ? t('update_btn') : t('record_btn')}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };