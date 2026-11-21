'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { normalizePakistaniPhone } from '@/lib/security/phone';
import { WeddingEvent } from '@/types/database';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
} from 'lucide-react';

interface CSVImporterProps {
  events: WeddingEvent[];
}

interface ParsedPreviewRow {
  index: number;
  rawName: string;
  rawPhone: string;
  rawEvents: string;
  normalizedPhone: string;
  isPhoneValid: boolean;
  parsedEvents: string[];
  hasError: boolean;
  errorMessage?: string;
}

export function CSVImporter({ events }: CSVImporterProps) {
  const [pasteText, setPasteText] = useState('');
  const [previewRows, setPreviewRows] = useState<ParsedPreviewRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    success: boolean;
    importedCount: number;
    errorsCount: number;
    results: any[];
  } | null>(null);

  const sampleCSV = `name,phone,allowed_events
Bilal Ahmed & Family,03001234567,"mehndi,barat"
Mr. Muhammad Ali,+923121234567,"barat"
Usman Khan & Family,0333-1234567,"mehndi,barat,walima"
Sarah Jenkins & Guest,923219876543,"walima"`;

  const parseContent = (content: string) => {
    Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: ParsedPreviewRow[] = [];
        const seenPhones = new Set<string>();

        results.data.forEach((row: any, i: number) => {
          // Normalize column names
          const name = row.name || row.Name || row['Guest Name'] || '';
          const phone = row.phone || row.Phone || row['Mobile'] || '';
          const eventsStr = row.allowed_events || row.events || row.Events || 'mehndi,barat,walima';

          const phoneCheck = normalizePakistaniPhone(phone);

          // Parse event strings
          const parsedEvents = eventsStr
            .split(/[,;|]/)
            .map((s: string) => s.trim().toLowerCase())
            .filter(Boolean);

          let hasError = false;
          let errorMessage = '';

          if (!name.trim()) {
            hasError = true;
            errorMessage = 'Name is required';
          } else if (!phoneCheck.isValid) {
            hasError = true;
            errorMessage = phoneCheck.error || 'Invalid phone';
          } else if (seenPhones.has(phoneCheck.normalized)) {
            hasError = true;
            errorMessage = 'Duplicate phone in file';
          }

          if (phoneCheck.isValid) {
            seenPhones.add(phoneCheck.normalized);
          }

          rows.push({
            index: i + 1,
            rawName: name,
            rawPhone: phone,
            rawEvents: eventsStr,
            normalizedPhone: phoneCheck.normalized,
            isPhoneValid: phoneCheck.isValid,
            parsedEvents,
            hasError,
            errorMessage,
          });
        });

        setPreviewRows(rows);
        setImportSummary(null);
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setPasteText(text);
      parseContent(text);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = async () => {
    const validRows = previewRows.filter((r) => !r.hasError);
    if (validRows.length === 0) {
      alert('No valid rows found to import.');
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rows: validRows.map((r) => ({
            name: r.rawName,
            phone: r.normalizedPhone,
            allowedEvents: r.parsedEvents,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setImportSummary({
          success: true,
          importedCount: data.importedCount,
          errorsCount: data.errorsCount,
          results: data.imported || [],
        });
      } else {
        alert(data.error || 'Import failed.');
      }
    } catch {
      alert('Network error while executing import.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSampleTemplate = () => {
    const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'wedding_guests_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExportedLinks = () => {
    if (!importSummary?.results) return;

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const headers = ['name', 'phone', 'invitation_url'];
    const lines = [headers.join(',')];

    importSummary.results.forEach((item) => {
      const inviteUrl = `${origin}/invite/${item.token}`;
      lines.push(
        `"${item.name}","${item.phone}","${inviteUrl}"`
      );
    });

    const csvContent = lines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wedding_invitation_links_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-royal font-bold text-gold-gradient">
            Bulk CSV Guest Importer
          </h1>
          <p className="text-xs text-[#E6D2A0]/80 font-serif italic mt-0.5">
            Upload CSV or paste raw guest lists with automatic Pakistani phone normalization &amp; token generation
          </p>
        </div>

        <button
          onClick={downloadSampleTemplate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3A0715] hover:bg-[#580F25] border border-[#C5A15A]/50 text-xs font-royal text-[#E6D2A0] transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#C5A15A]" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* Input Options: File or Paste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Drop Area */}
        <div className="mughal-border rounded-xl p-6 bg-[#23050E]/80 flex flex-col items-center justify-center text-center">
          <Upload className="w-10 h-10 text-[#C5A15A] mb-3" />
          <h3 className="text-sm font-royal font-semibold text-[#F8F1E5]">
            Upload CSV File
          </h3>
          <p className="text-xs text-[#E6D2A0]/60 mt-1 mb-4">
            Supports CSV files with guest names, phone numbers, and permitted events
          </p>
          <label className="cursor-pointer px-4 py-2 rounded-lg bg-gradient-to-r from-[#580F25] to-[#3A0715] border border-[#C5A15A] text-xs font-royal text-[#E6D2A0] hover:shadow-[0_0_15px_rgba(197,161,90,0.3)] transition-all">
            <span>Browse CSV File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Raw Text Paste */}
        <div className="mughal-border rounded-xl p-6 bg-[#23050E]/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-[#C5A15A] font-royal font-semibold">
                Or Paste CSV Content Directly
              </span>
              <button
                onClick={() => {
                  setPasteText(sampleCSV);
                  parseContent(sampleCSV);
                }}
                className="text-[10px] text-[#C5A15A] hover:underline"
              >
                Load Sample Data
              </button>
            </div>
            <textarea
              rows={4}
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                parseContent(e.target.value);
              }}
              placeholder={`name,phone,allowed_events\nBilal Ahmed & Family,03001234567,"mehndi,barat"`}
              className="w-full p-2.5 rounded-lg bg-[#191516] border border-[#C5A15A]/30 text-xs font-mono text-[#F8F1E5] placeholder-[#F8F1E5]/30 focus:outline-none focus:border-[#C5A15A] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Validation Preview Table */}
      {previewRows.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-royal font-bold text-gold-gradient">
                CSV Validation &amp; Mapping Preview
              </h2>
              <span className="text-xs text-[#E6D2A0]/80">
                {previewRows.filter((r) => !r.hasError).length} valid rows ready •{' '}
                {previewRows.filter((r) => r.hasError).length} issues detected
              </span>
            </div>

            <button
              onClick={handleExecuteImport}
              disabled={isProcessing || previewRows.filter((r) => !r.hasError).length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-800 to-emerald-900 border border-emerald-500/50 text-xs font-royal font-semibold uppercase tracking-wider text-emerald-100 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing &amp; Generating Tokens...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>
                    Import {previewRows.filter((r) => !r.hasError).length} Guests &amp; Generate URLs
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#C5A15A]/20 bg-[#1D1215]/80">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2B0610] text-[#C5A15A] font-royal uppercase tracking-wider text-[11px] border-b border-[#C5A15A]/20">
                <tr>
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Raw Phone</th>
                  <th className="py-3 px-4">Normalized Pakistani Phone</th>
                  <th className="py-3 px-4">Permitted Functions</th>
                  <th className="py-3 px-4">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C5A15A]/10 font-sans">
                {previewRows.map((row) => (
                  <tr
                    key={row.index}
                    className={`hover:bg-[#250812]/50 transition-colors ${
                      row.hasError ? 'bg-red-950/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-[#E6D2A0]/60">{row.index}</td>
                    <td className="py-2.5 px-4 font-serif font-bold text-sm text-[#F8F1E5]">
                      {row.rawName}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs text-[#E6D2A0]/80">
                      {row.rawPhone}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-xs">
                      {row.isPhoneValid ? (
                        <span className="text-emerald-300 font-semibold">{row.normalizedPhone}</span>
                      ) : (
                        <span className="text-red-400 italic">Invalid Format</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {row.parsedEvents.map((ev, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] uppercase font-royal bg-[#3A0715] border border-[#C5A15A]/30 text-[#E6D2A0]"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      {row.hasError ? (
                        <span className="inline-flex items-center gap-1 text-red-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {row.errorMessage}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ready
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post-Import Success Report & CSV Export */}
      {importSummary && (
        <div className="mughal-border rounded-xl p-6 md:p-8 bg-gradient-to-r from-emerald-950/80 via-[#23050E]/90 to-emerald-950/80 space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            <div>
              <h3 className="text-lg font-royal font-bold text-emerald-300">
                Bulk Import Executed Successfully!
              </h3>
              <p className="text-xs text-[#E6D2A0]/80">
                {importSummary.importedCount} guests saved with personalized tokens generated.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={downloadExportedLinks}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-royal font-semibold uppercase tracking-wider shadow cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Invitation Links CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
