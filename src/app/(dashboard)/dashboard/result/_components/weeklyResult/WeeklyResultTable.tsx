
import { useState, useEffect } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';

const WeeklyResultTable = ({
  weeklyResults,
  selectedCard,
  onCardClick,
  onDeleteSuccess,
}: {
  weeklyResults: any[];
  selectedCard?: any;
  onCardClick?: (card: any) => void;
  onDeleteSuccess?: () => Promise<void>;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Remove duplicate weeks
  const uniqueResults = Array.from(
    new Map(
      weeklyResults.map((result) => [
        `${result.week}-${result.month}-${result.year}-${result.subject?.id}-${result.stdClass?.id}-${result.batch?.id || result.batchId || 'no-batch'}`,
        result,
      ])
    ).values()
  );

  const handleDeleteWeek = async (e: React.MouseEvent, result: any) => {
    e.stopPropagation();
    
    if (!result) return;
    
    const confirmMessage = `Are you sure you want to delete all data for ${result.week} - ${result.month} ${result.year}?\n\nThis will delete:\n- Subject: ${result.subject?.subjectName}\n- Class: ${result.stdClass?.className}${result.batch?.name ? `\n- Batch: ${result.batch?.name}` : ''}\n\nThis action cannot be undone.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Import delete function dynamically to avoid circular dependencies
        const { deleteWeeklyResultByClassAndSection } = await import('@/src/services/weeklyResult');
        
        const payload = {
          stdClassId: String(result.stdClass?.id || result.stdClassId),
          subjectId: String(result.subject?.id || result.subjectId),
          week: result.week,
          month: result.month,
          year: result.year,
          batchId: result.batch?.id || result.batchId,
        };
        
        await deleteWeeklyResultByClassAndSection(payload);
        
        // Call the success callback to refresh data
        if (onDeleteSuccess) {
          await onDeleteSuccess();
        }
      } catch (error) {
        console.error('Error deleting weekly result:', error);
        alert('Failed to delete result. Please try again.');
      }
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        !(event.target as Element).closest('.relative')
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  if (uniqueResults.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200 text-gray-400">
        <p className="text-base font-medium">No results found</p>
      </div>
    );
  }

  const handleSelect = (result: any) => {
    onCardClick?.(result);
    setIsDropdownOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedCard?.id) return;
    
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        // Import delete function dynamically to avoid circular dependencies
        const { deleteWeeklyResult } = await import('@/src/services/weeklyResult');
        await deleteWeeklyResult(selectedCard.id);
        
        // Call the success callback to refresh data
        if (onDeleteSuccess) {
          await onDeleteSuccess();
        }
      } catch (error) {
        console.error('Error deleting weekly result:', error);
        alert('Failed to delete result. Please try again.');
      }
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Week
        </label>

        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full md:w-96 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 flex items-center justify-between"
        >
          <span>
            {selectedCard
              ? `${selectedCard.week} - ${selectedCard.month} ${selectedCard.year}`
              : 'Select a week'}
          </span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-20 w-full md:w-96 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {uniqueResults.map((result) => (
              <div
                key={result.id}
                onClick={() => handleSelect(result)}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                  selectedCard?.id === result.id ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {result.subject?.subjectName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.stdClass?.className}
                      {result.batch?.name ? ` · ${result.batch?.name}` : ''}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {result.week} · {result.month} {result.year}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteWeek(e, result)}
                    className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete this week's data"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyResultTable;
