
const GridLoaderSkeleton = ({ rows = 2, cols = 2 }) => {
  return (
    <div className="px-3 py-1 space-y-0.5">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className={`grid grid-cols-${cols} gap-3 w-full py-2`}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              className="h-28 bg-gray-100 animate-pulse rounded-lg border border-gray-200"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { GridLoaderSkeleton };
