// Renders HTML safely for blog description
import React from "react";

interface HtmlConverterProps {
    html: string;
    className?: string;
    clamp?: number; // number of lines to clamp, or undefined for no clamp
}

const HtmlConverter = ({ html, className, clamp }: HtmlConverterProps) => {
    const clampClass = clamp ? `line-clamp-${clamp}` : '';
    const defaultClass = "prose prose-sm prose-slate";
    
    return React.createElement("div", {
        className: `${defaultClass} ${clampClass} ${className || ''}`.trim(),
        dangerouslySetInnerHTML: { __html: html }
    });
};

export default HtmlConverter;