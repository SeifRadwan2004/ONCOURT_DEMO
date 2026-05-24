import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Save, X, Plus, Trash2, GripVertical } from "lucide-react";
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

interface ChartData {
  id: string;
  type: "radar" | "bar" | "line" | "scatter";
  title: string;
  height: number;
  dataSource: "tests" | "custom";
  fields: ChartField[];
  chartConfig: Record<string, any>;
}

interface ChartField {
  id: string;
  name: string;
  source: string;
  calculation?: string;
}

interface DashboardSection {
  id: string;
  type: "chart" | "info" | "metrics";
  chartId?: string;
  title: string;
  width: "full" | "half" | "third";
  order: number;
}

const chartTypes = [
  { id: "radar", label: "Spider/Radar Chart", description: "Multidimensional performance" },
  { id: "bar", label: "Bar Chart", description: "Compare values" },
  { id: "line", label: "Line Chart", description: "Track trends over time" },
  { id: "scatter", label: "Scatter Plot", description: "Distribution analysis" },
];

const dataSourceOptions = [
  { id: "10m Sprint", label: "10m Sprint", value: 1.72 },
  { id: "30m Sprint", label: "30m Sprint", value: 4.15 },
  { id: "5-10-5", label: "5-10-5 Agility", value: 5.2 },
  { id: "T-Test", label: "T-Test", value: 9.8 },
  { id: "Vertical Jump", label: "Vertical Jump", value: 42 },
  { id: "Broad Jump", label: "Broad Jump", value: 220 },
  { id: "Grip Right", label: "Grip Right", value: 28 },
  { id: "Push-Ups", label: "Push-Ups", value: 35 },
  { id: "Yo-Yo Test", label: "Yo-Yo Test", value: 8.5 },
];

export default function DashboardBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dashboard = location.state?.dashboard as Dashboard | undefined;

  const [title, setTitle] = useState(dashboard?.name || "");
  const [description, setDescription] = useState(dashboard?.description || "");
  
  const [sections, setSections] = useState<DashboardSection[]>([
    { id: "s1", type: "chart", chartId: "c1", title: "Performance Profile", width: "full", order: 1 },
  ]);

  const [charts, setCharts] = useState<ChartData[]>([
    {
      id: "c1",
      type: "radar",
      title: "Performance Profile",
      height: 300,
      dataSource: "tests",
      fields: [
        { id: "f1", name: "Speed", source: "10m Sprint", calculation: "100 - (value * 100 / 2)" },
        { id: "f2", name: "COD", source: "5-10-5", calculation: "100 - (value * 100 / 8)" },
        { id: "f3", name: "Explosiveness", source: "Vertical Jump", calculation: "value * 2" },
        { id: "f4", name: "Strength", source: "Grip Right", calculation: "value * 1.5" },
      ],
      chartConfig: { showLegend: true, showTooltip: false },
    },
  ]);

  const [activeTab, setActiveTab] = useState("basic");
  const [editingChartId, setEditingChartId] = useState<string | null>(null);

  const handleSave = () => {
    console.log("Saving dashboard:", { title, description, sections, charts });
    alert("Dashboard saved successfully!");
    navigate("/admin/dashboard-manager");
  };

  const addChart = () => {
    const newChartId = `c${Date.now()}`;
    const newChart: ChartData = {
      id: newChartId,
      type: "radar",
      title: "New Chart",
      height: 300,
      dataSource: "tests",
      fields: [],
      chartConfig: { showLegend: true, showTooltip: false },
    };
    setCharts([...charts, newChart]);

    const newSection: DashboardSection = {
      id: `s${Date.now()}`,
      type: "chart",
      chartId: newChartId,
      title: "New Chart",
      width: "full",
      order: sections.length + 1,
    };
    setSections([...sections, newSection]);
  };

  const deleteChart = (chartId: string) => {
    setCharts(charts.filter((c) => c.id !== chartId));
    setSections(sections.filter((s) => s.chartId !== chartId));
  };

  const updateChart = (chartId: string, updates: Partial<ChartData>) => {
    setCharts(charts.map((c) => (c.id === chartId ? { ...c, ...updates } : c)));
  };

  const addField = (chartId: string) => {
    setCharts(
      charts.map((c) => {
        if (c.id === chartId) {
          return {
            ...c,
            fields: [
              ...c.fields,
              { id: `f${Date.now()}`, name: "New Field", source: "", calculation: "" },
            ],
          };
        }
        return c;
      })
    );
  };

  const removeField = (chartId: string, fieldId: string) => {
    setCharts(
      charts.map((c) => {
        if (c.id === chartId) {
          return {
            ...c,
            fields: c.fields.filter((f) => f.id !== fieldId),
          };
        }
        return c;
      })
    );
  };

  const updateField = (
    chartId: string,
    fieldId: string,
    updates: Partial<ChartField>
  ) => {
    setCharts(
      charts.map((c) => {
        if (c.id === chartId) {
          return {
            ...c,
            fields: c.fields.map((f) =>
              f.id === fieldId ? { ...f, ...updates } : f
            ),
          };
        }
        return c;
      })
    );
  };

  const currentChart = editingChartId ? charts.find((c) => c.id === editingChartId) : null;

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
              <h1 className="text-3xl font-bold">Dashboard Builder</h1>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="charts">Chart Editor</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
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
              </div>
            </Card>
          </TabsContent>

          {/* Layout */}
          <TabsContent value="layout" className="space-y-6">
            <Card className="p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Dashboard Sections</h3>
                <Button onClick={addChart} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Chart
                </Button>
              </div>

              <div className="space-y-3">
                {sections.map((section) => {
                  const chart = charts.find((c) => c.id === section.chartId);
                  return (
                    <div key={section.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary/50">
                      <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                      <div className="flex-1">
                        <p className="font-medium">{chart?.title || "Unknown Chart"}</p>
                        <p className="text-sm text-muted-foreground">
                          {chartTypes.find((t) => t.id === chart?.type)?.label} • {section.width}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingChartId(section.chartId || "")}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteChart(section.chartId || "")}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Chart Editor */}
          <TabsContent value="charts" className="space-y-6">
            {editingChartId && currentChart ? (
              <Card className="p-6 border border-border space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <h3 className="text-lg font-bold">Editing: {currentChart.title}</h3>
                  <Button
                    variant="outline"
                    onClick={() => setEditingChartId(null)}
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Chart Title */}
                <div>
                  <label className="text-sm font-medium">Chart Title</label>
                  <Input
                    value={currentChart.title}
                    onChange={(e) =>
                      updateChart(currentChart.id, { title: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                {/* Chart Type */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Chart Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {chartTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() =>
                          updateChart(currentChart.id, {
                            type: type.id as any,
                          })
                        }
                        className={`p-3 rounded-lg border text-left transition-all ${
                          currentChart.type === type.id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent"
                        }`}
                      >
                        <p className="font-medium text-sm">{type.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart Height */}
                <div>
                  <label className="text-sm font-medium">
                    Chart Height: {currentChart.height}px
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="600"
                    step="50"
                    value={currentChart.height}
                    onChange={(e) =>
                      updateChart(currentChart.id, {
                        height: parseInt(e.target.value),
                      })
                    }
                    className="w-full mt-2"
                  />
                </div>

                {/* Data Fields */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold">Data Fields</h4>
                    <Button
                      onClick={() => addField(currentChart.id)}
                      size="sm"
                      className="gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Field
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {currentChart.fields.map((field) => (
                      <div
                        key={field.id}
                        className="p-4 border border-border rounded-lg space-y-3 bg-secondary/30"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium">Field Name</label>
                            <Input
                              placeholder="e.g., Speed"
                              value={field.name}
                              onChange={(e) =>
                                updateField(currentChart.id, field.id, {
                                  name: e.target.value,
                                })
                              }
                              size={1}
                              className="mt-1 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium">Data Source</label>
                            <select
                              value={field.source}
                              onChange={(e) =>
                                updateField(currentChart.id, field.id, {
                                  source: e.target.value,
                                })
                              }
                              className="w-full mt-1 px-2 py-1 border border-border rounded text-sm bg-background"
                            >
                              <option value="">Select source...</option>
                              {dataSourceOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-medium">
                            Calculation (optional)
                          </label>
                          <Input
                            placeholder="e.g., 100 - (value * 100 / 2)"
                            value={field.calculation || ""}
                            onChange={(e) =>
                              updateField(currentChart.id, field.id, {
                                calculation: e.target.value,
                              })
                            }
                            size={1}
                            className="mt-1 text-sm"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Use 'value' as the test result variable
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeField(currentChart.id, field.id)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Options */}
                <div className="border-t border-border pt-6 space-y-3">
                  <h4 className="text-sm font-bold">Chart Options</h4>
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary cursor-pointer">
                    <Checkbox
                      checked={currentChart.chartConfig.showLegend !== false}
                      onCheckedChange={(checked) =>
                        updateChart(currentChart.id, {
                          chartConfig: {
                            ...currentChart.chartConfig,
                            showLegend: checked,
                          },
                        })
                      }
                    />
                    <span className="text-sm font-medium">Show Legend</span>
                  </label>
                </div>
              </Card>
            ) : (
              <Card className="p-12 border border-border text-center">
                <p className="text-muted-foreground mb-4">
                  Select a chart from the Layout tab to edit it
                </p>
                <Button onClick={() => setActiveTab("layout")} variant="outline">
                  Go to Layout
                </Button>
              </Card>
            )}
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
