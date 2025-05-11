export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-primary"></div>
        <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-primary animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}