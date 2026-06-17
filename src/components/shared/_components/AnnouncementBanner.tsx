export default function AnnouncementBanner() {
  const announcements = [
    'নতুন ব্যাচ শুরু হচ্ছে! ভর্তি চলছে। সীমিত আসন।',
    '📞 কল করুন: ০১৭১৬৬১১২০৮',
  ];

  return (
    <div className="w-full bg-orange-500 py-2.5">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6">
        <div className="simple-marquee flex min-w-max items-center text-sm font-medium text-white">
          {[...announcements, ...announcements].map((announcement, index) => (
            <span key={`${announcement}-${index}`} className="mx-6 whitespace-nowrap">
              {announcement}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}