"use client";

import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please select a valid CSV file.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setError("");

    // Simulate chunked upload and processing for 100k records
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      setComplete(true);
      clearInterval(interval);
    }, 6000);
  };

  return (
    <div className="animate-fadeInUp">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Bulk Data Import</h1>
        <p className="text-gray-400">Upload CSV files to import thousands of business records into the database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Card */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            className={`glass-card p-12 flex flex-col items-center justify-center border-2 border-dashed transition-all cursor-pointer ${
              file ? "border-purple-500 bg-purple-500/5" : "border-gray-800 hover:border-gray-600 hover:bg-white/5"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            {complete ? (
              <div className="text-center animate-bounce">
                <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white">Import Complete!</h3>
                <p className="text-gray-400 mt-2">1,00,000 records processed successfully.</p>
              </div>
            ) : isUploading ? (
              <div className="w-full max-w-md text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-4">Processing Records...</h3>
                <div className="w-full bg-gray-800 rounded-full h-2.5 mb-2">
                  <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-gray-500 text-sm">{progress}% - Reading CSV chunks</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                {file ? (
                  <>
                    <h3 className="text-xl font-bold text-white">{file.name}</h3>
                    <p className="text-gray-400 mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-purple-400 mt-4 text-sm font-bold">Click to change file</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white">Select CSV File</h3>
                    <p className="text-gray-400 mt-2">Drag and drop or click to browse</p>
                    <p className="text-gray-500 text-xs mt-4 uppercase tracking-widest font-black">Strict Template Required</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            {file && !isUploading && !complete && (
              <Button 
                variant="outline" 
                onClick={() => setFile(null)} 
                className="border-gray-800 text-gray-400"
              >
                Clear
              </Button>
            )}
            <Button 
              className="btn-glow px-8 h-12" 
              disabled={!file || isUploading || complete}
              onClick={handleUpload}
            >
              {isUploading ? "Uploading..." : complete ? "Done" : "Start Import"}
            </Button>
            {complete && (
              <Button variant="outline" onClick={() => {setComplete(false); setFile(null);}} className="border-gray-800 text-gray-400">
                Import Another
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" /> CSV Template
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              To ensure data integrity, please use our standardized CSV template. Missing columns or invalid HSN codes will be skipped.
            </p>
            <Button variant="outline" className="w-full justify-start gap-3 border-gray-800 text-gray-300">
              <Download className="w-4 h-4" /> Download Template
            </Button>
          </div>

          <div className="glass-card p-6 border-orange-900/30 bg-orange-900/5">
            <h3 className="text-lg font-bold text-orange-400 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Import Rules
            </h3>
            <ul className="text-sm text-gray-400 space-y-3">
              <li className="flex gap-2">
                <span className="text-orange-500 font-bold">•</span>
                Max file size: 50MB
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-bold">•</span>
                Batch size: 1000 records/sec
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-bold">•</span>
                Duplicates: Skipped by Email Address
              </li>
              <li className="flex gap-2">
                <span className="text-orange-500 font-bold">•</span>
                Required: Business Name, City, Country, HSN
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
