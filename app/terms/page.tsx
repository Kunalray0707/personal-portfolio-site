export const metadata = {
  title: 'Terms of Service | Portfolio AI Pro',
  description: 'Terms of Service and conditions for using Portfolio AI Pro.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Last updated: August 2026</p>

        <div className="mt-12 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p className="mt-4">
              By accessing and using Portfolio AI Pro, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">2. Description of Service</h2>
            <p className="mt-4">
              Portfolio AI Pro provides users with tools to build, manage, and host professional portfolios. We reserve the right to modify, suspend, or discontinue the service with or without notice at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">3. User Conduct</h2>
            <p className="mt-4">
              You agree to use the service only for lawful purposes. You are strictly prohibited from using our platform to host malicious scripts, spam, or copyrighted material you do not own.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">4. Payment and Subscriptions</h2>
            <p className="mt-4">
              Premium features are billed on a recurring basis (monthly or yearly). You may cancel your subscription at any time. Refunds are handled on a case-by-case basis within 14 days of the initial purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">5. Intellectual Property</h2>
            <p className="mt-4">
              You retain all ownership of the content you upload to your portfolios. Portfolio AI Pro retains all ownership of the platform's code, design, and intellectual property.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
