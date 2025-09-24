"use client";


import Image from "next/image";
import { Card, CardContent } from "../ui/card";


export function BentoGrid6() {
  return (
    <section className="bg-background section-padding-y border-b p-20" >
      <div className="container-padding-x container mx-auto flex flex-col gap-10 md:gap-12">
        {/* Section Title */}
        <div className="section-title-gap-lg mx-auto flex max-w-xl flex-col items-center text-center">
          {/* Main Heading */}
          <h2 className="heading-lg">
            Capture, organize, and surface meeting insights
          </h2>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 gap-3 md:gap-6 lg:grid-cols-3 lg:grid-rows-2">
          {/* Wide Feature Card - Top Left */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-2">
            <Image
              src="https://res.cloudinary.com/dqxcs3pwx/image/upload/v1758680662/wjm0dufk1ewft0ujdjr9.jpg"
              alt="AI Meeting Notes"
              width={813}
              height={332}
              className="hidden h-auto w-full object-cover md:block md:h-[332px]"
            />
            <Image
              src="/ai-meeting-notes_mobile.png"
              alt="AI Meeting Notes"
              width={480}
              height={332}
              className="block h-auto w-full md:hidden"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">
                AI Meeting Notes
              </h3>
              <p className="text-muted-foreground">
                Automatic summaries with key decisions & action items
              </p>
            </CardContent>
          </Card>
          {/* Regular Feature Card - Top Right */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-1">
            <Image
              src="https://res.cloudinary.com/dqxcs3pwx/image/upload/v1758680662/wjm0dufk1ewft0ujdjr9.jpg"
              alt="Universal Search"
              width={480}
              height={332}
              className="h-auto w-full object-cover md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">
                Universal Search
              </h3>
              <p className="text-muted-foreground">
                Find any discussion across all meetings
              </p>
            </CardContent>
          </Card>
          {/* Regular Feature Card - Bottom Left */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-1">
            <Image
              src="https://res.cloudinary.com/dqxcs3pwx/image/upload/v1758680662/wjm0dufk1ewft0ujdjr9.jpg"
              alt="AI Meeting Notes"
              width={480}
              height={332}
              className="h-auto w-full object-cover md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">
                Smart Tags
              </h3>
              <p className="text-muted-foreground">
                Categorize by project, topic, or participants
              </p>
            </CardContent>
          </Card>
          {/* Wide Feature Card - Bottom Right */}
          <Card className="bg-muted/80 gap-0 overflow-hidden rounded-xl border-none p-0 shadow-none lg:col-span-2">
            <Image
              src="https://res.cloudinary.com/dqxcs3pwx/image/upload/v1758680662/wjm0dufk1ewft0ujdjr9.jpg"
              alt="Team Insights"
              width={813}
              height={332}
              className="hidden h-[332px] w-full object-cover md:block"
            />
            <Image
              src="/team-insights_mobile.png"
              alt="Team Insights"
              width={480}
              height={332}
              className="block h-auto w-full object-cover md:hidden md:h-[332px]"
            />
            <CardContent className="flex flex-col gap-2 p-6">
              <h3 className="text-foreground text-lg font-semibold">
                Team Insights
              </h3>
              <p className="text-muted-foreground">
                Meeting analytics and participation metrics
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
