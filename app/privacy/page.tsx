import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NYX BDSM Club",
  description: "Privacy Policy for NYX BDSM Club",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        {/* Add your privacy policy content here */}
        <p>Privacy policy content coming soon...</p>
      </div>
    </div>
  );
}
