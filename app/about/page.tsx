"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Lightbulb, Github, Linkedin, Mail } from "lucide-react"
import { LayoutWrapper } from "@/components/layout-wrapper"

export default function AboutPage() {
  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-8">About Us</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              We're dedicated to tracking and analyzing the impact of AI on the global job market, providing insights
              that help individuals and organizations navigate the future of work.
            </p>
          </div>

          {/* Mission, Vision, Goals Cards */}
          <div className="grid gap-8 md:grid-cols-3 mb-16">
            {/* Mission Card */}
            <Card className="border-0 shadow-lg bg-blue-50/80 dark:bg-blue-950/80 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl text-blue-900 dark:text-blue-100">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                  To provide comprehensive, real-time analysis of AI's impact on employment, helping individuals and
                  organizations make informed decisions about the future of work.
                </p>
              </CardContent>
            </Card>

            {/* Vision Card */}
            <Card className="border-0 shadow-lg bg-purple-50/80 dark:bg-purple-950/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-xl text-purple-900 dark:text-purple-100">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-700 dark:text-purple-300 leading-relaxed">
                  A world where the transition to AI-enhanced workplaces is transparent, equitable, and beneficial for
                  all workers across every industry and skill level.
                </p>
              </CardContent>
            </Card>

            {/* Goals Card */}
            <Card className="border-0 shadow-lg bg-emerald-50/80 dark:bg-emerald-950/80 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl text-emerald-900 dark:text-emerald-100">Our Goals</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  To democratize access to AI job market insights, foster skill development, and bridge the gap between
                  technological advancement and workforce readiness.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Section */}
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Meet Our Team</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                The passionate students behind the Future of Jobs Tracker
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Developer 1 */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-center">
                    {/* Avatar Placeholder */}
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-bold text-white">A</span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Aditi</h3>

                    <Badge
                      variant="outline"
                      className="mb-4 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    >
                      Computer Science Student
                    </Badge>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      Passionate computer science student with a keen interest in web development and AI technologies.
                      Currently learning React, Node.js, and data visualization while exploring how AI impacts our
                      future workforce.
                    </p>

                    <div className="flex justify-center space-x-4">
                      <a
                        href="#"
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Github className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </a>
                      <a
                        href="#"
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Linkedin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </a>
                      <a
                        href="#"
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Developer 2 */}
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-center">
                    {/* Avatar Placeholder */}
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-bold text-white">C</span>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Chetan</h3>

                    <Badge
                      variant="outline"
                      className="mb-4 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    >
                      Economics & Data Science Student
                    </Badge>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                      Economics student with a growing interest in data science and AI research. Currently studying the
                      intersection of technology and labor markets, dedicated to understanding and communicating AI
                      trends to fellow students and the broader community.
                    </p>

                    <div className="flex justify-center space-x-4">
                      <a
                        href="#"
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Github className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </a>
                      <a
                        href="#"
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Linkedin className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </a>
                      <a
                        href="#"
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Mail className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Organization & Contact Section */}
          <div className="text-center mt-16 p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">About Our Organization</h3>
              <div className="max-w-4xl mx-auto">
                <h4 className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                  CSIF - Center for Strategic Innovation and Future
                </h4>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  This project was developed for the <strong>Center for Strategic Innovation and Future (CSIF)</strong>,
                  a forward-thinking organization dedicated to analyzing emerging technologies and their societal
                  impact. CSIF focuses on bridging the gap between technological advancement and strategic planning,
                  helping organizations and policymakers navigate the complexities of our rapidly evolving digital
                  landscape.
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Through comprehensive research and data-driven insights, CSIF empowers decision-makers to understand
                  the implications of AI and automation on workforce dynamics, enabling proactive strategies for the
                  future of work.
                </p>
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-300 font-semibold text-lg">
                    Contact us at:{" "}
                    <a
                      href="mailto:csiftechtank@gmail.com"
                      className="underline hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    >
                      csiftechtank@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

