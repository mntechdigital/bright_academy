import DeleteWeeklyResultDialog from "./DeleteWeeklyResultDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const WeeklyResultTable = ({
  weeklyResults,
  selectedCard,
  onCardClick,
}: {
  weeklyResults: any[];
  selectedCard?: any;
  onCardClick?: (card: any) => void;
}) => {

  const uniqueResults = Array.from(
    new Map(
      weeklyResults.map((result) => [
        `${result.week}-${result.month}-${result.year}-${result.subject?.id}-${result.stdClass?.id}-${result.batch?.id}`,
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
    <div className="mt-6">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {uniqueResults.map((result) => {
            const isSelected = selectedCard?.id === result.id;
            return (
              <CarouselItem key={result.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div
                  onClick={() => {
                    console.log("Card clicked in table:", result.id);
                    onCardClick?.(result);
                  }}
                  className={`relative h-full bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer ${
                    isSelected
                      ? "border-green-500 ring-2 ring-green-200"
                      : "border-gray-200"
                  }`}
                >
                  {/* Delete button — top right */}
                  <div className="absolute top-2 right-2 z-10">
                  <DeleteWeeklyResultDialog 
                      id={result.id}
                      stdClassId={result.stdClass?.id}
                      batchId={result.batch?.id || result.batchId || result.student?.batchId}
                      week={result.week}
                    />
                  </div>

                  {/* Card Header */}
                  <div
                    className={`px-3 pt-2.5 pb-2.5 border-b pr-8 ${
                      isSelected
                        ? "bg-green-100 border-green-300"
                        : "bg-linear-to-r from-orange-50 to-amber-50 border-orange-100"
                    }`}
                  >
                    <p className={`text-[10px] font-medium uppercase tracking-wide truncate ${
                      isSelected ? "text-green-600" : "text-orange-500"
                    }`}>
                      {result.subject?.subjectName || "—"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <h3 className={`text-xs font-semibold truncate ${
                        isSelected ? "text-green-900" : "text-gray-800"
                      }`}>
                        {result.stdClass?.className || "—"}
                        {result.batch?.name ? ` · ${result.batch.name}` : ""}
                      </h3>
                      <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isSelected 
                          ? "bg-green-200 text-green-800"
                          : "bg-orange-100 text-orange-700"
                      }`}>
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
                      <p className={`text-xs font-bold ${
                        isSelected ? "text-green-600" : "text-orange-500"
                      }`}>{result.totalMarks}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-0 bg-orange-500 text-white" />
        <CarouselNext className="right-0 bg-orange-500 text-white" />
      </Carousel>
    </div>
  );
};

export default WeeklyResultTable;