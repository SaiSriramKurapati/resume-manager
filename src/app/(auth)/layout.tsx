import '../globals.css'; // Import global styles (already imported in root, but good for standalone testing)
import { AlertProvider } from '../context/AlertContext';
import AlertContainer from '../components/AlertContainer';

// This layout does NOT include the Header and renders directly within the root body
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // No need for the extra div with classNames if the root layout provides the body styling
    // If root layout doesn't provide these, keep the div.
    // Assuming root layout handles body classNames and min-h-screen/bg-gray-50
    <AlertProvider> {/* Still need AlertProvider here if not in root layout */}
      {children} {/* Render the page content (AuthContainer) */}
      <AlertContainer /> {/* Still need AlertContainer here if not in root layout */}
    </AlertProvider>
  );
} 