import React from "react";
import PageHeader from "../../_components/PageHeader";
import Link from "next/link";
import newsData from "@/src/data/news.json";

const page = ({ params }: { params: { id: string } }) => {
  const newsItem = (newsData as any[]).find((item: any) => item.id === params.id);

  if (!newsItem) {
    return (
      <>
        <PageHeader
          title="সংবাদ বিস্তারিত"
          breadcrumbs={["Home", "সংবাদ", "বিস্তারিত"]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">সংবাদটি খুঁজে পাওয়া যায়নি।</p>
          <div className="text-center mt-4">
            <Link
              href="/news"
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              ← সব সংবাদ দেখুন
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="সংবাদ বিস্তারিত"
        breadcrumbs={["Home", "সংবাদ", "বিস্তারিত"]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-bold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                {newsItem.badge}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {newsItem.title}
            </h1>
            <div className="h-px bg-gray-200 mb-6" />
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {newsItem.content || newsItem.description}
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
          >
            ← সব সংবাদ দেখুন
          </Link>
        </div>
      </div>
    </>
  );
};

export default page;
