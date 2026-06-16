import React from "react";

const PageHeader = ({ title = "আমাদের সম্পর্কে", breadcrumbs = ["Home", "আমাদের সম্পর্কে"] }) => {
  return (
    <div className="relative w-full overflow-hidden bg-[#f5f3ef] flex flex-col items-center justify-center py-10 px-6 min-h-35">

      {/* Left orange blob */}
      <div
        className="absolute -left-8 -top-6 w-48 h-40 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, #f5c49a 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />

      {/* Right orange blob */}
      <div
        className="absolute -right-8 -bottom-6 w-48 h-40 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, #f5c49a 0%, transparent 70%)",
          opacity: 0.5,
        }}
      />

      {/* Left teal concentric circles */}
      <div className="absolute left-20 top-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="absolute rounded-full border-2 border-[#5DCAA5]"
          style={{ width: 42, height: 42, top: -21, left: -21, opacity: 0.55 }}
        />
        <div
          className="absolute rounded-full border border-[#5DCAA5]"
          style={{ width: 24, height: 24, top: -12, left: -12, opacity: 0.35 }}
        />
      </div>

      {/* Title */}
      <h1 className="relative z-10 text-2xl font-bold text-gray-900 mb-3 tracking-tight text-center">
        {title}
      </h1>

      {/* Breadcrumb */}
      <nav className="relative z-10 flex items-center gap-1.5" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index === 0 ? (
              <span className="bg-[#ede8e0] text-[#5a5248] text-sm px-4 py-1 rounded-full">
                {crumb}
              </span>
            ) : (
              <span className="text-[#5a5248] text-sm">{crumb}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <span className="text-gray-400 text-sm flex items-center -mx-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M3 2l3 3-3 3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="-ml-1.5">
                  <path d="M3 2l3 3-3 3" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default PageHeader;