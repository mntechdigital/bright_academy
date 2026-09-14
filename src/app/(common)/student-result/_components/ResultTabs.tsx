import TabButton from "./TabButton";

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function ResultTabs({
  activeTab,
  onChange,
}: {
  activeTab: "monthly" | "weekly";
  onChange: (tab: "monthly" | "weekly") => void;
}) {
  return (
    <div className="flex items-center gap-2 mb-4 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-100 w-fit">
      <TabButton
        active={activeTab === "monthly"}
        onClick={() => onChange("monthly")}
      >
        Monthly Results
      </TabButton>
      <TabButton
        active={activeTab === "weekly"}
        onClick={() => onChange("weekly")}
      >
        Weekly Marks
      </TabButton>
    </div>
  );
}

export default ResultTabs;