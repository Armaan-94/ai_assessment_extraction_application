import { AssessmentProvider } from "@/context/AssessmentContext";
import "./globals.css";

export const metadata = {
  title: "VedaAI - AI Teacher's Toolkit",
  description: "AI Assessment Extraction & Answer Mapping",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-[#f8f9fa] text-gray-900">
        <AssessmentProvider>
          {children}
        </AssessmentProvider>
      </body>
    </html>
  );
}
