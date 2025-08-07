import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { CheckCircle, Circle, AlertTriangle } from "lucide-react";

export function AlphaTestingChecklist() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const testingCategories = [
    {
      title: "Authentication Testing",
      items: [
        "Sign up with teacher account",
        "Sign up with school account",
        "Login with existing account", 
        "Test password validation",
        "Verify session persistence",
        "Test sign out functionality"
      ]
    },
    {
      title: "Dashboard Testing",
      items: [
        "View overview statistics",
        "Browse job listings",
        "Check applications tab",
        "View analytics data",
        "Test navigation between tabs",
        "Verify user profile display"
      ]
    },
    {
      title: "Data Persistence",
      items: [
        "Profile data saves correctly",
        "Job applications persist",
        "Analytics update in real-time",
        "Session data maintained",
        "User preferences saved",
        "Data loads after refresh"
      ]
    },
    {
      title: "User Experience",
      items: [
        "Loading states work properly",
        "Error messages are helpful",
        "Navigation is intuitive",
        "Responsive design works",
        "Accessibility features",
        "Performance is acceptable"
      ]
    }
  ];

  const handleItemCheck = (category: string, item: string) => {
    const key = `${category}-${item}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getTotalProgress = () => {
    const totalItems = testingCategories.reduce((total, cat) => total + cat.items.length, 0);
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const getCategoryProgress = (category: any) => {
    const categoryItems = category.items.length;
    const checkedInCategory = category.items.filter((item: string) => 
      checkedItems[`${category.title}-${item}`]
    ).length;
    return Math.round((checkedInCategory / categoryItems) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Alpha Testing Checklist
            </span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {getTotalProgress()}% Complete
            </Badge>
          </CardTitle>
          <Progress value={getTotalProgress()} className="w-full" />
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testingCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{category.title}</span>
                <Badge 
                  variant={getCategoryProgress(category) === 100 ? "default" : "secondary"}
                  className={getCategoryProgress(category) === 100 ? "bg-green-100 text-green-800" : ""}
                >
                  {getCategoryProgress(category)}%
                </Badge>
              </CardTitle>
              <Progress value={getCategoryProgress(category)} className="w-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item, itemIndex) => {
                const key = `${category.title}-${item}`;
                const isChecked = checkedItems[key] || false;
                
                return (
                  <div 
                    key={itemIndex}
                    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleItemCheck(category.title, item)}
                  >
                    <Checkbox 
                      checked={isChecked}
                      onChange={() => handleItemCheck(category.title, item)}
                    />
                    <span className={`flex-1 ${isChecked ? 'line-through text-gray-500' : ''}`}>
                      {item}
                    </span>
                    {isChecked ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium mb-2">Testing Notes</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Open browser developer tools to monitor for errors</li>
                <li>• Test with different user roles (teacher vs school)</li>
                <li>• Try the application on both desktop and mobile</li>
                <li>• Document any bugs or unexpected behavior</li>
                <li>• Check that data persists after page refresh</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}