import Link from 'next/link';
import '../globals.css'; // Import global styles (already imported in root, but good for standalone testing)
import { AlertProvider } from '../context/AlertContext';
import AlertContainer from '../components/AlertContainer';

// This layout does NOT include the Header and renders directly within the root body
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // No need for the extra div with classNames if the root layout provides the body styling
    // If root layout doesn't provide these, keep the div.
    // Assuming root layout handles body classNames and min-h-screen/bg-gray-50
    <div className="flex flex-col min-h-screen">
      <AlertProvider> {/* Still need AlertProvider here if not in root layout */}
        <main className="flex-grow flex items-center justify-center">
          {children} {/* Render the page content (AuthContainer) */}
        </main>
        <AlertContainer /> {/* Still need AlertContainer here if not in root layout */}
        <footer className="py-4 text-center text-sm text-gray-500">
          <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </footer>
      </AlertProvider>
    </div>
  );
} 