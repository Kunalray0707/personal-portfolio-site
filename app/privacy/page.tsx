export const metadata = {
  title: 'Privacy Policy | Portfolio AI Pro',
  description: 'Privacy Policy and data management practices for Portfolio AI Pro.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="mt-4 text-slate-500 dark:text-slate-400">Last updated: August 2026</p>

        <div className="mt-12 space-y-8 text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">1. Information We Collect</h2>
            <p className="mt-4">
              We collect information you provide directly to us, such as when you create or modify your account, request customer support, or communicate with us. This includes your name, email address, and payment information (processed securely by third parties).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">2. Portfolio Analytics</h2>
            <p className="mt-4">
              We collect anonymous analytics for your public portfolios to provide you with traffic insights. We hash IP addresses and User-Agents to ensure visitor privacy while maintaining accurate unique visitor counts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">3. How We Use Information</h2>
            <p className="mt-4">
              We use the information we collect to provide, maintain, and improve our services, to process transactions, to send you technical notices and support messages, and to protect against malicious activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">4. Data Sharing</h2>
            <p className="mt-4">
              We do not share your personal information with third parties except as necessary to provide our services (e.g., payment processors, hosting providers) or to comply with the law.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
