import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SkillsComparison() {
  const decliningSkills = [
    { name: "Manual Data Entry", decline: "-78%" },
    { name: "Basic Copywriting", decline: "-65%" },
    { name: "Routine Customer Support", decline: "-62%" },
    { name: "Basic Bookkeeping", decline: "-58%" },
    { name: "Simple Translation", decline: "-55%" },
    { name: "Basic Research", decline: "-52%" },
    { name: "Routine Document Processing", decline: "-48%" },
    { name: "Basic Content Moderation", decline: "-45%" },
  ]

  const emergingSkills = [
    { name: "Prompt Engineering", growth: "+245%" },
    { name: "AI Model Training", growth: "+187%" },
    { name: "AI Ethics", growth: "+156%" },
    { name: "AI Integration", growth: "+142%" },
    { name: "Human-AI Collaboration", growth: "+128%" },
    { name: "AI Strategy", growth: "+115%" },
    { name: "AI Governance", growth: "+98%" },
    { name: "AI UX Design", growth: "+92%" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills Transformation</CardTitle>
        <CardDescription>Declining vs. emerging skills in the AI economy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-red-500">Declining Skills</h3>
            <div className="flex flex-wrap gap-2">
              {decliningSkills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant="outline"
                  className="flex items-center gap-1 border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
                >
                  {skill.name}
                  <span className="text-xs font-normal">{skill.decline}</span>
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-green-500">Emerging Skills</h3>
            <div className="flex flex-wrap gap-2">
              {emergingSkills.map((skill) => (
                <Badge
                  key={skill.name}
                  variant="outline"
                  className="flex items-center gap-1 border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                >
                  {skill.name}
                  <span className="text-xs font-normal">{skill.growth}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
