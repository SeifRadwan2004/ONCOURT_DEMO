import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Dashboard {
  id: string;
  name: string;
  userId: string;
  userName: string;
  userRole: "athlete" | "coach" | "admin";
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  description: string;
}

interface DashboardConfig {
  sections: {
    profileCard: boolean;
    performanceChart: boolean;
    anthropometricData: boolean;
    testResults: boolean;
    talentQuadrant: boolean;
    groupComparison: boolean;
  };
  selectedTests: string[];
  selectedAthletes: string[];
  selectedCoaches: string[];
  chartSettings: {
    radarHeight: number;
    showTooltip: boolean;
    showLegend: boolean;
  };
}

const mockAthletes = [
  { id: "a1", name: "Alex Johnson" },
  { id: "a2", name: "Jordan Smith" },
  { id: "a3", name: "Casey Brown" },
  { id: "a4", name: "Taylor White" },
  { id: "a5", name: "Morgan Lee" },
];

const mockCoaches = [
  { id: "c1", name: "Coach Mike" },
  { id: "c2", name: "Coach Sarah" },
  { id: "c3", name: "Coach James" },
];

const availableTests = [
  "10m Sprint",
  "30m Sprint",
  "5-10-5",
  "T-Test",
  "Vertical Jump",
  "Broad Jump",
  "Grip Right",
  "Grip Left",
  "Push-Ups",
  "Yo-Yo Test",
  "Beep Test",
];

export default function DashboardEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dashboard = location.state?.dashboard as Dashboard | undefined;

  const [title, setTitle] = useState(dashboard?.name || "");
  const [description, setDescription] = useState(dashboard?.description || "");
  const [config, setConfig] = useState<DashboardConfig>({
    sections: {
      profileCard: true,
      performanceChart: true,
      anthropometricData: true,
      testResults: true,
      talentQuadrant: false,
      groupComparison: false,
    },
    selectedTests: ["10m Sprint", "Vertical Jump", "Grip Right"],
    selectedAthletes: ["a1", "a2"],
    selectedCoaches: ["c1"],
    chartSettings: {
      radarHeight: 300,
      showTooltip: false,
      showLegend: true,
    },
  });

  const handleSave = () => {
    console.log("Saving dashboard config:", { title, description, config });
    alert("Dashboard configuration saved!");
    navigate("/admin/dashboard-manager");
  };

  const toggleSection = (section: keyof DashboardConfig["sections"]) => {
    setConfig({
      ...config,
      sections: {
        ...config.sections,
        [section]: !config.sections[section],
      },
    });
  };

  const toggleTest = (test: string) => {
    setConfig({
      ...config,
      selectedTests: config.selectedTests.includes(test)
        ? config.selectedTests.filter((t) => t !== test)
        : [...config.selectedTests, test],
    });
  };

  const toggleAthlete = (athleteId: string) => {
    setConfig({
      ...config,
      selectedAthletes: config.selectedAthletes.includes(athleteId)
        ? config.selectedAthletes.filter((id) => id !== athleteId)
        : [...config.selectedAthletes, athleteId],
    });
  };

  const toggleCoach = (coachId: string) => {
    setConfig({
      ...config,
      selectedCoaches: config.selectedCoaches.includes(coachId)
        ? config.selectedCoaches.filter((id) => id !== coachId)
        : [...config.selectedCoaches, coachId],
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/dashboard-manager")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Editor</h1>
              <p className="text-muted-foreground mt-1">
                {dashboard ? `Editing: ${dashboard.name}` : "Create new dashboard"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard-manager")}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Dashboard
            </Button>
          </div>
        </div>

        {/* Main Editor */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card className="p-6 border border-border">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Dashboard Title</label>
                  <Input
                    placeholder="e.g., Athlete Performance Analytics"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="What is this dashboard used for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {dashboard?.createdAt || "New"}
                  </p>
                  <p>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {dashboard?.updatedAt || "N/A"}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections" className="space-y-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-bold mb-6">Dashboard Sections</h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase">
                    Athlete Dashboard
                  </h4>

                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                    <Checkbox
                      checked={config.sections.profileCard}
                      onCheckedChange={() => toggleSection("profileCard")}
                    />
                    <div>
                      <p className="font-medium">Profile Card</p>
                      <p className="text-xs text-muted-foreground">
                        Athlete photo, name, age, PHV status
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                    <Checkbox
                      checked={config.sections.performanceChart}
                      onCheckedChange={() => toggleSection("performanceChart")}
                    />
                    <div>
                      <p className="font-medium">Performance Spider Chart</p>
                      <p className="text-xs text-muted-foreground">
                        Speed, COD, Agility, Explosiveness, Strength, Endurance
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                    <Checkbox
                      checked={config.sections.anthropometricData}
                      onCheckedChange={() => toggleSection("anthropometricData")}
                    />
                    <div>
                      <p className="font-medium">Anthropometric Data</p>
                      <p className="text-xs text-muted-foreground">
                        Height, weight, wingspan, sitting height
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                    <Checkbox
                      checked={config.sections.testResults}
                      onCheckedChange={() => toggleSection("testResults")}
                    />
                    <div>
                      <p className="font-medium">Test Results</p>
                      <p className="text-xs text-muted-foreground">
                        Latest test results with history and comparisons
                      </p>
                    </div>
                  </label>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase">
                    Coach Dashboard
                  </h4>

                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                    <Checkbox
                      checked={config.sections.talentQuadrant}
                      onCheckedChange={() => toggleSection("talentQuadrant")}
                    />
                    <div>
                      <p className="font-medium">Talent Quadrant Chart</p>
                      <p className="text-xs text-muted-foreground">
                        Scatter plot showing talent distribution by maturity
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                    <Checkbox
                      checked={config.sections.groupComparison}
                      onCheckedChange={() => toggleSection("groupComparison")}
                    />
                    <div>
                      <p className="font-medium">Group Comparison</p>
                      <p className="text-xs text-muted-foreground">
                        Compare athletes side-by-side with benchmarks
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <h3 className="text-lg font-bold mb-4">Chart Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Radar Chart Height: {config.chartSettings.radarHeight}px</label>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="50"
                    value={config.chartSettings.radarHeight}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        chartSettings: {
                          ...config.chartSettings,
                          radarHeight: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full mt-2"
                  />
                </div>

                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                  <Checkbox
                    checked={config.chartSettings.showLegend}
                    onCheckedChange={() =>
                      setConfig({
                        ...config,
                        chartSettings: {
                          ...config.chartSettings,
                          showLegend: !config.chartSettings.showLegend,
                        },
                      })
                    }
                  />
                  <span className="font-medium">Show Legend</span>
                </label>
              </div>
            </Card>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-bold mb-6">Select Tests to Display</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableTests.map((test) => (
                  <label
                    key={test}
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary cursor-pointer border border-border"
                  >
                    <Checkbox
                      checked={config.selectedTests.includes(test)}
                      onCheckedChange={() => toggleTest(test)}
                    />
                    <span className="text-sm font-medium">{test}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Selected: {config.selectedTests.length} of {availableTests.length} tests
              </p>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-bold mb-6">Select Athletes</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {mockAthletes.map((athlete) => (
                  <label
                    key={athlete.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer"
                  >
                    <Checkbox
                      checked={config.selectedAthletes.includes(athlete.id)}
                      onCheckedChange={() => toggleAthlete(athlete.id)}
                    />
                    <span className="font-medium">{athlete.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Selected: {config.selectedAthletes.length} athletes
              </p>
            </Card>

            <Card className="p-6 border border-border">
              <h3 className="text-lg font-bold mb-6">Select Coaches</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {mockCoaches.map((coach) => (
                  <label
                    key={coach.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer"
                  >
                    <Checkbox
                      checked={config.selectedCoaches.includes(coach.id)}
                      onCheckedChange={() => toggleCoach(coach.id)}
                    />
                    <span className="font-medium">{coach.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Selected: {config.selectedCoaches.length} coaches
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Footer */}
        <div className="flex gap-2 sticky bottom-6 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard-manager")}
            className="gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Dashboard
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
