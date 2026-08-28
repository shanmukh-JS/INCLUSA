'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Globe,
  Type,
  Volume2,
  Video,
  Sparkles,
  ArrowRight,
  AlertCircle,
  ImageIcon,
  X,
} from 'lucide-react';
import { DocumentInputType } from '@/types';
import { SAMPLE_DOCUMENTS } from '@/lib/mock/sample-documents';

interface MultimodalDropzoneProps {
  onStartAnalysis: (data: {
    inputType: DocumentInputType;
    title: string;
    fileName?: string;
    rawText: string;
    fileDataUrl?: string;
    url?: string;
    fileSizeBytes?: number;
  }) => void;
  isProcessing: boolean;
}

export const MultimodalDropzone: React.FC<MultimodalDropzoneProps> = ({
  onStartAnalysis,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'paste'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 25 * 1024 * 1024) {
        setErrorMsg('File exceeds 25MB limit. Please choose a smaller file.');
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        setFilePreviewUrl(preview);
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };

  const handleFileSubmit = () => {
    if (!selectedFile) {
      setErrorMsg('Please select a file to upload.');
      return;
    }

    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    let inputType: DocumentInputType = 'pdf';
    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'].includes(ext)) inputType = 'image';
    else if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) inputType = 'audio';
    else if (['mp4', 'mov', 'webm'].includes(ext)) inputType = 'video';
    else if (['doc', 'docx'].includes(ext)) inputType = 'docx';
    else if (['txt', 'md', 'json', 'csv'].includes(ext)) inputType = 'txt';

    const reader = new FileReader();

    if (inputType === 'txt' || ext === 'md' || ext === 'json' || ext === 'csv') {
      reader.onload = (event) => {
        const content = (event.target?.result as string) || '';
        onStartAnalysis({
          inputType,
          title: selectedFile.name.replace(/\.[^/.]+$/, ''),
          fileName: selectedFile.name,
          rawText: content,
          fileSizeBytes: selectedFile.size,
        });
      };
      reader.readAsText(selectedFile);
    } else {
      reader.onload = (event) => {
        const dataUrl = (event.target?.result as string) || '';
        onStartAnalysis({
          inputType,
          title: selectedFile.name.replace(/\.[^/.]+$/, ''),
          fileName: selectedFile.name,
          fileDataUrl: dataUrl,
          rawText: '', // Will be dynamically parsed by Multimodal Vision & Dual AI Engine
          fileSizeBytes: selectedFile.size,
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput || !urlInput.startsWith('http')) {
      setErrorMsg('Please enter a valid URL beginning with http:// or https://');
      return;
    }
    setErrorMsg(null);
    onStartAnalysis({
      inputType: 'url',
      title: `Web Audit: ${urlInput.replace(/^https?:\/\//, '')}`,
      url: urlInput,
      rawText: `# Website Accessibility Scan: ${urlInput}\n\nEvaluated HTML structure, form elements, image alt tags, color contrast ratios, and screen-reader landmarks.`,
    });
  };

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) {
      setErrorMsg('Please paste some text content to analyze.');
      return;
    }
    setErrorMsg(null);
    onStartAnalysis({
      inputType: 'text',
      title: pasteTitle.trim() || 'Pasted Document Content',
      rawText: pasteText,
      fileSizeBytes: pasteText.length,
    });
  };

  const handleSampleClick = (sampleId: string) => {
    const sample = SAMPLE_DOCUMENTS.find((s: any) => s.id === sampleId);
    if (sample) {
      onStartAnalysis({
        inputType: sample.inputType,
        title: sample.title,
        fileName: sample.fileName,
        rawText: sample.rawText,
        fileSizeBytes: sample.rawText.length,
      });
    }
  };

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_#192138]">
      {/* Input Tabs */}
      <div className="flex border-b-2 border-[var(--border-strong)] pb-4 mb-6">
        <div className="flex p-1 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-strong)] w-full sm:w-auto gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-[var(--text-primary)] border border-[var(--border-strong)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('url');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'url'
                ? 'bg-white text-[var(--text-primary)] border border-[var(--border-strong)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Website URL</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('paste');
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'paste'
                ? 'bg-white text-[var(--text-primary)] border border-[var(--border-strong)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Type className="h-4 w-4" />
            <span>Paste Text</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 flex items-center gap-3 text-xs font-bold text-rose-900">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TAB 1: File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-5">
          <label
            htmlFor="file-upload-input"
            className="flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl border-3 border-dashed border-[var(--border-color)] hover:border-[var(--border-strong)] bg-[var(--bg-primary)] hover:bg-amber-50/50 cursor-pointer transition-all duration-200 text-center group relative overflow-hidden"
          >
            {filePreviewUrl ? (
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] max-h-40 max-w-full">
                  <img
                    src={filePreviewUrl}
                    alt="Upload Preview"
                    className="max-h-36 object-contain bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="text-xs font-black text-[#059669] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                  {selectedFile?.name} ({((selectedFile?.size || 0) / 1024).toFixed(1)} KB)
                </span>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-white text-emerald-700 border-2 border-[var(--border-strong)] shadow-[3px_3px_0_0_#192138] group-hover:scale-105 transition-transform mb-3">
                  <UploadCloud className="h-8 w-8" />
                </div>

                <div className="text-sm font-black text-[var(--text-primary)]">
                  {selectedFile ? (
                    <span className="text-[#059669] font-black">{selectedFile.name}</span>
                  ) : (
                    'Choose file or drag & drop here'
                  )}
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-medium mt-1.5 max-w-sm">
                  Supports Images (PNG, JPG, WebP), PDFs, DOCX, TXT, Audio & Video
                </p>
              </>
            )}

            <input
              id="file-upload-input"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.docx,.doc,.txt,.md,.json,.csv,.mp3,.wav,.mp4,.mov"
              className="sr-only"
              disabled={isProcessing}
            />
          </label>

          <button
            type="button"
            onClick={handleFileSubmit}
            disabled={!selectedFile || isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0_0_#192138] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isProcessing ? 'Processing with Autonomous AI Agents...' : 'Run 6-Agent Accessibility Pipeline'}</span>
          </button>
        </div>
      )}

      {/* TAB 2: Website URL */}
      {activeTab === 'url' && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-black text-[var(--text-primary)] mb-2">
              Enter Public Website URL
            </label>
            <input
              type="url"
              placeholder="https://example.gov or https://your-site.org"
              value={urlInput}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrlInput(e.target.value)}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-sm text-[var(--text-primary)] font-medium focus:border-[#059669]"
              disabled={isProcessing}
            />
          </div>

          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput || isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Audit Website Accessibility</span>
          </button>
        </div>
      )}

      {/* TAB 3: Paste Text */}
      {activeTab === 'paste' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
              Document Title
            </label>
            <input
              type="text"
              placeholder="e.g. Quarterly Policy Notice"
              value={pasteTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasteTitle(e.target.value)}
              className="w-full py-2.5 px-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-medium mb-3"
              disabled={isProcessing}
            />

            <label className="block text-xs font-black text-[var(--text-primary)] mb-1.5">
              Document Raw Content
            </label>
            <textarea
              rows={6}
              placeholder="Paste rich document text, markdown, report transcripts, or meeting minutes..."
              value={pasteText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPasteText(e.target.value)}
              className="w-full py-3 px-4 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-medium focus:border-[#059669]"
              disabled={isProcessing}
            />
          </div>

          <button
            type="button"
            onClick={handlePasteSubmit}
            disabled={!pasteText.trim() || isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-black text-sm border-2 border-[var(--border-strong)] shadow-[4px_4px_0_0_#192138] hover:translate-x-[-1px] hover:translate-y-[-1px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>Analyze Pasted Text</span>
          </button>
        </div>
      )}

      {/* Preloaded Demo Quick Chips */}
      <div className="mt-8 pt-6 border-t-2 border-[var(--border-strong)]">
        <span className="text-[11px] font-black text-[var(--text-muted)] uppercase tracking-wider block mb-3">
          Or Select Preloaded Sample Document:
        </span>
        <div className="flex flex-wrap gap-2.5">
          {SAMPLE_DOCUMENTS.map((s: any) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleSampleClick(s.id)}
              disabled={isProcessing}
              className="py-2 px-3.5 rounded-xl border-2 border-[var(--border-strong)] bg-white hover:bg-amber-50 shadow-[2px_2px_0_0_#192138] text-xs font-black text-[var(--text-primary)] flex items-center gap-2 transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-amber-600" />
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
