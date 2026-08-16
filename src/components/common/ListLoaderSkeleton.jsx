const ListLoaderSkeleton = ({ rows = 3 }) => (
  <div className="px-3 py-1 space-y-0.5">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-0 py-2.5">
        <div className="w-4 h-4 rounded-full bg-gray-100 animate-pulse shrink-0" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-3/4" />
          <div className="h-2 bg-gray-100 rounded-full animate-pulse w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export { ListLoaderSkeleton };
export default ListLoaderSkeleton;
