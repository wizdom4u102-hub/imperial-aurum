import Testimonials from "@/components/Testimonials";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Testimonials />
    </main>
  );
}