import DeleteWeeklyResultDialog from "./DeleteWeeklyResultDialog";

const WeeklyResultTable = ({
  weeklyResults,
}: {
  weeklyResults: any[];
}) => {

  const uniqueResults = Array.from(
    new Map(
      weeklyResults.map((result) => [
        `${result.week}-${result.month}-${result.year}-${result.subject?.subjectName}-${result.stdClass?.className}-${result.section?.sectionName}`,
        result,
      ])
    ).values()
  );

  if (uniqueResults.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 text-gray-400">
        <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2a4 4 0 014-4h0a4 4 0 014 4v2M7 21h10a2 2 0 002-2v-1a7 7 0 00-14 0v1a2 2 0 002 2z" />
        </svg>
        <p className="text-base font-medium">No results found</p>
        <p className="text-sm mt-1">Weekly results will appear here once added.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
      {uniqueResults.map((result) => (
        <div
          key={result.id}
          className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          {/* Delete button — top right */}
          <div className="absolute top-2 right-2 z-10">
            <DeleteWeeklyResultDialog sectionId={result.sectionId} stdClassId={result.stdClassId} />
          </div>

          {/* Card Header */}
          <div className="bg-linear-to-r from-orange-50 to-amber-50 px-3 pt-2.5 pb-2.5 border-b border-orange-100 pr-8">
            <p className="text-[10px] font-medium text-orange-500 uppercase tracking-wide truncate">
              {result.subject?.subjectName || "—"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <h3 className="text-xs font-semibold text-gray-800 truncate">
                {result.stdClass?.className || "—"}
                {result.section?.sectionName ? ` · ${result.section.sectionName}` : ""}
              </h3>
              <span className="shrink-0 inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
                Wk {result.week}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-3 py-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Month</p>
              <p className="text-xs font-medium text-gray-700 truncate">{result.month}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Year</p>
              <p className="text-xs font-medium text-gray-700">{result.year}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Published</p>
              <p className="text-xs font-medium text-gray-700">
                {new Date(result.publishedDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">Marks</p>
              <p className="text-xs font-bold text-orange-500">{result.totalMarks}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyResultTable;