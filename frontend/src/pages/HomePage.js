import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-800" style={{ fontFamily: "'Spectral', serif" }}>
            Engineering Drawing
          </h1>
          <p className="text-lg sm:text-xl text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            Ellipse Construction Methods
          </p>
        </div>
        
        <div className="pt-8">
          <Button
            data-testid="practical-2-btn"
            onClick={() => navigate("/methods")}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-6 text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Practical 2
          </Button>
        </div>

        <div className="pt-12 text-sm text-gray-500">
          <p>College Project - Geometry & Engineering Graphics</p>
        </div>
      </div>
    </div>
  );
}
