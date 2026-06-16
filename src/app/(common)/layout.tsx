import Footer from "@/src/components/shared/Footer";
import Navber from "@/src/components/shared/Navber";
import Topber from "@/src/components/shared/Topber";
import Topnoticebar from "@/src/components/topnoticebar";

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navber />
      <Topnoticebar />
      {children}
      <Footer />
    </div>
  );
};

export default CommonLayout;
