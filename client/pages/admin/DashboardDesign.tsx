import { AdminLayout } from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardDesign() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard Design Guide</h1>
          <p className="text-muted-foreground mt-2">
            Visual overview and data structure of athlete and coach dashboards
          </p>
        </div>

        {/* Tabs for each dashboard */}
        <Tabs defaultValue="athlete" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="athlete">Athlete Dashboard</TabsTrigger>
            <TabsTrigger value="coach">Coach Dashboard</TabsTrigger>
          </TabsList>

          {/* ATHLETE DASHBOARD */}
          <TabsContent value="athlete" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border space-y-8">
              {/* Section 1 */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">1. Header</h2>
                  <p className="text-sm text-muted-foreground mt-1">Page title and description</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Title:</p>
                    <p className="text-sm">"Athlete Profile"</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Subtitle:</p>
                    <p className="text-sm">"Your performance and anthropometric data"</p>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">2. Profile & Performance Section (3-Column Grid)</h2>
                  <p className="text-sm text-muted-foreground mt-1">Left: Basic info | Right: Radar chart</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-3">Left Column (1/3) - Profile Card:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Photo:</span> Avatar image from athlete object</li>
                      <li>• <span className="text-foreground font-medium">Name:</span> athlete.name</li>
                      <li>• <span className="text-foreground font-medium">Age:</span> Calculated from dateOfBirth</li>
                      <li>• <span className="text-foreground font-medium">PHV Status:</span> athlete.phvStatus (Pre-PHV, In-PHV, Post-PHV)</li>
                      <li>• <span className="text-foreground font-medium">Biological Age:</span> athlete.biologicalAge</li>
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-3">Right Column (2/3) - Performance Radar Chart:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Chart Type:</span> Recharts RadarChart</li>
                      <li>• <span className="text-foreground font-medium">Data Points:</span> Speed, Power, Strength, Endurance</li>
                      <li>• <span className="text-foreground font-medium">Height:</span> 300px</li>
                      <li>• <span className="text-foreground font-medium">Color:</span> Uses accent color (orange)</li>
                      <li>• <span className="text-foreground font-medium">Interaction:</span> Tooltip on hover</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">3. Anthropometric Data (Full Width)</h2>
                  <p className="text-sm text-muted-foreground mt-1">4-column metric tiles</p>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="font-semibold text-sm mb-3">Data Displayed:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="bg-background rounded p-2">
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="font-semibold">athlete.height (cm)</p>
                    </div>
                    <div className="bg-background rounded p-2">
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-semibold">athlete.weight (kg)</p>
                    </div>
                    <div className="bg-background rounded p-2">
                      <p className="text-xs text-muted-foreground">Wingspan</p>
                      <p className="font-semibold">athlete.wingspan (cm)</p>
                    </div>
                    <div className="bg-background rounded p-2">
                      <p className="text-xs text-muted-foreground">Sitting Height</p>
                      <p className="font-semibold">athlete.sittingHeight (cm)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">4. Test Results Section (Card/Table Toggle)</h2>
                  <p className="text-sm text-muted-foreground mt-1">Switch between card and tabular view</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Card View (Default):</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Layout:</span> 4-column grid</li>
                      <li>• <span className="text-foreground font-medium">Per Card:</span></li>
                      <li className="ml-4">- Test category (Speed, Power, etc.)</li>
                      <li className="ml-4">- Latest value in large orange text</li>
                      <li className="ml-4">- Test name</li>
                      <li className="ml-4">- Mini line chart (12px height) showing progression</li>
                      <li className="ml-4">- Test date</li>
                      <li className="ml-4">- "Tap to expand" hint</li>
                      <li>• <span className="text-foreground font-medium">Interaction:</span> Click card to open full modal</li>
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Table View:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Session Filter:</span> Dropdown to filter by session date</li>
                      <li>• <span className="text-foreground font-medium">Columns:</span> Test Name, Category, Value, Unit, Date, Action</li>
                      <li>• <span className="text-foreground font-medium">Data Source:</span> mockTestSessions and mockAthletes</li>
                      <li>• <span className="text-foreground font-medium">Interaction:</span> Click "View" button to expand chart</li>
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Expanded Modal (both views):</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Large Line Chart:</span> Full progression history</li>
                      <li>• <span className="text-foreground font-medium">Stats Grid:</span> Latest, Highest, Lowest, Change values</li>
                      <li>• <span className="text-foreground font-medium">Detailed Table:</span> Date, Value, Unit for each test</li>
                      <li>• <span className="text-foreground font-medium">Height:</span> 300px for main chart</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Source */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">Data Sources</h2>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• <span className="text-foreground font-medium">Athlete Info:</span> mockAthletes array (hardcoded a1)</li>
                    <li>• <span className="text-foreground font-medium">Test Results:</span> mockTestSessions array</li>
                    <li>• <span className="text-foreground font-medium">Test Categories:</span> testCategories object</li>
                    <li>• <span className="text-foreground font-medium">File:</span> client/data/mockData.ts</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* COACH DASHBOARD */}
          <TabsContent value="coach" className="space-y-6">
            <div className="bg-card rounded-lg p-6 border border-border space-y-8">
              {/* Top Tabs */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">1. Top-Level Navigation Tabs</h2>
                  <p className="text-sm text-muted-foreground mt-1">Two main views: Per Athlete or Group View</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Per Athlete Tab (Default):</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Athlete selector dropdown</li>
                      <li>• Athlete header card with info</li>
                      <li>• Card/Table view toggle</li>
                      <li>• Card or Tabular view</li>
                    </ul>
                  </div>
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Group View Tab:</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Talent Quadrant scatter chart</li>
                      <li>• Filters bar (test, PHV, sort)</li>
                      <li>• Graph or Table view toggle</li>
                      <li>• Bar chart or table display</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Per Athlete Section */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">2. Per Athlete View</h2>
                  <p className="text-sm text-muted-foreground mt-1">Individual athlete performance analysis</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Athlete Selector & Header:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Dropdown:</span> Select from group athletes</li>
                      <li>• <span className="text-foreground font-medium">Header Card Shows:</span></li>
                      <li className="ml-4">- Photo, name, DOB</li>
                      <li className="ml-4">- Age badges (chronological + biological)</li>
                      <li className="ml-4">- PHV gauge (visual indicator)</li>
                      <li className="ml-4">- Maturity status bar</li>
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Card View:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Grouped by Category:</span> Speed, Agility, Power, etc.</li>
                      <li>• <span className="text-foreground font-medium">Per Test Card:</span></li>
                      <li className="ml-4">- Test name</li>
                      <li className="ml-4">- Latest value with unit</li>
                      <li className="ml-4">- Mini line chart (16px height, clickable)</li>
                      <li className="ml-4">- "Tap to expand" hint</li>
                      <li>• <span className="text-foreground font-medium">Click:</span> Opens expanded modal with full chart + table</li>
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Tabular View:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Session Selector:</span> Filter by test session date</li>
                      <li>• <span className="text-foreground font-medium">Columns:</span> Category, Test Name, Result, Unit, Benchmark</li>
                      <li>• <span className="text-foreground font-medium">Benchmark Column:</span></li>
                      <li className="ml-4">- Shows benchmark value + status badge</li>
                      <li className="ml-4">- 🟢 Above, 🟡 At, 🔴 Below</li>
                      <li>• <span className="text-foreground font-medium">Anthropometrics:</span> Always included in table</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Group View Section */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">3. Group View</h2>
                  <p className="text-sm text-muted-foreground mt-1">Compare multiple athletes in the group</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Section 1 - Talent Quadrant Chart:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Chart Type:</span> Scatter chart (Chronological Z-Score vs Biological Z-Score)</li>
                      <li>• <span className="text-foreground font-medium">Test Selector:</span> Dropdown to select which test</li>
                      <li>• <span className="text-foreground font-medium">Quadrants:</span></li>
                      <li className="ml-4">- Top-Left (🟡): Hidden Talent</li>
                      <li className="ml-4">- Top-Right (🟢): Talent</li>
                      <li className="ml-4">- Bottom-Left (🔴): Weak Performer</li>
                      <li className="ml-4">- Bottom-Right (🟠): Maturation Spike</li>
                      <li>• <span className="text-foreground font-medium">Dot Colors:</span> Based on PHV status (Pre-PHV, In-PHV, Post-PHV)</li>
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Section 2 - Filters Bar:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Filter by Test:</span> Dropdown (Speed, Power, Strength, etc.)</li>
                      <li>• <span className="text-foreground font-medium">Filter by PHV Status:</span> Multi-select buttons (Pre-PHV, In-PHV, Post-PHV)</li>
                      <li>• <span className="text-foreground font-medium">Sort by:</span> Chronological Age, Biological Age, or Result Value</li>
                      <li>• <span className="text-foreground font-medium">View Toggle:</span> Graph View or Table View</li>
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Graph View (Section 3):</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Chart Type:</span> Horizontal bar chart</li>
                      <li>• <span className="text-foreground font-medium">Shows:</span> Each filtered athlete with their test result</li>
                      <li>• <span className="text-foreground font-medium">Reference Line:</span> Group average (dashed line)</li>
                      <li>• <span className="text-foreground font-medium">Bar Colors:</span> Based on PHV status</li>
                      <li>• <span className="text-foreground font-medium">Height:</span> Dynamic based on athlete count</li>
                    </ul>
                  </div>

                  <div className="bg-secondary rounded-lg p-4">
                    <p className="font-semibold text-sm mb-2">Table View (Section 4):</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <span className="text-foreground font-medium">Columns:</span> Athlete, Chron Age, Bio Age, PHV Status, Result, Unit, Benchmark, Chron Z, Bio Z, Quadrant</li>
                      <li>• <span className="text-foreground font-medium">Sortable:</span> Click column headers to sort</li>
                      <li>• <span className="text-foreground font-medium">Row Highlights:</span></li>
                      <li className="ml-4">- Athlete photo + name</li>
                      <li className="ml-4">- PHV status color badge</li>
                      <li className="ml-4">- Quadrant badge with emoji</li>
                      <li>• <span className="text-foreground font-medium">Benchmark:</span> Shows value + status tag (Above/At/Below)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Source */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">Data Sources</h2>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• <span className="text-foreground font-medium">Athletes:</span> From selected group</li>
                    <li>• <span className="text-foreground font-medium">Test Sessions:</span> mockTestSessions filtered by groupId</li>
                    <li>• <span className="text-foreground font-medium">Z-Scores:</span> mockZScores (hardcoded per athlete per test)</li>
                    <li>• <span className="text-foreground font-medium">Benchmarks:</span> benchmarks object with value + lowerIsBetter flag</li>
                    <li>• <span className="text-foreground font-medium">File:</span> client/pages/coach/Dashboard.tsx</li>
                  </ul>
                </div>
              </div>

              {/* Interactions */}
              <div className="space-y-4">
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">Key Interactions</h2>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• <span className="text-foreground font-medium">Test Card Click:</span> Opens modal with full chart + detailed table</li>
                    <li>• <span className="text-foreground font-medium">Table Sort:</span> Click any sortable column to sort ascending/descending</li>
                    <li>• <span className="text-foreground font-medium">PHV Filter:</span> Can select multiple statuses simultaneously</li>
                    <li>• <span className="text-foreground font-medium">Hover Effects:</span> Cards highlight on hover, cursor changes to pointer</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Common Elements */}
        <div className="bg-card rounded-lg p-6 border border-border space-y-4">
          <h2 className="text-2xl font-bold">Common Elements & Styling</h2>
          <div className="space-y-3">
            <div className="bg-secondary rounded-lg p-4">
              <p className="font-semibold text-sm mb-2">Theme Colors:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <span className="text-foreground font-medium">Primary:</span> Orange/Accent (action buttons, highlights)</li>
                <li>• <span className="text-foreground font-medium">Card Background:</span> Dark card color</li>
                <li>• <span className="text-foreground font-medium">Secondary:</span> Slightly lighter than card</li>
                <li>• <span className="text-foreground font-medium">Muted:</span> For secondary text and borders</li>
              </ul>
            </div>

            <div className="bg-secondary rounded-lg p-4">
              <p className="font-semibold text-sm mb-2">Chart Library:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <span className="text-foreground font-medium">Library:</span> Recharts</li>
                <li>• <span className="text-foreground font-medium">Chart Types Used:</span> Line, Bar, Radar, Scatter</li>
                <li>• <span className="text-foreground font-medium">Styling:</span> Uses CSS variables for colors (hsl(var(...)))</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
