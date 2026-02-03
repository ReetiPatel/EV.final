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
    "Construct horizontal line AB of 100mm",
    "Mark point C above AB such that AC=75mm and BC=60mm, connect to form triangle ABC",
    "Draw perpendicular from midpoint O of AB: 60mm upwards and 60mm downwards",
    "From O, extend AO and BO by 17.5mm to mark endpoints A' and B'",
    "From A to O, mark 4 points at 10mm intervals, number them 1, 2, 3, 4",
    "Compass: radius A'-1 centered at A (arcs up/down), radius B'-1 at B (intersecting arcs)",
    "Compass: radius A'-2 centered at A (arcs up/down), radius B'-2 at B (intersecting arcs)",
    "Compass: radius A'-3 centered at A (arcs up/down), radius B'-3 at B (intersecting arcs)",
    "Compass: radius A'-4 centered at A (arcs up/down), radius B'-4 at B (intersecting arcs)",
    "Radius A'-O from A (arcs on vertical), radius B'-O from B (forming minor axis)",
    "Radius A'-A from both A and B, radius B'-A from both A and B (corner arcs)",
    "Connect all intersection points with smooth curve to form complete ellipse"
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

    const scale = 3.5; // pixels per mm
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Given measurements
    const AB_length = 100 * scale;
    const AC_distance = 75 * scale;
    const BC_distance = 60 * scale;
    const perpendicular_length = 60 * scale;
    const extension_length = 17.5 * scale;
    const point_spacing = 10 * scale;
    
    // Key points
    const pointA_x = centerX - AB_length / 2;
    const pointA_y = centerY + 100;
    const pointB_x = centerX + AB_length / 2;
    const pointB_y = centerY + 100;
    const pointO_x = centerX;
    const pointO_y = centerY + 100;
    
    // Calculate point C using trilateration
    const d = AB_length;
    const r1 = AC_distance;
    const r2 = BC_distance;
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(r1 * r1 - a * a);
    const pointC_x = pointA_x + a;
    const pointC_y = pointA_y - h;
    
    // Extended points
    const pointA_prime_x = pointA_x - extension_length;
    const pointA_prime_y = pointA_y;
    const pointB_prime_x = pointB_x + extension_length;
    const pointB_prime_y = pointB_y;
    
    // Step 0: Draw horizontal line AB
    if (currentStep >= 0 || !showSteps) {
      ctx.strokeStyle = "#f43f5e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pointA_x, pointA_y);
      ctx.lineTo(pointB_x, pointB_y);
      ctx.stroke();
      
      ctx.fillStyle = "#f43f5e";
      ctx.font = "14px Inter";
      ctx.beginPath();
      ctx.arc(pointA_x, pointA_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("A", pointA_x - 20, pointA_y + 5);
      
      ctx.beginPath();
      ctx.arc(pointB_x, pointB_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("B", pointB_x + 15, pointB_y + 5);
    }
    
    // Step 1: Mark point C and form triangle
    if (currentStep >= 1 || !showSteps) {
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(pointC_x, pointC_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("C", pointC_x + 10, pointC_y - 10);
      
      // Draw triangle
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pointA_x, pointA_y);
      ctx.lineTo(pointC_x, pointC_y);
      ctx.lineTo(pointB_x, pointB_y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Step 2: Draw perpendicular from O
    if (currentStep >= 2 || !showSteps) {
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(pointO_x, pointO_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("O", pointO_x - 20, pointO_y + 5);
      
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pointO_x, pointO_y - perpendicular_length);
      ctx.lineTo(pointO_x, pointO_y + perpendicular_length);
      ctx.stroke();
    }
    
    // Step 3: Mark A' and B'
    if (currentStep >= 3 || !showSteps) {
      ctx.fillStyle = "#6366f1";
      ctx.beginPath();
      ctx.arc(pointA_prime_x, pointA_prime_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("A'", pointA_prime_x - 25, pointA_prime_y + 5);
      
      ctx.beginPath();
      ctx.arc(pointB_prime_x, pointB_prime_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("B'", pointB_prime_x + 15, pointB_prime_y + 5);
    }
    
    // Step 4: Mark points 1,2,3,4 between A and O
    const markedPoints = [];
    if (currentStep >= 4 || !showSteps) {
      ctx.fillStyle = "#8b5cf6";
      ctx.font = "12px Inter";
      for (let i = 1; i <= 4; i++) {
        const point_x = pointA_x + i * point_spacing;
        const point_y = pointA_y;
        markedPoints.push({ x: point_x, y: point_y, num: i });
        
        ctx.beginPath();
        ctx.arc(point_x, point_y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(i.toString(), point_x - 5, point_y + 20);
      }
    }
    
    // Steps 5-9: Draw arcs for points 1,2,3,4
    const ellipsePoints = [];
    
    if (currentStep >= 5 || !showSteps) {
      markedPoints.forEach((point, idx) => {
        const showArcs = showSteps && currentStep >= 5 && currentStep <= 8 && currentStep - 5 === idx;
        
        // Calculate radii
        const radiusA = Math.sqrt(Math.pow(pointA_prime_x - point.x, 2) + Math.pow(pointA_prime_y - point.y, 2));
        const radiusB = Math.sqrt(Math.pow(pointB_prime_x - point.x, 2) + Math.pow(pointB_prime_y - point.y, 2));
        
        // Draw construction arcs if showing steps
        if (showArcs || (!showSteps && idx === 0)) {
          ctx.strokeStyle = "#e9d5ff";
          ctx.lineWidth = 0.5;
          ctx.setLineDash([2, 2]);
          
          // Arc from A
          ctx.beginPath();
          ctx.arc(pointA_x, pointA_y, radiusA, Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(pointA_x, pointA_y, radiusA, Math.PI * 0.2, Math.PI * 0.8);
          ctx.stroke();
          
          // Arc from B
          ctx.beginPath();
          ctx.arc(pointB_x, pointB_y, radiusB, Math.PI * 1.2, Math.PI * 1.8);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(pointB_x, pointB_y, radiusB, Math.PI * 0.2, Math.PI * 0.8);
          ctx.stroke();
          
          ctx.setLineDash([]);
        }
        
        // Calculate intersection points
        const dx = pointB_x - pointA_x;
        const dy = pointB_y - pointA_y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const a = (radiusA * radiusA - radiusB * radiusB + d * d) / (2 * d);
        const h = Math.sqrt(Math.max(0, radiusA * radiusA - a * a));
        
        const cx = pointA_x + (dx * a) / d;
        const cy = pointA_y + (dy * a) / d;
        
        const intersect1_x = cx + (h * dy) / d;
        const intersect1_y = cy - (h * dx) / d;
        const intersect2_x = cx - (h * dy) / d;
        const intersect2_y = cy + (h * dx) / d;
        
        ellipsePoints.push({ x: intersect1_x, y: intersect1_y });
        ellipsePoints.push({ x: intersect2_x, y: intersect2_y });
      });
    }
    
    // Step 10: Minor axis arcs
    if (currentStep >= 9 || !showSteps) {
      const radiusMinor = Math.sqrt(Math.pow(pointA_prime_x - pointO_x, 2) + Math.pow(pointA_prime_y - pointO_y, 2));
      
      // Intersection with vertical line
      const top_y = pointO_y - perpendicular_length;
      const bottom_y = pointO_y + perpendicular_length;
      
      ellipsePoints.push({ x: pointO_x, y: top_y });
      ellipsePoints.push({ x: pointO_x, y: bottom_y });
      
      // Draw arcs if showing steps
      if (showSteps && currentStep === 9) {
        ctx.strokeStyle = "#e9d5ff";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(pointA_x, pointA_y, radiusMinor, Math.PI * 1.3, Math.PI * 1.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pointB_x, pointB_y, radiusMinor, Math.PI * 1.3, Math.PI * 1.7);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    
    // Step 11: Corner arcs (A' to A, B' to A distances)
    if (currentStep >= 10 || !showSteps) {
      const radiusAA = Math.sqrt(Math.pow(pointA_prime_x - pointA_x, 2) + Math.pow(pointA_prime_y - pointA_y, 2));
      const radiusBA = Math.sqrt(Math.pow(pointB_prime_x - pointA_x, 2) + Math.pow(pointB_prime_y - pointA_y, 2));
      
      // Calculate intersections
      const dx = pointB_x - pointA_x;
      const d = Math.abs(dx);
      const a = (radiusAA * radiusAA - radiusBA * radiusBA + d * d) / (2 * d);
      const h = Math.sqrt(Math.max(0, radiusAA * radiusAA - a * a));
      
      ellipsePoints.push({ x: pointA_x + a, y: pointA_y - h });
      ellipsePoints.push({ x: pointA_x + a, y: pointA_y + h });
    }
    
    // Mark all ellipse points
    if (currentStep >= 8 || !showSteps) {
      ctx.fillStyle = "#dc2626";
      ellipsePoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
    
    // Step 12: Draw smooth ellipse
    if (currentStep >= 11 || !showSteps) {
      // Separate and sort points
      const upperPoints = ellipsePoints.filter(p => p.y < pointO_y).sort((a, b) => a.x - b.x);
      const lowerPoints = ellipsePoints.filter(p => p.y >= pointO_y).sort((a, b) => b.x - a.x);
      const allPoints = [...upperPoints, ...lowerPoints];
      
      if (allPoints.length > 3) {
        ctx.strokeStyle = "#ec4899";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(allPoints[0].x, allPoints[0].y);
        
        // Draw smooth curve using Catmull-Rom
        for (let i = 0; i < allPoints.length; i++) {
          const p0 = allPoints[(i - 1 + allPoints.length) % allPoints.length];
          const p1 = allPoints[i];
          const p2 = allPoints[(i + 1) % allPoints.length];
          const p3 = allPoints[(i + 2) % allPoints.length];
          
          const cp1x = p1.x + (p2.x - p0.x) / 6;
          const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6;
          const cp2y = p2.y - (p3.y - p1.y) / 6;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
        
        ctx.closePath();
        ctx.stroke();
        
        // Label
        ctx.fillStyle = "#ec4899";
        ctx.font = "bold 16px Inter";
        ctx.fillText("ELLIPSE", centerX - 50, centerY - 150);
        ctx.font = "12px Inter";
        ctx.fillText("(Smooth curve)", centerX - 50, centerY - 130);
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
                    width={1000}
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
                  To construct an ellipse using the <strong>Arc of Circle method</strong> with compass
                  technique, where point C helps establish the ellipse geometry through triangle ABC.
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
                    <strong>Line AB:</strong> 100 mm (horizontal)
                  </div>
                  <div>
                    <strong>Point C location:</strong> AC = 75 mm, BC = 60 mm
                  </div>
                  <div>
                    <strong>Perpendicular from O:</strong> 60 mm up and down
                  </div>
                  <div>
                    <strong>Extension A' and B':</strong> 17.5 mm from O
                  </div>
                  <div>
                    <strong>Marked points:</strong> 4 points at 10 mm intervals (1, 2, 3, 4)
                  </div>
                  <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                    <p className="text-sm">
                      <strong>Method:</strong> This compass method uses arc intersections from points A and B
                      with radii calculated from extended points A' and B'. The intersections of these arcs
                      determine precise points on the ellipse, which are then connected smoothly to form the
                      complete curve.
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
