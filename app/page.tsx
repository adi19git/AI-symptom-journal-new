import ChatBot from "@/components/ChatBot";

export default function LandingPage() {
  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">AI Symptom Journal</h1>
      <ChatBot />
    </main>
  );
}
