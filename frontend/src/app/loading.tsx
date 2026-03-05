export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-gold/30" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-gold animate-spin" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-b-gold/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <div className="text-center">
          <p className="text-gold font-medium">Loading</p>
          <p className="text-white/50 text-sm mt-1">Preparing your experience...</p>
        </div>
      </div>
    </div>
  );
}
