# SeleSele

SeleSele is a Notion-alternative WYSIWYG editor built with Nuxt 3, designed for real-time collaboration and AI-powered content generation.

![SeleSele Editor](https://ui.nuxt.com/assets/templates/nuxt/editor-light.png)

## Features

- **Rich Text Editing**: Powered by [TipTap](https://tiptap.dev) for a seamless writing experience.
- **AI Integration**: Built-in AI completions and text transformations (Google Gemini optimized).
- **Real-time Collaboration**: Collaborative editing capabilities.
- **Modern UI**: Built with [Nuxt UI](https://ui.nuxt.com) for a polished look and feel.
- **Authentication**: Google Sign-In integration.

## Prerequisites

- Node.js (Latest LTS recommended)
- pnpm

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/fajar-dev/sele-sele.git
   cd sele-sele
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Ensure the following variables are set:

   ```ini
   # App
   API_BASE_URL=http://localhost:3000

   # Authentication (Google)
   GOOGLE_CLIENT_ID=your-google-client-id

   # Collaboration (Optional)
   PARTYKIT_HOST=your-partykit-host
   ```

## Development

Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Production & Deployment

To run the application in a production environment, we use PM2 for process management.

### Build and Start with PM2

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Start with PM2**:
   ```bash
   npx pm2 start ecosystem.config.cjs
   ```
   _This starts the application on port **8030**._

### Managing the Process

- **Status**: `npx pm2 list`
- **Logs**: `npx pm2 logs SeleSele`
- **Stop**: `npx pm2 stop SeleSele`
- **Restart**: `npx pm2 restart SeleSele`

## License

[MIT](./LICENSE)
