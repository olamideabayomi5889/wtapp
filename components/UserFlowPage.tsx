import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, User, School, Search, FileText, CheckCircle, Star } from "lucide-react";

export function UserFlowPage() {
  const flowSteps = [
    {
      id: 1,
      title: "Landing Page",
      description: "User visits WondasTeach",
      icon: <School className="w-6 h-6" />,
      color: "bg-blue-500",
      position: { x: 50, y: 100 }
    },
    {
      id: 2,
      title: "Choose Role",
      description: "Teacher or School",
      icon: <User className="w-6 h-6" />,
      color: "bg-green-500",
      position: { x: 300, y: 100 }
    },
    {
      id: 3,
      title: "Sign Up",
      description: "Create account",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-purple-500",
      position: { x: 550, y: 100 }
    },
    {
      id: 4,
      title: "Profile Setup",
      description: "Complete profile",
      icon: <User className="w-6 h-6" />,
      color: "bg-orange-500",
      position: { x: 800, y: 100 }
    },
    {
      id: 5,
      title: "Browse/Search",
      description: "Find opportunities",
      icon: <Search className="w-6 h-6" />,
      color: "bg-cyan-500",
      position: { x: 300, y: 300 }
    },
    {
      id: 6,
      title: "Apply/Connect",
      description: "Submit application",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "bg-red-500",
      position: { x: 550, y: 300 }
    },
    {
      id: 7,
      title: "Match & Review",
      description: "Review and rating",
      icon: <Star className="w-6 h-6" />,
      color: "bg-yellow-500",
      position: { x: 800, y: 300 }
    }
  ];

  const connections = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">WondasTeach User Flow</h1>
          <p className="text-gray-600">
            Visual representation of the user journey through the platform
          </p>
        </div>

        <div className="relative bg-white rounded-lg border border-gray-200 p-8" style={{ minHeight: '600px' }}>
          {/* Flow Steps */}
          {flowSteps.map((step) => (
            <div
              key={step.id}
              className="absolute"
              style={{ 
                left: `${step.position.x}px`, 
                top: `${step.position.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Card className="w-48 hover:shadow-lg transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${step.color} rounded-full mx-auto mb-3 flex items-center justify-center text-white`}>
                    {step.icon}
                  </div>
                  <h3 className="text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {connections.map((connection, index) => {
              const fromStep = flowSteps.find(s => s.id === connection.from);
              const toStep = flowSteps.find(s => s.id === connection.to);
              
              if (!fromStep || !toStep) return null;
              
              return (
                <line
                  key={index}
                  x1={fromStep.position.x + 96} // Card width/2 offset
                  y1={fromStep.position.y}
                  x2={toStep.position.x - 96}
                  y2={toStep.position.y}
                  stroke="#10b981"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#10b981"
                />
              </marker>
            </defs>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4">
            <Card className="w-64">
              <CardContent className="p-4">
                <h4 className="text-sm mb-3">User Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-xs">Teachers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-xs">Schools</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-xs">Authentication</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-xs">Profile Management</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flow Description */}
          <div className="absolute bottom-4 right-4">
            <Card className="w-72">
              <CardContent className="p-4">
                <h4 className="text-sm mb-3">Flow Description</h4>
                <ol className="text-xs space-y-1 text-gray-600">
                  <li>1. User arrives at landing page</li>
                  <li>2. Selects role (Teacher/School)</li>
                  <li>3. Creates account with details</li>
                  <li>4. Completes profile setup</li>
                  <li>5. Browses available opportunities</li>
                  <li>6. Applies or initiates contact</li>
                  <li>7. Reviews and ratings system</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button className="bg-green-600 hover:bg-green-700">
            Export Flow Diagram
          </Button>
        </div>
      </div>
    </div>
  );
}