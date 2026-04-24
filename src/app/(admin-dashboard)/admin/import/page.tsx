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
        <h1 className="mb-2 text-3xl font-black text-white">Bulk Data Import</h1>
        <p className="text-gray-400">
          Upload CSV files to import thousands of business records into the database.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Upload Card */}
        <div className="space-y-6 lg:col-span-2">
          <div
            className={`glass-card flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-12 transition-all ${
              file
                ? "border-purple-500 bg-purple-500/5"
                : "border-gray-800 hover:border-gray-600 hover:bg-white/5"
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
              <div className="animate-bounce text-center">
                <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-400" />
                <h3 className="text-xl font-bold text-white">Import Complete!</h3>
                <p className="mt-2 text-gray-400">1,00,000 records processed successfully.</p>
              </div>
            ) : isUploading ? (
              <div className="w-full max-w-md text-center">
                <Loader2 className="mx-auto mb-6 h-12 w-12 animate-spin text-purple-500" />
                <h3 className="mb-4 text-xl font-bold text-white">Processing Records...</h3>
                <div className="mb-2 h-2.5 w-full rounded-full bg-gray-800">
                  <div
                    className="h-2.5 rounded-full bg-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{progress}% - Reading CSV chunks</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto mb-4 h-16 w-16 text-gray-600" />
                {file ? (
                  <>
                    <h3 className="text-xl font-bold text-white">{file.name}</h3>
                    <p className="mt-2 text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="mt-4 text-sm font-bold text-purple-400">Click to change file</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-white">Select CSV File</h3>
                    <p className="mt-2 text-gray-400">Drag and drop or click to browse</p>
                    <p className="mt-4 text-xs font-black tracking-widest text-gray-500 uppercase">
                      Strict Template Required
                    </p>
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
              className="btn-glow h-12 px-8"
              disabled={!file || isUploading || complete}
              onClick={handleUpload}
            >
              {isUploading ? "Uploading..." : complete ? "Done" : "Start Import"}
            </Button>
            {complete && (
              <Button
                variant="outline"
                onClick={() => {
                  setComplete(false);
                  setFile(null);
                }}
                className="border-gray-800 text-gray-400"
              >
                Import Another
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <FileText className="h-5 w-5 text-purple-400" /> CSV Template
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              To ensure data integrity, please use our standardized CSV template. Missing columns or
              invalid HSN codes will be skipped.
            </p>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-gray-800 text-gray-300"
            >
              <Download className="h-4 w-4" /> Download Template
            </Button>
          </div>

          <div className="glass-card border-orange-900/30 bg-orange-900/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-orange-400">
              <AlertCircle className="h-5 w-5" /> Import Rules
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-2">
                <span className="font-bold text-orange-500">•</span>
                Max file size: 50MB
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-orange-500">•</span>
                Batch size: 1000 records/sec
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-orange-500">•</span>
                Duplicates: Skipped by Email Address
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-orange-500">•</span>
                Required: Business Name, City, Country, HSN
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
