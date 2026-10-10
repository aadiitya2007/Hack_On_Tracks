export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24 animate-pulse">
      <div className="text-center space-y-4 pt-10">
        <div className="h-6 w-32 bg-surface-hover mx-auto rounded-md"></div>
        <div className="h-12 w-3/4 max-w-lg bg-surface-hover mx-auto rounded-xl"></div>
      </div>
      
      <div className="h-48 w-full bg-surface-hover rounded-2xl"></div>
      <div className="h-96 w-full bg-surface-hover rounded-2xl"></div>
      <div className="h-64 w-full bg-surface-hover rounded-2xl"></div>
    </div>
  );
}
