import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Privacy Policy - Resume Manager",
    description: "Privacy Policy for the Resume Manager application."
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            <Link href="/" className="hover:text-blue-600">ResumeManager</Link>
          </h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 shadow-sm rounded-lg border border-gray-200/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy for ResumeManager</h2>
                <p className="text-sm text-gray-500 mb-6">
                    <strong>Last Updated:</strong> June 9, 2025
                </p>

            <div className="space-y-6 text-gray-700">
                <p>
                    Welcome to ResumeManager! This Privacy Policy explains how we
                    collect, use, disclose, and safeguard your information when you
                    use our website and Chrome Extension (collectively, the &quot;Service&quot;).
                    Please read this privacy policy carefully. If you do not agree with
                    the terms of this privacy policy, please do not access the service.
                </p>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Information We Collect</h3>
                    <p className="mb-2">We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                        <strong>Personal Data:</strong> Personally identifiable information, such as your username and email address, that you voluntarily give to us when you register with the Service.
                        </li>
                        <li>
                        <strong>Resume Data:</strong> We store the resumes you upload, including the file itself and any associated metadata like category and labels you provide, in order to provide the Service&apos;s core functionality.
                        </li>
                        <li>
                        <strong>Usage Data:</strong> Information our servers automatically collect when you access the website, such as your IP address, browser type, and operating system. The Chrome Extension does not collect this data, but our website does for security and analytics.
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">How We Use Your Information</h3>
                    <p className="mb-2">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>Create and manage your account.</li>
                        <li>Store and manage your resumes for your personal use.</li>
                        <li>Enable the autofill functionality of the Chrome Extension by securely providing your stored resume URLs.</li>
                        <li>Email you regarding your account.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Disclosure of Your Information</h3>
                    <p className="mb-2">We do not sell your personal information. We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                        <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law.
                        </li>
                        <li>
                        <strong>Third-Party Service Providers:</strong> We use third-party services for data storage and authentication (Supabase). Your information is subject to their privacy policies.
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold mb-2">Security of Your Information</h3>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. We use Supabase for authentication and storage, which provides a robust security framework. However, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Policy for Children</h3>
                    <p>
                        We do not knowingly solicit information from or market to children under the age of 13.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Changes to This Privacy Policy</h3>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:saisriramkurapati@gmail.com" className="text-blue-600 hover:text-blue-500">saisriramkurapati@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
} 