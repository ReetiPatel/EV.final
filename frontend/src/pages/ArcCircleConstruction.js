import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Play, Pause, RotateCcw, ArrowLeft, ArrowRight } from "lucide-react";

export default function ArcCircleConstruction() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    "Construct horizontal line AB of 100mm",
    "Mark point C above AB such that AC=75mm and BC=60mm, connect to form triangle ABC",
    "Mark midpoint O of AB (perpendicular for calculation only - not drawn)",
    "From O, extend AO and BO by 17.5mm to mark endpoints A' and B'",
    "Mark 4 points from A to O at 10mm intervals (1,2,3,4) and repeat from B to O",
    "Compass: radius A'-1 from A/B (arcs), radius B'-1 from A/B (intersecting arcs)",
    "Compass: radius A'-2 from A/B (arcs), radius B'-2 from A/B (intersecting arcs)",
    "Compass: radius A'-3 from A/B (arcs), radius B'-3 from A/B (intersecting arcs)",
    "Compass: radius A'-4 from A/B (arcs), radius B'-4 from A/B (intersecting arcs)",
    "Radius A'-O from A and B (minor axis points on vertical line)",
    "Radius A'-A from A/B, radius B'-A from A/B (corner arcs)",
    "Connect all intersection points including minor axis to form smooth ellipse"
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
    const minor_axis_half = 46 * scale; // 46mm up and down from O
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
    
    // Step 2: Draw perpendicular from O (invisible - just for construction)
    if (currentStep >= 2 || !showSteps) {
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(pointO_x, pointO_y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillText("O", pointO_x - 20, pointO_y + 5);
      
      // Don't draw the vertical line - only use for calculations
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
    const markedPointsLeft = [];
    const markedPointsRight = [];
    if (currentStep >= 4 || !showSteps) {
      ctx.fillStyle = "#8b5cf6";
      ctx.font = "12px Inter";
      
      // Points from A to O (left side)
      for (let i = 1; i <= 4; i++) {
        const point_x = pointA_x + i * point_spacing;
        const point_y = pointA_y;
        markedPointsLeft.push({ x: point_x, y: point_y, num: i });
        
        ctx.beginPath();
        ctx.arc(point_x, point_y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(i.toString(), point_x - 5, point_y + 20);
      }
      
      // Points from B to O (right side) - mirror positions
      for (let i = 1; i <= 4; i++) {
        const point_x = pointB_x - i * point_spacing;
        const point_y = pointB_y;
        markedPointsRight.push({ x: point_x, y: point_y, num: i });
        
        ctx.beginPath();
        ctx.arc(point_x, point_y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(i.toString(), point_x - 5, point_y + 20);
      }
    }
    
    // Steps 5-9: Draw arcs for points 1,2,3,4 from both A and B sides
    const ellipsePoints = [];
    
    if (currentStep >= 5 || !showSteps) {
      // Process left side points (A to O)
      markedPointsLeft.forEach((point, idx) => {
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
      
      // Process right side points (B to O) - repeat steps for B side
      markedPointsRight.forEach((point, idx) => {
        // Calculate radii
        const radiusA = Math.sqrt(Math.pow(pointA_prime_x - point.x, 2) + Math.pow(pointA_prime_y - point.y, 2));
        const radiusB = Math.sqrt(Math.pow(pointB_prime_x - point.x, 2) + Math.pow(pointB_prime_y - point.y, 2));
        
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
    
    // Step 10: Minor axis arcs (46mm up and down from O)
    if (currentStep >= 9 || !showSteps) {
      const radiusMinor = Math.sqrt(Math.pow(pointA_prime_x - pointO_x, 2) + Math.pow(pointA_prime_y - pointO_y, 2));
      
      // Minor axis points at 46mm from O
      const top_y = pointO_y - minor_axis_half;
      const bottom_y = pointO_y + minor_axis_half;
      
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
    
    // Step 11: Add B' as the right endpoint of the ellipse
    if (currentStep >= 10 || !showSteps) {
      // B' is the rightmost point of the ellipse
      ellipsePoints.push({ x: pointB_prime_x, y: pointB_prime_y });
      
      // Also add A' as the leftmost point
      ellipsePoints.push({ x: pointA_prime_x, y: pointA_prime_y });
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
      if (ellipsePoints.length > 3) {
        // Separate points for better organization
        const leftPoints = ellipsePoints.filter(p => p.x < pointO_x);
        const rightPoints = ellipsePoints.filter(p => p.x > pointO_x);
        const centerPoints = ellipsePoints.filter(p => Math.abs(p.x - pointO_x) < 5);
        
        // Sort left points: from A' going up, then down
        leftPoints.sort((a, b) => {
          if (a.x === b.x) return a.y - b.y;
          return a.x - b.x;
        });
        
        // Sort right points: from center going up, then down to B'
        rightPoints.sort((a, b) => {
          if (a.x === b.x) return a.y - b.y;
          return a.x - b.x;
        });
        
        // Sort center points (minor axis)
        centerPoints.sort((a, b) => a.y - b.y);
        
        // Build the complete ellipse path
        const upperLeft = leftPoints.filter(p => p.y < pointO_y).sort((a, b) => a.x - b.x);
        const lowerLeft = leftPoints.filter(p => p.y >= pointO_y).sort((a, b) => a.x - b.x);
        const upperRight = rightPoints.filter(p => p.y < pointO_y).sort((a, b) => a.x - b.x);
        const lowerRight = rightPoints.filter(p => p.y >= pointO_y).sort((a, b) => a.x - b.x);
        const topCenter = centerPoints.filter(p => p.y < pointO_y);
        const bottomCenter = centerPoints.filter(p => p.y >= pointO_y);
        
        // Create ordered point sequence: A' -> upper left -> top center -> upper right -> B' -> lower right -> bottom center -> lower left -> back to A'
        const orderedPoints = [
          ...upperLeft,
          ...topCenter,
          ...upperRight,
          ...lowerRight.reverse(),
          ...bottomCenter.reverse(),
          ...lowerLeft.reverse()
        ];
        
        // Remove duplicates
        const uniquePoints = [];
        orderedPoints.forEach(point => {
          const isDuplicate = uniquePoints.some(p => 
            Math.abs(p.x - point.x) < 1 && Math.abs(p.y - point.y) < 1
          );
          if (!isDuplicate) {
            uniquePoints.push(point);
          }
        });
        
        ctx.strokeStyle = "#ec4899";
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        if (uniquePoints.length > 0) {
          ctx.moveTo(uniquePoints[0].x, uniquePoints[0].y);
          
          // Draw smooth curve using Catmull-Rom to Bezier
          for (let i = 0; i < uniquePoints.length; i++) {
            const p0 = uniquePoints[(i - 1 + uniquePoints.length) % uniquePoints.length];
            const p1 = uniquePoints[i];
            const p2 = uniquePoints[(i + 1) % uniquePoints.length];
            const p3 = uniquePoints[(i + 2) % uniquePoints.length];
            
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
        ctx.fillText("PERFECT ELLIPSE", centerX - 60, centerY - 150);
        ctx.font = "12px Inter";
        ctx.fillText("(A' to B' with minor axis)", centerX - 70, centerY - 130);
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
                      
                      <div className="flex items-center px-4 py-2 bg-pink-50 rounded-lg">
                        <span className="text-sm font-medium text-pink-700">
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
                  Calculations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <div className="space-y-2">
                    <p><strong>1) AC = 75mm, BC = 60mm</strong></p>
                    <p className="pl-4">AC + BC = 135mm (Length of major axis)</p>
                    <p className="pl-4">OA' = OB' = 135/2 mm</p>
                    <p className="pl-4">⇒ 67.5mm</p>
                    <p className="pl-4">OA + AA' = OB + BB' = 50 + x</p>
                    <p className="pl-4">50 + x = 67.5</p>
                    <p className="pl-4">x = 17.5mm</p>
                    <p className="pl-4"><strong>So AA' = BB' = 17.5mm</strong></p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>2) Minor axis = √(67.5² - 50²)</strong></p>
                    <p className="pl-4">= √(4556.25 - 2500)</p>
                    <p className="pl-4">= √2056.25</p>
                    <p className="pl-4">= <strong>45.3mm (approx)</strong></p>
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
