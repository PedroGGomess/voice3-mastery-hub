const LoadingAI = ({ message = 'Thinking...' }: { message?: string }) => (
  <div className="flex items-center gap-3 p-4 opacity-70">
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
    <span className="text-sm text-amber-400/80">{message}</span>
  </div>
)

export default LoadingAI
