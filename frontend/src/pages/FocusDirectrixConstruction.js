import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Play, Pause, RotateCcw } from "lucide-react";

export default function FocusDirectrixConstruction() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    "Draw the directrix line AB",
    "Mark focus point F at distance from directrix",
    "Draw axis perpendicular to directrix through F",
    "Mark points on axis using eccentricity ratio (e = 2/3)",
    "Draw construction lines from F at various angles",
    "For each line, mark point P such that PF/PM = e",
    "Connect all points to form the ellipse"
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

    // Setup parameters
    const centerX = width / 2;
    const centerY = height / 2;
    const directrixX = centerX - 250;
    const focusX = centerX + 50;
    const focusY = centerY;
    const eccentricity = 2 / 3;

    // Step 0: Draw directrix
    if (currentStep >= 0 || !showSteps) {
      ctx.strokeStyle = "#4f46e5";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(directrixX, centerY - 200);
      ctx.lineTo(directrixX, centerY + 200);
      ctx.stroke();

      ctx.fillStyle = "#4f46e5";
      ctx.font = "14px Inter";
      ctx.fillText("Directrix", directrixX - 60, centerY - 210);
    }

    // Step 1: Draw focus
    if (currentStep >= 1 || !showSteps) {
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(focusX, focusY, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("F (Focus)", focusX + 10, focusY - 10);
    }

    // Step 2: Draw axis
    if (currentStep >= 2 || !showSteps) {
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(directrixX, centerY);
      ctx.lineTo(centerX + 300, centerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Step 3-6: Draw construction and ellipse
    if (currentStep >= 3 || !showSteps) {
      const points = [];
      const numPoints = 36;

      for (let i = 0; i < numPoints; i++) {
        const angle = (i * 2 * Math.PI) / numPoints;
        const dirX = Math.cos(angle);
        const dirY = Math.sin(angle);

        // Find point P such that PF/PM = eccentricity
        for (let r = 10; r < 400; r += 1) {
          const px = focusX + dirX * r;
          const py = focusY + dirY * r;

          const pf = Math.sqrt((px - focusX) ** 2 + (py - focusY) ** 2);
          const pm = Math.abs(px - directrixX);

          if (Math.abs(pf / pm - eccentricity) < 0.01) {
            points.push({ x: px, y: py });
            break;
          }
        }
      }

      // Draw construction lines (only if showing steps)
      if (showSteps && currentStep >= 4) {
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 0.5;
        points.slice(0, Math.min(8, points.length)).forEach((point) => {
          ctx.beginPath();
          ctx.moveTo(focusX, focusY);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();

          // Draw perpendicular to directrix
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(directrixX, point.y);
          ctx.stroke();
        });
      }

      // Draw ellipse
      if (currentStep >= 6 || !showSteps) {
        ctx.strokeStyle = "#7c3aed";
        ctx.lineWidth = 3;
        ctx.beginPath();
        points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.closePath();
        ctx.stroke();
      }
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
                  Focus and Directrix Method - Ellipse Construction
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
                    className={showSteps ? "bg-indigo-600 hover:bg-indigo-700" : ""}
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
                              ? "bg-indigo-100 border-l-4 border-indigo-600"
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
                  To construct an ellipse using the <strong>Focus and Directrix method</strong> when
                  the distance of the focus from the directrix and eccentricity are given.
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
                    <strong>Eccentricity (e):</strong> 2/3
                  </div>
                  <div>
                    <strong>Distance from Focus to Directrix:</strong> 120 mm
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Note:</strong> For an ellipse, the eccentricity is always less than 1.
                      The ratio PF/PM = e, where P is any point on the ellipse, F is the focus, and M
                      is the foot of perpendicular from P to the directrix.
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
                  An ellipse is defined as the locus of a point that moves such that its distance from
                  a fixed point (focus) bears a constant ratio (eccentricity) to its perpendicular
                  distance from a fixed straight line (directrix). This ratio is less than 1 for an
                  ellipse.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
