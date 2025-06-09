interface Resume {
  id: string;
  name: string;
  file_url: string;
  category: string;
  labels: string[];
  created_at: string;
}

export default function ResumeList({ resumes, loading, selectedResume, setSelectedResume }: {
  resumes: Resume[];
  loading: boolean;
  selectedResume: Resume | null;
  setSelectedResume: (resume: Resume) => void;
}) {

  if (loading) return <div className="text-center py-4">Loading resumes...</div>;
  if (resumes.length === 0) return <div className="text-center py-4">No resumes found matching your search.</div>;

  return (
    <div className="space-y-4 max-h-80 overflow-y-auto px-2 py-1">
      {resumes.map((resume) => (
        <div
          key={resume.id}
          onClick={() => setSelectedResume(resume)}
          className={`flex items-center border rounded-lg p-3 shadow-sm hover:bg-gray-50 transition cursor-pointer ${
            selectedResume?.id === resume.id ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="font-medium">{resume.name}</div>
                <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                  {resume.category}
                </span>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  window.open(resume.file_url, '_blank');
                }}
                className="ml-4 text-blue-600 text-xs hover:text-blue-800"
                title="Preview"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {resume.labels?.map((label) => (
                <span
                  key={label}
                  className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Uploaded: {new Date(resume.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 