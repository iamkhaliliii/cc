export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="text-center space-y-6 p-8">
        <div className="space-y-4">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Hello World
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Welcome to your Next.js application with shadcn/ui
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-3 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Built with Next.js 15 & Tailwind CSS
          </p>
        </div>
      </main>
    </div>
  );
}
