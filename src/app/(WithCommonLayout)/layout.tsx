import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { FavoritesProvider } from "@/context/FavoritesContext";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <FavoritesProvider>
    <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </FavoritesProvider>
     
    </>
  );
};

export default CommonLayout;
