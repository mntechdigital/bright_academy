
import Footer from "../../../src/components/shared/Footer";
import Navber from '../../../src/components/shared/Navber'

const CommonLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navber />
      {children}
      <Footer />
    </div>
  );
};

export default CommonLayout;
