<div align="center">
  <br />
  <h1>🚀 Portfolio AI Pro</h1>
  <p>
    <strong>The Ultimate AI-Powered Portfolio Builder & SaaS Platform</strong>
  </p>
  <br />
</div>

## 🌟 About The Project

**Portfolio AI Pro** is an enterprise-grade SaaS application designed to help professionals, creatives, and developers build stunning, client-ready portfolios in minutes using the power of AI.

Gone are the days of manually tweaking CSS or fighting with complex CMS platforms. Portfolio AI Pro offers a seamless drag-and-drop builder, intelligent AI content generation, robust analytics, and professional themes—all wrapped in a highly polished, responsive interface.

## ✨ Key Features

- 🤖 **AI-Powered Generation**: Instantly generate professional bios, project summaries, and SEO metadata using advanced AI.
- 🏗️ **Intuitive Drag & Drop Builder**: Construct your portfolio visually with customizable text, feature, and contact sections.
- 📈 **Advanced Analytics Engine**: Track unique visitors, referrals, and device metrics with a privacy-first tracking system.
- 🔒 **Secure Portfolios**: Lock your portfolio with a password or keep it public for the world to see.
- 🎨 **Animated & Glassmorphic UI**: Built with modern design principles—vibrant colors, glassmorphism, and smooth micro-animations powered by `framer-motion` across the entire app.
- ⚡ **Live Template Previews**: Browse and visually preview fully interactive template designs before using them.
- 🔑 **Passwordless OTP Authentication**: Seamless email and phone number login without the hassle of passwords.
- 📡 **Real-time Activity Feeds**: Live chronological feeds showing user registrations, portfolio creations, and updates directly in the Admin and User dashboards.
- 💳 **Integrated Payments**: Fully functional SaaS billing architecture.
- 👑 **Admin Dashboard**: Comprehensive management of users, subscriptions, announcements, and customer support tickets.
- 🌐 **SEO Optimized**: Dynamic `sitemap.xml`, `robots.txt`, and Open Graph image integration out of the box.

## 🛠️ Tech Stack

Built with cutting-edge technologies to ensure maximum performance, security, and scalability:

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Library:** [React 19](https://react.dev/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/)
* **Authentication:** NextAuth (Google & Credentials)
* **Drag & Drop:** `@dnd-kit`
* **Charts:** Recharts

## 🚀 Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

* Node.js (v18+)
* PostgreSQL server running locally or via a cloud provider

### Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/Kunalray0707/Portfolify.git
   cd Portfolify
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/portfolio"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Initialize the Database**
   Push the Prisma schema to your PostgreSQL database to create all necessary tables:
   ```sh
   npx prisma db push
   ```

5. **Start the Development Server**
   ```sh
   npm run dev
   ```

6. **View the Application**
   Open your browser and navigate to `http://localhost:3000`.

## 🛡️ Security & Architecture

- **Strict Security Headers**: Enforced HSTS, CSP, and X-Frame-Options configurations.
- **Privacy-First Tracking**: IP Addresses and User Agents are hashed using SHA-256 before storage to ensure complete GDPR compliance.
- **Dynamic Server Rendering**: Optimized static generation mixed with `force-dynamic` API routes to ensure lightning-fast load times.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <i>Built with ❤️ for creatives and professionals.</i>
</div>
