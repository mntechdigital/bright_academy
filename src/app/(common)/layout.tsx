
import Footer from "@/src/components/shared/Footer";
import Navber from "@/src/components/shared/Navber";
import Topber from "@/src/components/shared/Topber";

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navber />
      <Topber />
      {children}
      <Footer />
    </div>
  );
};

export default CommonLayout;
