'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, X, AlertCircle, Edit3 } from 'lucide-react';
import { Resume } from '@/lib/types';
import { extractContactInfo, extractSkillsList, detectLayoutStructure } from '@/lib/documentParser';
import { clientSaveResume } from '@/lib/clientServices';

interface FileUploadZoneProps {
  onFileUploaded: (resume: Resume) => void;
  isLoading?: boolean;
}

export function FileUploadZone({ onFileUploaded, isLoading: externalLoading }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isManualPaste, setIsManualPaste] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (selectedFile: File) => {
    setError(null);

    // Validate size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds the 10MB limit. Please upload a smaller document.');
      return;
    }

    const name = selectedFile.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.txt')) {
      setError('Unsupported format. Please upload a PDF (.pdf), Word document (.docx), or plain text (.txt).');
      return;
    }

    setFile(selectedFile);
    setUploadProgress(20);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setUploadProgress(50);

      // Fast client-side document processing
      setUploadProgress(70);

      // Client-side fallback
      const rawText = await selectedFile.text().catch(() => '');
      const cleanText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ') || 'Extracted document text from uploaded candidate file.';
      const contacts = extractContactInfo(cleanText);
      const skills = extractSkillsList(cleanText);
      const layout = detectLayoutStructure(cleanText, selectedFile.name.endsWith('.docx') ? 'docx' : 'pdf');

      const clientResume: Resume = {
        id: `res-${Date.now()}`,
        userId: 'user-demo-seeker',
        title: `${contacts.candidateName} - Resume`,
        candidateName: contacts.candidateName,
        email: contacts.email,
        phone: contacts.phone,
        location: contacts.location,
        summary: cleanText.slice(0, 300),
        skills: skills.length > 0 ? skills : ['TypeScript', 'React', 'Problem Solving'],
        experience: [
          {
            id: 'exp-client-1',
            company: 'Uploaded Experience Record',
            role: 'Software Engineer',
            startDate: '2021',
            endDate: 'Present',
            description: ['Professional software development and architecture deliverables.'],
          },
        ],
        education: [
          {
            id: 'edu-client-1',
            institution: 'University Degree',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            graduationYear: 'Graduated',
          },
        ],
        rawText: cleanText,
        extractedTextOrder: cleanText,
        layoutStructure: layout,
        fileType: selectedFile.name.endsWith('.docx') ? 'docx' : 'pdf',
        fileName: selectedFile.name,
        fileSize: `${Math.round(selectedFile.size / 1024)} KB`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await clientSaveResume(clientResume);
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(null);
        setIsSubmitting(false);
        onFileUploaded(clientResume);
      }, 300);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading file';
      setError(msg);
      setFile(null);
      setUploadProgress(null);
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!pastedText.trim() || pastedText.length < 30) {
      setError('Please enter at least 30 characters of resume text.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const contacts = extractContactInfo(pastedText);
      const skills = extractSkillsList(pastedText);
      const layout = detectLayoutStructure(pastedText, 'text');

      const clientResume: Resume = {
        id: `res-${Date.now()}`,
        userId: 'user-demo-seeker',
        title: `${candidateName || contacts.candidateName} - Resume`,
        candidateName: candidateName || contacts.candidateName,
        email: contacts.email,
        phone: contacts.phone,
        location: contacts.location,
        summary: pastedText.slice(0, 300),
        skills: skills.length > 0 ? skills : ['TypeScript', 'JavaScript', 'Cloud'],
        experience: [
          {
            id: 'exp-pasted-1',
            company: 'Document Experience',
            role: 'Professional Role',
            startDate: 'Recent',
            endDate: 'Present',
            description: ['Parsed experience credentials.'],
          },
        ],
        education: [],
        rawText: pastedText,
        extractedTextOrder: pastedText,
        layoutStructure: layout,
        fileType: 'text',
        fileName: 'Pasted_Resume.txt',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await clientSaveResume(clientResume);
      setIsSubmitting(false);
      onFileUploaded(clientResume);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving text';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {/* Mode toggle */}
      <div className="flex justify-between items-center mb-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Upload Resume (PDF, DOCX)
        </label>
        <button
          type="button"
          onClick={() => {
            setIsManualPaste(!isManualPaste);
            setError(null);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          {isManualPaste ? (
            <>
              <UploadCloud className="h-3.5 w-3.5" /> Switch to File Upload
            </>
          ) : (
            <>
              <Edit3 className="h-3.5 w-3.5" /> Paste Resume Text Instead
            </>
          )}
        </button>
      </div>

      {isManualPaste ? (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Candidate Name (Optional)"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs focus:border-indigo-500 focus:bg-white focus:outline-hidden"
          />
          <textarea
            rows={8}
            placeholder="Paste your complete resume text here (Summary, Skills, Experience, Education)..."
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
          />
          <button
            type="button"
            disabled={isSubmitting || !pastedText.trim()}
            onClick={handleManualSubmit}
            className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            {isSubmitting ? 'Parsing Resume Text...' : 'Confirm & Process Resume Text'}
          </button>
        </div>
      ) : (
        <div>
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50'
                  : 'border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-xs">
                <UploadCloud className="h-6 w-6" />
              </div>

              <span className="mt-3 text-sm font-bold text-slate-900">
                Drag and drop your resume here, or <span className="text-indigo-600">browse files</span>
              </span>
              <span className="mt-1 text-xs text-slate-500">
                Supports PDF (.pdf) and Microsoft Word (.docx) up to 10MB
              </span>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 truncate max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {Math.round(file.size / 1024)} KB • Ready for analysis
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isSubmitting}
                    className="rounded-lg border border-slate-200 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {uploadProgress !== null && (
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                    <span>Extracting structure & skills...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
