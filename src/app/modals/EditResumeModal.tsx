import { useEffect, useState, Fragment } from "react";
import { supabase } from "../lib/supabaseClient";
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import CustomCombobox from '../components/Combobox';
import MultiSelectCombobox from '../components/MultiSelectCombobox';
import { useAlert } from "../context/AlertContext";
import { useStore } from "@/store/useStore";
import type { Resume } from "@/store/useStore";



type EditResumeModalProps = {
    open: boolean;
    onClose: () => void;
    resume: Resume | null;
    onSave: () => void;
};

export default function EditResumeModal({ open, onClose, resume, onSave }: EditResumeModalProps) {
    const [category, setCategory] = useState("");
    const [labels, setLabels] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();

    const uniqueCategories = useStore((state) => state.uniqueCategories);
    const uniqueLabels = useStore((state) => state.uniqueLabels);
    const updateResume = useStore((state) => state.updateResume);
    
    useEffect(() => {
        if (resume) {
            setCategory(resume.category || "");
            setLabels(resume.labels || []);
            setError(null);
        }
    }, [resume, open]);

    async function handleSave() {
        if (!resume) return;
        setLoading(true);
        setError(null);
        
        try {
            const { error } = await supabase
                .from("resumes")
                .update({ category, labels })
                .eq("id", resume.id);

            if (error) {
                setError(error.message);
                return;
            }

            // Update the store
            updateResume(resume.id, { category, labels });
            
            showAlert('Changes saved successfully', 'success');
            onClose();
            onSave();
        } catch (error) {
            setError("An unexpected error occurred");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 p-6 text-left align-middle shadow-lg transition-all relative text-white">
                                {/* Close button */}
                                <button
                                    className="absolute top-4 right-5 text-gray-400 hover:text-gray-200 text-2xl cursor-pointer"
                                    onClick={onClose}
                                    aria-label="Close edit modal"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>

                                <Dialog.Title as="h2" className="text-lg font-semibold mb-4">
                                    Edit Resume
                                </Dialog.Title>

                                {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-2 text-sm text-center">{error}</div>}
                                <div className="mb-4">
                                    <CustomCombobox
                                        label="Category"
                                        items={uniqueCategories}
                                        value={category}
                                        onChange={(value) => setCategory(value === null ? '' : value)}
                                        placeholder="Select or create category"
                                        allowCreate={true}
                                    />
                                </div>
                                <div className="mb-4">
                                    <MultiSelectCombobox
                                        label="Labels"
                                        items={uniqueLabels}
                                        value={labels}
                                        onChange={setLabels}
                                        placeholder="Select or create labels"
                                        maxItems={5}
                                        allowCreate={true}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="inline-flex justify-center rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors duration-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="inline-flex justify-center rounded-md border border-blue-700 bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors duration-200"
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 