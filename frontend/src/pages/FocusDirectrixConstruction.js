import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Play, Pause, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";

export default function FocusDirectrixConstruction() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    "Draw directrix AB of any length, mark midpoint R, draw horizontal line from R to the right",
    "From R, mark point V at 39mm and point F at 65mm on the horizontal line",
    "Draw perpendicular line from V: VV'(upwards) = VV*(downwards) = VF (26mm)",
    "Draw two angled lines from R passing through V' and V* extending to the construction area",
    "Draw 16 parallel lines to V'V* at 10mm intervals touching the angled lines",
    "Number intersection points: 1',2',3'... (downward) and 1,2,3... (upward)",
    "Mark horizontal line intersections as V1, V2, V3... V16 next to V",
    "Using compass: radius V1-to-1, center at F, mark arcs on lines V1-1 and V1-1'",
    "Repeat with radius V2-to-2, center at F, mark arcs on V2-2 and V2-2'",
    "Continue for V3, V4, V5... till V16 with respective radii",
    "Connect all arc points including point V with smooth curve to form complete ellipse"
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

    // Setup parameters based on exact specifications
    const scale = 3.0; // pixels per mm (adjusted for larger 1000px canvas)
    const centerX = 180;
    const centerY = height / 2;
    
    // Given measurements in mm
    const AB_length = 200 * scale;
    const R_to_V = 39 * scale;
    const R_to_F = 65 * scale;
    const V_perpendicular = 26 * scale;
    const angled_line_length = 270 * scale;
    const num_parallel_lines = 16; // Updated to 16
    const parallel_spacing = 10 * scale;

    // Key points
    const pointR_x = centerX;
    const pointR_y = centerY;
    const pointV_x = pointR_x + R_to_V;
    const pointV_y = pointR_y;
    const pointF_x = pointR_x + R_to_F;
    const pointF_y = pointR_y;
    const pointV_prime_x = pointV_x;
    const pointV_prime_y = pointV_y - V_perpendicular;
    const pointV_star_x = pointV_x;
    const pointV_star_y = pointV_y + V_perpendicular;

    // Calculate angle for lines from R through V' and V*
    const angle_up = Math.atan2(pointV_prime_y - pointR_y, pointV_prime_x - pointR_x);
    const angle_down = Math.atan2(pointV_star_y - pointR_y, pointV_star_x - pointR_x);

    // Step 0: Draw directrix AB
    if (currentStep >= 0 || !showSteps) {
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pointR_x, pointR_y - AB_length/2);
      ctx.lineTo(pointR_x, pointR_y + AB_length/2);
      ctx.stroke();

      ctx.fillStyle = "#f43f5e";
      ctx.font = "14px Inter";
      ctx.fillText("A", pointR_x - 20, pointR_y - AB_length/2 - 5);
      ctx.fillText("B", pointR_x - 20, pointR_y + AB_length/2 + 15);
      ctx.fillText("R", pointR_x - 20, pointR_y + 5);
      
      // Draw horizontal line from R
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pointR_x, pointR_y);
      ctx.lineTo(pointR_x + 600, pointR_y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Step 1: Mark points V and F
    if (currentStep >= 1 || !showSteps) {
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(pointV_x, pointV_y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("V", pointV_x, pointV_y - 10);

      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(pointF_x, pointF_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("F", pointF_x, pointF_y - 10);
    }

    // Step 2: Draw perpendicular from V
    if (currentStep >= 2 || !showSteps) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pointV_prime_x, pointV_prime_y);
      ctx.lineTo(pointV_star_x, pointV_star_y);
      ctx.stroke();

      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(pointV_prime_x, pointV_prime_y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("V'", pointV_prime_x + 10, pointV_prime_y);

      ctx.beginPath();
      ctx.arc(pointV_star_x, pointV_star_y, 4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("V*", pointV_star_x + 10, pointV_star_y);
    }

    // Step 3: Draw angled lines from R
    const angle_line_end_up_x = pointR_x + angled_line_length * Math.cos(angle_up);
    const angle_line_end_up_y = pointR_y + angled_line_length * Math.sin(angle_up);
    const angle_line_end_down_x = pointR_x + angled_line_length * Math.cos(angle_down);
    const angle_line_end_down_y = pointR_y + angled_line_length * Math.sin(angle_down);

    if (currentStep >= 3 || !showSteps) {
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pointR_x, pointR_y);
      ctx.lineTo(angle_line_end_up_x, angle_line_end_up_y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pointR_x, pointR_y);
      ctx.lineTo(angle_line_end_down_x, angle_line_end_down_y);
      ctx.stroke();
    }

    // Calculate intersection points and ellipse points
    const ellipsePoints = [];
    const intersectionPointsUp = [];
    const intersectionPointsDown = [];
    const vPoints = [];

    for (let i = 1; i <= num_parallel_lines; i++) {
      const offset = pointV_x + i * parallel_spacing;
      vPoints.push({ x: offset, y: pointR_y });

      // Find intersection with upward angled line
      const t_up = (offset - pointR_x) / (angled_line_length * Math.cos(angle_up));
      const intersect_up_y = pointR_y + t_up * angled_line_length * Math.sin(angle_up);
      intersectionPointsUp.push({ x: offset, y: intersect_up_y, num: i });

      // Find intersection with downward angled line
      const t_down = (offset - pointR_x) / (angled_line_length * Math.cos(angle_down));
      const intersect_down_y = pointR_y + t_down * angled_line_length * Math.sin(angle_down);
      intersectionPointsDown.push({ x: offset, y: intersect_down_y, num: i });
    }

    // Step 4: Draw parallel lines
    if (currentStep >= 4 || !showSteps) {
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      for (let i = 0; i < num_parallel_lines; i++) {
        const x = vPoints[i].x;
        ctx.beginPath();
        ctx.moveTo(x, intersectionPointsUp[i].y - 20);
        ctx.lineTo(x, intersectionPointsDown[i].y + 20);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Step 5-6: Mark and number intersection points
    if (currentStep >= 5 || !showSteps) {
      ctx.fillStyle = "#6366f1";
      ctx.font = "11px Inter";
      
      intersectionPointsUp.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        if (i % 2 === 0) ctx.fillText(point.num.toString(), point.x + 8, point.y - 5);
      });

      intersectionPointsDown.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        if (i % 2 === 0) ctx.fillText(point.num + "'", point.x + 8, point.y + 12);
      });
    }

    // Step 7: Mark V points
    if (currentStep >= 6 || !showSteps) {
      ctx.fillStyle = "#10b981";
      ctx.font = "11px Inter";
      vPoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
        if (i % 2 === 0) ctx.fillText("V" + (i+1), point.x - 5, point.y + 15);
      });
    }

    // Step 8-10: Draw arcs using compass method
    if (currentStep >= 7 || !showSteps) {
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < num_parallel_lines; i++) {
        // Calculate radius from Vi to i
        const radius = Math.sqrt(
          Math.pow(intersectionPointsUp[i].x - vPoints[i].x, 2) +
          Math.pow(intersectionPointsUp[i].y - vPoints[i].y, 2)
        );

        // Draw arc centered at F
        // Find intersection points on the lines
        const angle_to_up = Math.atan2(intersectionPointsUp[i].y - pointF_y, intersectionPointsUp[i].x - pointF_x);
        const angle_to_down = Math.atan2(intersectionPointsDown[i].y - pointF_y, intersectionPointsDown[i].x - pointF_x);

        // Calculate ellipse points
        const dist_F_to_line = vPoints[i].x - pointF_x;
        const ellipse_y_up = Math.sqrt(Math.max(0, radius * radius - dist_F_to_line * dist_F_to_line));
        const ellipse_y_down = -ellipse_y_up;

        if (!isNaN(ellipse_y_up)) {
          ellipsePoints.push({ x: vPoints[i].x, y: pointF_y - ellipse_y_up });
          ellipsePoints.push({ x: vPoints[i].x, y: pointF_y - ellipse_y_down });

          // Draw small arcs showing compass marks
          if (showSteps && currentStep >= 7 && i < 5) {
            ctx.beginPath();
            ctx.arc(pointF_x, pointF_y, radius, angle_to_up - 0.1, angle_to_up + 0.1);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(pointF_x, pointF_y, radius, angle_to_down - 0.1, angle_to_down + 0.1);
            ctx.stroke();
          }
        }
      }

      // Add point V to close the ellipse
      ellipsePoints.push({ x: pointV_x, y: pointV_y });

      // Mark ellipse points
      if (currentStep >= 8 || !showSteps) {
        ctx.fillStyle = "#dc2626";
        ellipsePoints.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    }

    // Step 11: Draw final ellipse
    if (currentStep >= 10 || !showSteps) {
      // Separate points into upper and lower halves for better smoothing
      const upperPoints = [];
      const lowerPoints = [];
      
      ellipsePoints.forEach(point => {
        if (point.y <= pointR_y) {
          upperPoints.push(point);
        } else {
          lowerPoints.push(point);
        }
      });
      
      // Sort points
      upperPoints.sort((a, b) => a.x - b.x);
      lowerPoints.sort((a, b) => b.x - a.x);
      
      // Add point V at both ends for closure
      const allPoints = [...upperPoints, ...lowerPoints];
      
      ctx.strokeStyle = "#ec4899";
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      if (allPoints.length > 2) {
        // Start at first point
        ctx.moveTo(allPoints[0].x, allPoints[0].y);
        
        // Draw smooth curve using Catmull-Rom to Bezier conversion
        for (let i = 0; i < allPoints.length; i++) {
          const p0 = allPoints[(i - 1 + allPoints.length) % allPoints.length];
          const p1 = allPoints[i];
          const p2 = allPoints[(i + 1) % allPoints.length];
          const p3 = allPoints[(i + 2) % allPoints.length];
          
          // Catmull-Rom to Bezier control points
          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();

      // Label
      ctx.fillStyle = "#ec4899";
      ctx.font = "bold 16px Inter";
      ctx.fillText("ELLIPSE", pointR_x + 350, centerY - 100);
      ctx.font = "12px Inter";
      ctx.fillText("(Complete curve through V)", pointR_x + 350, centerY - 80);
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            data-testid="back-btn"
            variant="outline"
            onClick={() => navigate("/methods")}
            className="inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Practical 2
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
                    width={1200}
                    height={700}
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
                    className={showSteps ? "bg-rose-500 hover:bg-rose-600" : ""}
                  >
                    {showSteps ? "Hide Steps" : "Show Step-by-Step"}
                  </Button>

                  {showSteps && (
                    <>
                      <Button
                        data-testid="prev-step-btn"
                        onClick={prevStep}
                        variant="outline"
                        disabled={currentStep === 0}
                        className="inline-flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Previous Step
                      </Button>

                      <Button
                        data-testid="next-step-btn"
                        onClick={nextStep}
                        variant="outline"
                        disabled={currentStep === steps.length - 1}
                        className="inline-flex items-center gap-2"
                      >
                        Next Step <Play className="w-4 h-4" />
                      </Button>

                      <Button
                        data-testid="reset-btn"
                        onClick={resetAnimation}
                        variant="outline"
                        className="inline-flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> Reset
                      </Button>
                      
                      <div className="flex items-center px-4 py-2 bg-rose-50 rounded-lg">
                        <span className="text-sm font-medium text-rose-700">
                          Step {currentStep + 1} of {steps.length}
                        </span>
                      </div>
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
                              ? "bg-rose-100 border-l-4 border-rose-600"
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
                  To construct an ellipse using the <strong>Focus and Directrix method</strong> with
                  compass and straightedge, following the geometric construction steps with specific
                  measurements and parallel line intersections.
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
                    <strong>Directrix AB length:</strong> Any length
                  </div>
                  <div>
                    <strong>Distance R to F:</strong> 65 mm (Focus)
                  </div>
                  <div>
                    <strong>Eccentricity given:</strong> 2/3
                  </div>
                  <div>
                    <strong>Number of parallel lines:</strong> 16 lines at 10 mm spacing
                  </div>
                  <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Method:</strong> This construction uses the focus-directrix property where
                      each point on the ellipse maintains a constant ratio of distances (eccentricity).
                      The compass method with parallel lines provides accurate point locations that are
                      then connected to form the smooth ellipse curve.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl" style={{ fontFamily: "'Spectral', serif" }}>
                  Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <div className="space-y-2">
                    <p><strong>1) RF = 65mm</strong></p>
                    <p className="pl-4">To find V: VF/RV = 2/3</p>
                    <p className="pl-4">2x + 3x = 65</p>
                    <p className="pl-4">5x = 65</p>
                    <p className="pl-4">x = 13</p>
                    <p className="pl-4"><strong>So, VF = 26mm and RV = 39mm</strong></p>
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
