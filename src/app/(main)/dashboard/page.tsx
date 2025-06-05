"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import ResumeUploadForm from "../../components/ResumeUploadForm";
import EditResumeModal from "../../modals/EditResumeModal";
import PreviewResumeModal from "../../modals/PreviewResumeModal";
import TableCheckbox from "../../components/TableCheckbox";
import Button from "../../components/Button";
import Tippy from "@tippyjs/react";
import DeleteConfirmationModal from "../../modals/DeleteConfirmationModal";
import { useAlert } from "../../context/AlertContext";
import { useStore } from "@/store/useStore";
import type { Resume } from "@/store/useStore";
import TableSkeleton from "../../skeletons/TableSkeleton";

export default function Dashboard() {
    const [previewResume, setPreviewResume] = useState<Resume | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editResume, setEditResume] = useState<Resume | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIds, setDeleteIds] = useState<string[]>([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { showAlert } = useAlert();

    const { data: resumes, isLoading } = useStore((state) => ({
        data: state.resumes,
        isLoading: state.isLoading
    }));
    const fetchResumes = useStore((state) => state.fetchResumes);
    const deleteResume = useStore((state) => state.deleteResume);

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    // Download helper
    function downloadFile(url: string, filename: string) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Open edit modal and initialize state
    function openEditModal(resume: Resume) {
        setEditResume(resume);
        setEditModalOpen(true);
    }

    function closeEditModal() {
        setEditModalOpen(false);
        setEditResume(null);
    }

    async function handleEditSave() {
        await fetchResumes();
    }

    // Selection logic
    const isAllSelected = resumes.length > 0 && selectedIds.length === resumes.length;

    function toggleSelectAll() {
        if (isAllSelected) setSelectedIds([]);
        else setSelectedIds(resumes.map(r => r.id));
    }

    function toggleSelectOne(id: string) {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }

    function openDeleteModal(ids: string[]) {
        setDeleteIds(ids);
        setDeleteModalOpen(true);
    }

    function closeDeleteModal() {
        setDeleteModalOpen(false);
        setDeleteIds([]);
    }

    async function handleDelete() {
        setDeleteLoading(true);
        try {
            const { error } = await supabase
                .from("resumes")
                .delete()
                .in("id", deleteIds);
            setDeleteLoading(false);
            if (error) {
                showAlert(error.message, 'error');
                return;
            }

            // Update Store
            deleteIds.forEach(id => deleteResume(id));

            closeDeleteModal();
            showAlert(`Successfully remove ${deleteIds.length} file${deleteIds.length === 1 ? '' : 's'}`, 'success');
            setSelectedIds(ids => ids.filter(id => !deleteIds.includes(id)));

        } catch (error) {
            showAlert("An error occured while deleting", 'error');
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-center relative z-10">
                <ResumeUploadForm onUpload={fetchResumes} />
            </div>

            <div className="flex items-center justify-between mt-8 mb-2">
                <h1 className="text-2xl font-semibold text-text-primary">Recent Resumes</h1>

                <div className="flex gap-2 items-center">
                    {selectedIds.length > 0 && (
                        <Button
                            variant="danger"
                            onClick={() => openDeleteModal(selectedIds)}
                            type="button"
                            className="flex gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 7v13a2 2 0 002 2h8a2 2 0 002-2V7M4 7h16M10 11v6M14 11v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                            </svg>
                            Delete Selected
                        </Button>
                    )}
                    <Link href="/resumes">
                        <Button variant="primary">
                            View All Resumes
                        </Button>
                    </Link>
                </div>
            </div>


            {isLoading ? (
                <TableSkeleton />
            ) : resumes.length === 0 ? (
                
                    <div className="text-center py-8 text-text-tertiary">No resumes found.</div>
                
            ) : (
                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full backdrop-blur-sm border border-gray-200/50 shadow-sm rounded">
                        <thead>
                            <tr className="text-left">
                                <th className="py-2 px-4 border-b border-gray-200/50 text-text-primary">
                                    <TableCheckbox
                                        checked={isAllSelected}
                                        onChange={toggleSelectAll}
                                        aria-label="Select all resumes"
                                    />
                                </th>
                                <th className="py-2 px-4 border-b border-gray-200/50 text-text-primary">Name</th>
                                <th className="py-2 px-4 border-b border-gray-200/50 text-text-primary">Category</th>
                                <th className="py-2 px-4 border-b border-gray-200/50 text-text-primary">Labels</th>
                                <th className="py-2 px-4 border-b border-gray-200/50 text-text-primary">Uploaded At</th>
                                <th className="py-2 px-4 border-b border-gray-200/50 text-text-primary">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resumes.map((resume) => (
                                <tr key={resume.id} className="border-b border-gray-200/50">
                                    <td className="py-2 px-4">
                                        <TableCheckbox
                                            checked={selectedIds.includes(resume.id)}
                                            onChange={() => toggleSelectOne(resume.id)}
                                            aria-label={`Select resume ${resume.name}`}
                                        />
                                    </td>
                                    <td className="py-2 px-4 text-text-primary">{resume.name}</td>
                                    <td className="py-2 px-4 text-text-primary">{resume.category}</td>
                                    <td className="py-2 px-4">
                                        <div className="flex flex-wrap gap-2">
                                            {(resume.labels || []).map((label) => (
                                                <span
                                                    key={label}
                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                                >
                                                    {label}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-2 px-4 text-sm text-text-tertiary">
                                        {new Date(resume.created_at).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 flex gap-2 items-center">
                                        <Tippy content="Preview">
                                            <button
                                                className="hover:text-blue-500 text-gray-500 transition-colors"
                                                onClick={() => {
                                                    setPreviewResume(resume);
                                                    setShowModal(true);
                                                }}
                                                aria-label="Preview resume"
                                                type="button"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="h-5 w-5 cursor-pointer"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                        </Tippy>
                                        <Tippy content="Download">
                                            <button
                                                onClick={() => downloadFile(resume.file_url, resume.name)}
                                                aria-label="Download resume"
                                                className="hover:text-blue-500 text-gray-500 transition-colors"
                                                type="button"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="h-5 w-5 cursor-pointer"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 10l5 5 5-5M12 4v12" />
                                                </svg>
                                            </button>
                                        </Tippy>
                                        <Tippy content="Edit">
                                            <button
                                                className="hover:text-blue-500 text-gray-500 transition-colors"
                                                onClick={() => openEditModal(resume)}
                                                aria-label="Edit resume"
                                                type="button"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="h-4 w-4 cursor-pointer"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.5 19.212l-4 1 1-4 12.362-12.725z"
                                                    />
                                                </svg>
                                            </button>
                                        </Tippy>
                                        <Tippy content="Delete">
                                            <button
                                                className="hover:text-red-500 text-gray-400 transition-colors"
                                                onClick={() => openDeleteModal([resume.id])}
                                                aria-label="Delete resume"
                                                type="button"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="h-4 w-4 cursor-pointer"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M4 7h16M10 11v6M14 11v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                                                </svg>
                                            </button>
                                        </Tippy>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            <DeleteConfirmationModal
                open={deleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemCount={deleteIds.length}
                loading={deleteLoading}
            />

            <EditResumeModal
                open={editModalOpen}
                onClose={closeEditModal}
                resume={editResume}
                onSave={handleEditSave}
            />

            <PreviewResumeModal
                open={showModal}
                onClose={() => setShowModal(false)}
                resume={previewResume}
            />
        </div>
    )
}


