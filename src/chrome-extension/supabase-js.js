// Minimal Supabase client for Chrome extension
class SupabaseClient {
  constructor(supabaseUrl, supabaseKey) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.headers = {
      'apikey': supabaseKey,
      'Content-Type': 'application/json'
    };
  }

  // Auth methods
  auth = {
    getSession: async () => {
      try {
        // Try to get session from storage
        const session = await new Promise((resolve) => {
          chrome.storage.local.get(['supabase_session'], (result) => {
            resolve(result.supabase_session || null);
          });
        });

        return { data: { session }, error: null };
      } catch (error) {
        return { data: { session: null }, error };
      }
    },

    signInWithPassword: async ({ email, password }) => {
      try {
        const response = await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.error) {
          return { data: null, error: new Error(data.error_description || data.error) };
        }

        const session = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          user: data.user
        };

        // Store session in chrome storage
        await chrome.storage.local.set({ 'supabase_session': session });
        
        return { data: { session, user: data.user }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    signOut: async () => {
      try {
        // Clear session from storage
        await chrome.storage.local.remove(['supabase_session']);
        return { error: null };
      } catch (error) {
        return { error };
      }
    }
  };

  // Database methods
  from = (table) => {
    return {
      select: (columns = '*') => {
        return {
          eq: async (column, value) => {
            const session = await this.auth.getSession();
            if (!session.data.session) {
              return { data: [], error: new Error('Not authenticated') };
            }

            try {
              const response = await fetch(
                `${this.supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}`,
                {
                  headers: {
                    ...this.headers,
                    'Authorization': `Bearer ${session.data.session.access_token}`
                  }
                }
              );

              const data = await response.json();
              return { data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        };
      }
    };
  };
}

// Export the client creation function
const createClient = (url, key) => {
  return new SupabaseClient(url, key);
};

// Make available globally
window.supabaseClient = {
  createClient
}; 