import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Play, Pause, RotateCcw } from "lucide-react";

export default function ArcCircleConstruction() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    "Mark points A and B, 100 mm apart",
    "Using compass, draw arc from A with radius 75 mm",
    "Draw arc from B with radius 60 mm",
    "Mark intersection point C where both arcs meet",
    "Calculate major and minor axes from triangle geometry",
    "Draw two concentric circles with calculated radii",
    "Divide circles into equal parts and mark division points",
    "Draw vertical lines from outer circle and horizontal from inner circle",
    "Mark intersection points - these form the ellipse",
    "Join all points with smooth curve passing through C",
    "Draw tangent and normal at point C"
  ];

  useEffect(() => {
    drawConstruction();
  }, [currentStep, showSteps]);

  const drawConstruction = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const majorRadius = 200;
    const minorRadius = 120;
    const numDivisions = 12;

    // Step 0: Draw concentric circles
    if (currentStep >= 0 || !showSteps) {
      // Outer circle
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, majorRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Inner circle
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, minorRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Step 1: Draw axes
    if (currentStep >= 1 || !showSteps) {
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Major axis (horizontal)
      ctx.beginPath();
      ctx.moveTo(centerX - majorRadius - 20, centerY);
      ctx.lineTo(centerX + majorRadius + 20, centerY);
      ctx.stroke();

      // Minor axis (vertical)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - minorRadius - 20);
      ctx.lineTo(centerX, centerY + minorRadius + 20);
      ctx.stroke();

      ctx.setLineDash([]);

      // Labels
      ctx.fillStyle = "#374151";
      ctx.font = "14px Inter";
      ctx.fillText("A", centerX - majorRadius - 30, centerY + 5);
      ctx.fillText("B", centerX + majorRadius + 20, centerY + 5);
      ctx.fillText("C", centerX - 5, centerY - minorRadius - 25);
      ctx.fillText("D", centerX - 5, centerY + minorRadius + 35);
    }

    // Calculate division points
    const outerPoints = [];
    const innerPoints = [];
    const ellipsePoints = [];

    for (let i = 0; i < numDivisions; i++) {
      const angle = (i * 2 * Math.PI) / numDivisions;
      outerPoints.push({
        x: centerX + majorRadius * Math.cos(angle),
        y: centerY + majorRadius * Math.sin(angle),
        angle: angle,
      });
      innerPoints.push({
        x: centerX + minorRadius * Math.cos(angle),
        y: centerY + minorRadius * Math.sin(angle),
        angle: angle,
      });

      // Calculate ellipse point
      ellipsePoints.push({
        x: centerX + majorRadius * Math.cos(angle),
        y: centerY + minorRadius * Math.sin(angle),
      });
    }

    // Step 2: Mark division points
    if (currentStep >= 2 || !showSteps) {
      ctx.fillStyle = "#3b82f6";
      outerPoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();

        if (i % 3 === 0 && i > 0) {
          ctx.font = "12px Inter";
          const offsetX = point.x > centerX ? 10 : -20;
          const offsetY = point.y > centerY ? 15 : -10;
          ctx.fillText(i.toString(), point.x + offsetX, point.y + offsetY);
        }
      });

      ctx.fillStyle = "#8b5cf6";
      innerPoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Step 3-5: Draw construction lines
    if (currentStep >= 4 || !showSteps) {
      const maxLines = showSteps ? Math.min(currentStep - 2, numDivisions) : numDivisions;

      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      for (let i = 0; i < maxLines; i++) {
        // Vertical line from outer point
        ctx.beginPath();
        ctx.moveTo(outerPoints[i].x, centerY);
        ctx.lineTo(outerPoints[i].x, outerPoints[i].y);
        ctx.stroke();

        // Horizontal line from inner point
        ctx.beginPath();
        ctx.moveTo(centerX, innerPoints[i].y);
        ctx.lineTo(innerPoints[i].x, innerPoints[i].y);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }

    // Step 6: Mark intersection points
    if (currentStep >= 6 || !showSteps) {
      ctx.fillStyle = "#dc2626";
      ellipsePoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Step 7: Draw final ellipse
    if (currentStep >= 7 || !showSteps) {
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ellipsePoints.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.stroke();
    }
  };

  const handleStepAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            data-testid="back-btn"
            variant="outline"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl" style={{ fontFamily: "'Spectral', serif" }}>
                  Arc of Circle Method - Ellipse Construction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="w-full border border-gray-200 rounded"
                    data-testid="construction-canvas"
                  />
                </div>

                <div className="mt-6 flex gap-4">
                  <Button
                    data-testid="toggle-steps-btn"
                    onClick={() => {
                      setShowSteps(!showSteps);
                      if (!showSteps) setCurrentStep(0);
                    }}
                    variant={showSteps ? "default" : "outline"}
                    className={showSteps ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    {showSteps ? "Hide Steps" : "Show Step-by-Step"}
                  </Button>

                  {showSteps && (
                    <>
                      <Button
                        data-testid="animate-btn"
                        onClick={handleStepAnimation}
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        {isAnimating ? (
                          <>
                            <Pause className="w-4 h-4" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" /> Animate
                          </>
                        )}
                      </Button>

                      <Button
                        data-testid="reset-btn"
                        onClick={resetAnimation}
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Reset
                      </Button>
                    </>
                  )}
                </div>

                {showSteps && (
                  <div className="mt-6">
                    <div className="space-y-2">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          data-testid={`step-${index}`}
                          className={`p-3 rounded-lg transition-all duration-300 ${
                            index <= currentStep
                              ? "bg-purple-100 border-l-4 border-purple-600"
                              : "bg-gray-50"
                          }`}
                        >
                          <span className="font-semibold mr-2">Step {index + 1}:</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Spectral', serif" }}>
                  Aim
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  To construct an ellipse using the <strong>Arc of Circle method</strong> (also known
                  as Concentric Circle method) when the major and minor axes are given.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Spectral', serif" }}>
                  Given Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-700">
                  <div>
                    <strong>Major Axis (AB):</strong> 100 mm
                  </div>
                  <div>
                    <strong>Minor Axis (CD):</strong> 60 mm
                  </div>
                  <div>
                    <strong>Semi-Major Axis (a):</strong> 50 mm
                  </div>
                  <div>
                    <strong>Semi-Minor Axis (b):</strong> 30 mm
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> This method uses two concentric circles with radii equal
                      to the semi-major and semi-minor axes. Points on the ellipse are found by the
                      intersection of horizontal and vertical lines from corresponding division points.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Spectral', serif" }}>
                  Theory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">
                  An ellipse is a closed curve where the sum of distances from any point on the curve to
                  two fixed points (foci) is constant. The arc of circle method is one of the simplest
                  ways to construct an ellipse geometrically using compass and straightedge. It's based
                  on the principle that coordinates of points on an ellipse can be derived from two
                  concentric circles.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
