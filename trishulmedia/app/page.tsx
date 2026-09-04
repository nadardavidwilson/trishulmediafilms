const links = [
  {
    href: "https://github.com/cloudflare/vinext",
    label: "vinext",
  },
  {
    href: "https://developers.cloudflare.com/workers/",
    label: "Workers",
  },
];

export const revalidate = 300;

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto flex max-w-4xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
            Trishul Media
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-700">
          </p>
        </div>


        
      </section>
    </main>
  );
}
