import CommentForm from "@/components/CommentForm";
import CommentList from "@/components/CommentList";
import { SocketProvider } from "@/components/SocketProvider";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-10">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
          Real-Time Discussion
        </h1>
        <p className="text-slate-400">
          Share your thoughts instantly with everyone online.
        </p>
      </header>
      
      <SocketProvider>
        <CommentForm />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 border-b border-slate-700 pb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            Live Comments
          </h2>
          <CommentList />
        </div>
      </SocketProvider>

    </main>
  );
}
