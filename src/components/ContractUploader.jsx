import React, { useState } from 'react';
import { UploadCloud, FileText, AlertTriangle, Play, Sparkles, CheckCircle2, FileCheck } from 'lucide-react';
import { PRESET_CONTRACTS } from '../data/presetContracts';
import { parsePdfFile } from '../utils/pdfParser';

export default function ContractUploader({ contractText, setContractText, onAnalyze, onSelectPreset, activePresetId }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const processFile = async (file) => {
    if (!file) return;
    setIsScanning(true);
    setStatusMessage(`Reading PDF Document (${file.name})...`);

    try {
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        const text = await parsePdfFile(file);
        setContractText(text);
        setStatusMessage(`Successfully extracted PDF contract text!`);
        setTimeout(() => {
          setIsScanning(false);
          setStatusMessage('');
          if (onAnalyze) onAnalyze();
        }, 500);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result;
          if (typeof content === 'string') {
            setContractText(content);
            setIsScanning(false);
            setStatusMessage('');
            if (onAnalyze) onAnalyze();
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {
      console.error('Failed to parse document:', err);
      setStatusMessage('Error parsing PDF file. Please try pasting raw text.');
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Sample Presets Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle color="#ff3b5c" size={24} />
              <span>Select a Contract to Audit & Scan for Legal Traps</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Choose a sample contract with common traps or upload your client agreement below.
            </p>
          </div>
          <div style={{ fontSize: '0.8rem', background: 'rgba(255, 59, 92, 0.1)', color: '#ff5c77', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255, 59, 92, 0.2)', fontWeight: 700 }}>
            ⚡ Instant AI Threat Detection
          </div>
        </div>

        {/* Preset Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {PRESET_CONTRACTS.map((preset) => {
            const isActive = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="glass-card"
                style={{
                  cursor: 'pointer',
                  border: isActive ? `2px solid ${preset.badgeColor}` : '1px solid var(--border-glass)',
                  background: isActive ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.02)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    className="badge-threat"
                    style={{
                      background: `${preset.badgeColor}22`,
                      color: preset.badgeColor,
                      border: `1px solid ${preset.badgeColor}66`
                    }}
                  >
                    {preset.badge}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: preset.badgeColor }}>
                    Risk: {preset.riskScore}/100
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '6px 0 4px 0', color: '#fff' }}>
                  {preset.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.4 }}>
                  {preset.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <span>{preset.subtitle}</span>
                  {isActive ? (
                    <span style={{ color: preset.badgeColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Active
                    </span>
                  ) : (
                    <span style={{ color: 'var(--info-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Load <Play size={10} />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Zone & Manual Paste Box */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2col">
          {/* Drag & Drop Upload Zone for PDF / DOCX */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed var(--primary-accent)' : '2px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '30px 20px',
              textAlign: 'center',
              background: isDragging ? 'rgba(255, 59, 92, 0.05)' : 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md"
              onChange={handleFileUpload}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%'
              }}
            />
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(255, 59, 92, 0.15)',
              color: '#ff5c77',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <UploadCloud size={28} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              {isScanning ? 'Extracting PDF Contract Text...' : 'Drop Client PDF Contract Here'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Native support for <strong>.PDF</strong>, .DOCX, and plain text agreements
            </p>

            {statusMessage ? (
              <span style={{ fontSize: '0.78rem', color: 'var(--info-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCheck size={14} /> {statusMessage}
              </span>
            ) : (
              <span className="btn-secondary" style={{ pointerEvents: 'none', fontSize: '0.8rem' }}>
                Select PDF Contract File
              </span>
            )}
          </div>

          {/* Quick Paste & Edit Text Box */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} /> Extracted / Pasted Contract Text
              </label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                {contractText.length} characters • {contractText.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              value={contractText}
              onChange={(e) => setContractText(e.target.value)}
              placeholder="Extracted PDF text or pasted contract clauses will appear here..."
              rows={7}
              style={{
                width: '100%',
                flex: 1,
                background: '#0b0f19',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none'
              }}
            />

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                className="btn-secondary"
                onClick={() => setContractText('')}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                Clear Text
              </button>
              <button
                className="btn-primary"
                onClick={onAnalyze}
                disabled={!contractText.trim() || isScanning}
                style={{ opacity: !contractText.trim() ? 0.6 : 1 }}
              >
                <Sparkles size={16} />
                <span>Run AI Threat Scan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
