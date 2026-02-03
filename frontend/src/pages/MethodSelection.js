import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Focus, CircleDot } from "lucide-react";

export default function MethodSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Spectral', serif" }}>
            Choose Construction Method
          </h1>
          <p className="text-lg text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            Select the ellipse construction method you want to explore
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card 
            data-testid="focus-directrix-card"
            className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-rose-400 bg-white/80 backdrop-blur-sm"
            onClick={() => navigate("/construction/focus-directrix")}
          >
            <CardHeader>
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <Focus className="w-8 h-8 text-rose-600" />
              </div>
              <CardTitle className="text-2xl" style={{ fontFamily: "'Spectral', serif" }}>
                Focus and Directrix Method
              </CardTitle>
              <CardDescription className="text-base">
                Construct an ellipse using focus point and directrix line with eccentricity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                data-testid="focus-directrix-btn"
                className="w-full bg-rose-500 hover:bg-rose-600"
                onClick={() => navigate("/construction/focus-directrix")}
              >
                View Construction
              </Button>
            </CardContent>
          </Card>

          <Card 
            data-testid="arc-circle-card"
            className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-pink-400 bg-white/80 backdrop-blur-sm"
            onClick={() => navigate("/construction/arc-circle")}
          >
            <CardHeader>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <CircleDot className="w-8 h-8 text-pink-600" />
              </div>
              <CardTitle className="text-2xl" style={{ fontFamily: "'Spectral', serif" }}>
                Arc of Circle Method
              </CardTitle>
              <CardDescription className="text-base">
                Construct an ellipse using concentric circles and arc divisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                data-testid="arc-circle-btn"
                className="w-full bg-pink-500 hover:bg-pink-600"
                onClick={() => navigate("/construction/arc-circle")}
              >
                View Construction
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            data-testid="back-to-home-btn"
            variant="outline"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
