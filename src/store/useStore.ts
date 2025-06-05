import { create, StateCreator } from 'zustand';
import { supabase } from '@/app/lib/supabaseClient';

interface Label {
    id: string;
    name: string;
}

interface Category {
    id: string,
    name: string;
}

interface Profile {
    id: string;
    username: string;
    email: string;
    created_at: string;
}

export interface Resume {
    id: string;
    name: string;
    file_url: string;
    category: string | null;
    labels: string[];
    created_at: string;
}

interface StoreState {
    // State
    resumes: Resume[];
    uniqueLabels: string[];
    uniqueCategories: string[];
    isLoading: boolean;
    error: string | null;
    profile: Profile | null;


    // Actions
    fetchResumes: () => Promise<void>;
    addResume: (resume: Resume) => void;
    updateResume: (id: string, updates: Partial<Resume>) => void;
    deleteResume: (id: string) => void;
    setProfile: (profile: Profile | null) => void;
    fetchProfile: () => Promise<void>;
}

const storeCreator: StateCreator<StoreState> = (set, get) => ({
    // Initial State
    resumes: [],
    uniqueLabels: [],
    uniqueCategories: [],
    isLoading: false,
    error: null,
    profile: null,
    

    //Actions
    fetchResumes: async () => {
        set({ isLoading: true, error: null});
        try {
            const { data, error } = await supabase
            .from('resumes')
            .select(`
                id,
                name,
                file_url,
                category,
                labels,
                created_at`
            )
            .order('created_at', { ascending: false});

            if (error) throw error;

            const fetchedResumes: Resume[] = data || [];

            const allLabels = fetchedResumes.flatMap(resume => resume.labels || []);
            const uniqueLabels = Array.from(new Set(allLabels)).sort();

            const allCategories = fetchedResumes.map(resume => resume.category).filter((cat): cat is string => cat !== null && cat !== undefined);
            const uniqueCategories = Array.from(new Set(allCategories)).sort();

            set({ 
                resumes: fetchedResumes,
                uniqueLabels: uniqueLabels,
                uniqueCategories: uniqueCategories
            });

        } catch (error) {
            set({ error: (error as Error).message});
        } finally {
            set({ isLoading: false});
        }
    },

    addResume: (resume) => {
        set((state) => {
            const newResumes = [resume, ...state.resumes];

            const allLabels = newResumes.flatMap(res => res.labels || []);
            const newUniqueLabels = Array.from(new Set(allLabels)).sort();

            const allCategories = newResumes.map(res => res.category).filter((cat): cat is string => cat !== null && cat !== undefined);
            const newUniqueCategories = Array.from(new Set(allCategories)).sort();

            return {
                resumes: newResumes,
                uniqueLabels: newUniqueLabels,
                uniqueCategories: newUniqueCategories
            };
        });
    },

    updateResume: (id, updates) => {
        set((state) => {
            const updatedResumes = state.resumes.map((resume) =>
                resume.id === id ? { ...resume, ...updates } : resume
            );

            const allLabels = updatedResumes.flatMap(res => res.labels || []);
            const uniqueLabels = Array.from(new Set(allLabels)).sort();

            const allCategories = updatedResumes.map(res => res.category).filter((cat): cat is string => cat !== null && cat !== undefined);
            const uniqueCategories = Array.from(new Set(allCategories)).sort();

            return {
                resumes: updatedResumes,
                uniqueLabels: uniqueLabels,
                uniqueCategories: uniqueCategories
            };
         });
    },

    deleteResume: (id) => {
        set((state) => {
            const filteredResumes = state.resumes.filter((resume) => resume.id !== id);

            const allLabels = filteredResumes.flatMap(res => res.labels || []);
            const uniqueLabels = Array.from(new Set(allLabels)).sort();

            const allCategories = filteredResumes.map(res => res.category).filter((cat): cat is string => cat !== null && cat !== undefined);
            const uniqueCategories = Array.from(new Set(allCategories)).sort();

            return {
                resumes: filteredResumes,
                uniqueLabels: uniqueLabels,
                uniqueCategories: uniqueCategories
            };
        });
    },

    setProfile: (profile) => set({ profile }),
    fetchProfile: async () => {
        console.log('Fetching profile...');
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user);
        
        if (!user) {
            console.log('No user found, setting profile to null');
            set({ profile: null });
            return;
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (error) {
            console.error('Error fetching profile:', error);
            set({ profile: null });
            return;
        }

        console.log('Profile fetched successfully:', profile);
        set({ profile });
    }
})

export const useStore = create<StoreState>(storeCreator);

