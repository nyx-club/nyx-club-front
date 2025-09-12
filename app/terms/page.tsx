import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | NYX BDSM Club",
  description: "Terms of Service for NYX BDSM Club",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="prose max-w-none">
        {/* Add your terms of service content here */}
        <p>Terms of service content coming soon...</p>
      </div>
    </div>
  );
}
