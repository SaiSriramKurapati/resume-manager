"use client";

import { useState, useEffect, DragEvent, ChangeEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import Button from "./Button";
import Input from "./Input";
import CustomCombobox from "./Combobox";
import { useAlert } from '../context/AlertContext';
import clsx from "clsx";
import { DocumentIcon } from '@heroicons/react/24/outline';
import Tippy from "@tippyjs/react";
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useStore } from "@/store/useStore";
import MultiSelectCombobox from "./MultiSelectCombobox";

export default function ResumeUploadForm({ onUpload }: { onUpload: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [category, setCategory] = useState("");
    const [labels, setLabels] = useState<string[]>([]);
    const { showAlert } = useAlert();

    const removeLabel = (labelToRemove: string) => {
        setLabels((prev) => prev.filter((l) => l !== labelToRemove));
    };

    // SELECT state and actions from the Zustand store
    const uniqueCategories = useStore((state) => state.uniqueCategories);
    const uniqueLabels = useStore((state) => state.uniqueLabels);
    const addResume = useStore((state) => state.addResume);



    // Add drag and drop handlers
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Prevent default to allow drop
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // Check if it's a supported file type
            const file = files[0];
            if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile(file);
            } else {
                 showAlert("Unsupported file type. Please upload a PDF, DOC, or DOCX file.", 'warning');
            }
        }
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                setFile(file);
            } else {
                 showAlert("Unsupported file type. Please upload a PDF, DOC, or DOCX file.", 'warning');
            }
        }
    };

    const handleUpload = async () => {
        const finalCategory = category.trim();

        if (!file || !finalCategory) {
            showAlert("Please select a file and enter/select a category.", 'error');
            return;
        }

        setUploading(true);
        let uploadedPath: string | null = null;

        try {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;
            if (!userId) {
                showAlert("User not found.", 'error');
                return;
            }

            const path = `${userId}/${Date.now()}_${file.name}`;
            uploadedPath = path;

            const { error: uploadError } = await supabase.storage
                .from("resumes")
                .upload(path, file);

            if (uploadError) {
                showAlert("Error uploading resume: " + uploadError.message, 'error');
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from("resumes")
                .getPublicUrl(path);

            const resumeId = uuidv4();

            const { error: insertError } = await supabase.from("resumes").insert({
                id: resumeId,
                user_id: userId,
                name: file.name,
                file_url: publicUrlData.publicUrl,
                category: finalCategory,
                labels,
            });

            if (insertError) {
                showAlert("Error saving resume data: " + insertError.message, 'error');
                return;
            }

            // Success case
            setFile(null);
            setCategory("");
            setLabels([]);
            addResume({
                id: resumeId,
                name: file.name,
                file_url: publicUrlData.publicUrl,
                category: finalCategory,
                labels,
                created_at: new Date().toISOString()
            });
            showAlert("Resume uploaded successfully!", 'success');
            onUpload();

        } catch (error) {
            showAlert("An unexpected error occurred: " + (error as Error).message, 'error');
        } finally {
            setUploading(false);
            
            // Clean up uploaded file if there was an error
            if (uploadedPath) {
                try {
                    await supabase.storage.from("resumes").remove([uploadedPath]);
                } catch (error) {
                    console.error("Error cleaning up uploaded file:", error);
                }
            }
        }
    };

    return (
        <div className="backdrop-blur-sm border border-gray-200/50 shadow-sm rounded p-6 w-full max-w-md space-y-5">
            <h2 className="text-xl font-semibold mb-2 text-center text-text-primary">Upload Resume</h2>

            {/* File Upload Area */}
            <div>
                {/* Replace the input with a styled div for drag and drop */} 
                {!file ? (
                    <div
                        className={clsx(
                            "border-2 border-dashed rounded p-6 text-center cursor-pointer",
                            "border-gray-400/50 hover:border-blue-500 transition-colors",
                            "shadow-sm hover:shadow-md hover:shadow-blue-500/50 transition-shadow duration-300 ease-in-out",
                            uploading && "pointer-events-none opacity-50"
                        )}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <input
                            id="fileInput"
                            type="file"
                            accept=".pdf, .doc, .docx"
                            onChange={handleFileSelect}
                            className="hidden" // Hide the actual input
                            disabled={uploading}
                        />
                        <p className="text-text-tertiary mb-1">Drag & drop your resume here, or click to select file (.pdf, .doc, .docx)</p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-3 border border-gray-300/50 rounded text-white shadow-lg bg-gradient-to-r from-green-400 to-blue-500">
                        <div className="flex items-center gap-2">
                            {/* File Icon */}
                            <DocumentIcon className="h-5 w-5" />
                            <div className="flex flex-col">
                                <span className="font-medium">{file.name}</span>
                                {/* You can add file size or type back here later if desired */}
                            </div>
                        </div>
                        {/* Remove File Button with Tippy */}
                        <Tippy content="Remove File">
                            <button
                                type="button"
                                onClick={() => setFile(null)}
                                className="text-white hover:text-gray-200 cursor-pointer"
                                disabled={uploading}
                                aria-label="Remove selected file"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        </Tippy>
                    </div>
                )}
            </div>

            <div>
                <label className="block mb-1 font-medium text-text-primary">Category</label>
                <CustomCombobox
                    items={uniqueCategories}
                    value={category}
                    onChange={(value) => setCategory(value === null ? '' : value)}
                    placeholder="Select or enter category"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-text-primary">Labels</label>
                <CustomCombobox
                    items={uniqueLabels}
                    value={null}
                    onChange={(value) => {
                        if (labels.length < 5 && value && !labels.includes(value.toLowerCase())) {
                            setLabels((prev) => [...prev, value.toLowerCase()]);
                        } else if (labels.length >= 5 && value && !labels.includes(value.toLowerCase())) {
                            showAlert("Maximum 5 labels allowed.", 'warning');
                        }
                    }}
                    placeholder="Select or enter labels"
                    disabled={uploading || labels.length >= 5}
                />

                <div className="text-xs text-text-tertiary mb-1 mt-2">You can enter a max of 5 labels.</div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {labels.map((label) => (
                        <span
                            key={label}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center"
                        >
                            {label}
                            <button
                                type="button"
                                className="ml-1 text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                                onClick={() => removeLabel(label)}
                                disabled={uploading}
                                aria-label={`Remove label ${label}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <Button
                variant="primary"
                disabled={uploading || !file || !category}
                onClick={handleUpload}
                className="w-full"
            >
                {uploading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                        Uploading...
                    </>
                ) : (
                    "Upload"
                )}
            </Button>
        </div>
    );
}