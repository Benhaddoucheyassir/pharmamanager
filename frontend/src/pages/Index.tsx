import { Navbar } from "../components/Navbar";
import { Hero } from "../components/Hero";
import { FeatureBento } from "../components/FeatureBento";
import { Dashboard } from "../components/Dashboard";
import { Footer } from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main>
        <h1 className="sr-only">PharmaStream — Next-Gen Pharmacy Management System</h1>
        <Hero />
        <FeatureBento />
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
