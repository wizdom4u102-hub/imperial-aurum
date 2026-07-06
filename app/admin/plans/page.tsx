import { requireAdminPage } from '../../../lib/admin';

export default async function PlansPage() {
  await requireAdminPage();

  return (
    <div className="p-4 md:p-4 md:p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl md:text-2xl md:text-4xl font-bold mb-6">Plans & Investment</h1>

        <div className="bg-zinc-900 rounded-3xl p-8">
          <p className="text-zinc-400 text-center py-10 md:py-20">
            Plans system coming soon.
          </p>
        </div>

      </div>
    </div>
  )
}