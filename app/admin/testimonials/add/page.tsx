'use client';

export default function AddManualTestimonial() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-8">Add Manual Testimonial</h1>
      <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
        <form className="space-y-6">
          {/* Form fields - you can expand this later */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Name</label>
            <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-3 text-white" />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Message</label>
            <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-3 h-40 text-white"></textarea>
          </div>
          <button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-semibold px-8 py-3 rounded-2xl transition">
            Add Testimonial
          </button>
        </form>
      </div>
    </div>
  );
}