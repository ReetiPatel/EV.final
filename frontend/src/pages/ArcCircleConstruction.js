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

    const scale = 3.77; // pixels per mm
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Given: A and B are 100mm apart, C is 75mm from A and 60mm from B
    const AB_distance = 100 * scale;
    const AC_distance = 75 * scale;
    const BC_distance = 60 * scale;
    
    // Position A and B
    const pointA_x = centerX - AB_distance / 2;
    const pointA_y = centerY + 80;
    const pointB_x = centerX + AB_distance / 2;
    const pointB_y = centerY + 80;
    
    // Calculate position of C using trilateration
    // C is at intersection of circles: one centered at A (r=75mm), one at B (r=60mm)
    const d = AB_distance;
    const r1 = AC_distance;
    const r2 = BC_distance;
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r1 * r1 - a * a);
    const pointC_x = pointA_x + a;
    const pointC_y = pointA_y - h;
    
    // Calculate ellipse parameters
    // For ellipse through A, B, C with A and B on major axis
    const majorRadius = AB_distance / 2; // semi-major axis
    const minorRadius = h; // semi-minor axis (height from AB to C)
    const numDivisions = 12;

    // Step 0: Mark points A and B
    if (currentStep >= 0 || !showSteps) {
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath();
      ctx.arc(pointA_x, pointA_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("A", pointA_x - 15, pointA_y + 5);
      
      ctx.beginPath();
      ctx.arc(pointB_x, pointB_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("B", pointB_x + 10, pointB_y + 5);
      
      // Draw line AB
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pointA_x, pointA_y);
      ctx.lineTo(pointB_x, pointB_y);
      ctx.stroke();
      ctx.fillText("100 mm", centerX - 20, pointA_y + 20);
    }

    // Step 1-2: Draw construction arcs from A and B
    if (showSteps && currentStep >= 1 && currentStep <= 3) {
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      // Arc from A
      ctx.beginPath();
      ctx.arc(pointA_x, pointA_y, AC_distance, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Arc from B
      ctx.beginPath();
      ctx.arc(pointB_x, pointB_y, BC_distance, 0, 2 * Math.PI);
      ctx.stroke();
      
      ctx.setLineDash([]);
    }

    // Step 3: Mark point C
    if (currentStep >= 3 || !showSteps) {
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(pointC_x, pointC_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#374151";
      ctx.fillText("C (75mm from A, 60mm from B)", pointC_x + 10, pointC_y - 10);
    }

    // Step 4-5: Draw concentric circles
    if (currentStep >= 4 || !showSteps) {
      // Outer circle (semi-major axis)
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, majorRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Inner circle (semi-minor axis)
      ctx.strokeStyle = "#8b5cf6";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, minorRadius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Step 5: Draw axes
    if (currentStep >= 5 || !showSteps) {
      ctx.strokeStyle = "#6b7280";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      // Horizontal axis
      ctx.beginPath();
      ctx.moveTo(centerX - majorRadius - 20, centerY);
      ctx.lineTo(centerX + majorRadius + 20, centerY);
      ctx.stroke();

      // Vertical axis
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - minorRadius - 20);
      ctx.lineTo(centerX, centerY + minorRadius + 20);
      ctx.stroke();

      ctx.setLineDash([]);
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
      });
      innerPoints.push({
        x: centerX + minorRadius * Math.cos(angle),
        y: centerY + minorRadius * Math.sin(angle),
      });
      ellipsePoints.push({
        x: centerX + majorRadius * Math.cos(angle),
        y: centerY + minorRadius * Math.sin(angle),
      });
    }

    // Step 6: Mark division points
    if (currentStep >= 6 || !showSteps) {
      ctx.fillStyle = "#3b82f6";
      outerPoints.forEach((point, i) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.fillStyle = "#8b5cf6";
      innerPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Step 7: Draw construction lines
    if (currentStep >= 7 || !showSteps) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      for (let i = 0; i < numDivisions; i++) {
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

    // Step 8: Mark intersection points
    if (currentStep >= 8 || !showSteps) {
      ctx.fillStyle = "#dc2626";
      ellipsePoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Step 9: Draw final ellipse
    if (currentStep >= 9 || !showSteps) {
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

    // Step 10: Draw tangent and normal at C
    if (currentStep >= 10 || !showSteps) {
      // Calculate tangent slope at C
      // For ellipse: (x/a)² + (y/b)² = 1, slope = -(b²x)/(a²y)
      const relC_x = pointC_x - centerX;
      const relC_y = pointC_y - centerY;
      const tangentSlope = -(minorRadius * minorRadius * relC_x) / (majorRadius * majorRadius * relC_y);
      
      // Draw tangent line
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      const tangentLength = 150;
      const tangentAngle = Math.atan(tangentSlope);
      ctx.beginPath();
      ctx.moveTo(pointC_x - tangentLength * Math.cos(tangentAngle), 
                 pointC_y - tangentLength * Math.sin(tangentAngle));
      ctx.lineTo(pointC_x + tangentLength * Math.cos(tangentAngle), 
                 pointC_y + tangentLength * Math.sin(tangentAngle));
      ctx.stroke();
      
      ctx.fillStyle = "#10b981";
      ctx.fillText("Tangent", pointC_x + tangentLength * Math.cos(tangentAngle) - 40, 
                   pointC_y + tangentLength * Math.sin(tangentAngle) - 10);
      
      // Draw normal (perpendicular to tangent)
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 2;
      const normalAngle = tangentAngle + Math.PI / 2;
      const normalLength = 100;
      ctx.beginPath();
      ctx.moveTo(pointC_x - normalLength * Math.cos(normalAngle), 
                 pointC_y - normalLength * Math.sin(normalAngle));
      ctx.lineTo(pointC_x + normalLength * Math.cos(normalAngle), 
                 pointC_y + normalLength * Math.sin(normalAngle));
      ctx.stroke();
      
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("Normal", pointC_x + normalLength * Math.cos(normalAngle) - 10, 
                   pointC_y + normalLength * Math.sin(normalAngle) + 20);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-8 px-4">
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
                    className={showSteps ? "bg-pink-500 hover:bg-pink-600" : ""}
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
                              ? "bg-pink-100 border-l-4 border-pink-600"
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
                  To construct an ellipse passing through a given point C using the{" "}
                  <strong>Arc of Circle method</strong> (Concentric Circle method), where point C is
                  located using its distances from two fixed points A and B. Also draw the tangent and
                  normal at point C.
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
                    <strong>Points A and B:</strong> 100 mm apart
                  </div>
                  <div>
                    <strong>Distance AC:</strong> 75 mm
                  </div>
                  <div>
                    <strong>Distance BC:</strong> 60 mm
                  </div>
                  <div>
                    <strong>Construction:</strong> Ellipse must pass through point C
                  </div>
                  <div>
                    <strong>Additional:</strong> Draw tangent and normal at C
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Method:</strong> First locate point C using the given distances. Then
                      construct the ellipse using concentric circles method where A and B lie on the
                      major axis. The major and minor axes are calculated from the triangle geometry.
                      Finally, draw the tangent (touching the curve at C) and normal (perpendicular to
                      tangent at C).
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
