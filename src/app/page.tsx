import { Nav } from "@/components/nav"
import { Hero } from "@/components/hero"
import { Showcase } from "@/components/showcase"
import { Features } from "@/components/features"
import { How } from "@/components/how"
import { Pricing } from "@/components/pricing"
import { LeadForm } from "@/components/lead-form"
import { Footer } from "@/components/footer"
import { ScrollSetup } from "@/components/scroll-setup"

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Showcase />
      <Features />
      <How />
      <Pricing />
      <LeadForm />
      <Footer />
      <ScrollSetup />
    </main>
  )
}
