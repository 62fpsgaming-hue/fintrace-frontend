# Fintrace - Financial Forensics Dashboard

A comprehensive fraud detection and transaction analysis platform built with Next.js, FastAPI, and Supabase.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![Python](https://img.shields.io/badge/Python-3.11-blue)

## Features

### Frontend
- 🎨 Modern, responsive UI built with Next.js 15 and Tailwind CSS
- 🔐 Secure authentication with Supabase Auth
- 📊 Interactive data visualization with Recharts and vis-network
- 💾 Analysis history tracking and management
- 🌓 Dark mode support
- 📱 Mobile-responsive design

### Backend
- ⚡ High-performance FastAPI backend
- 🔍 Advanced fraud detection algorithms
- 🕸️ Fraud ring clustering and identification
- 📈 Real-time transaction analysis
- 🔒 CORS-enabled API with security best practices

### Fraud Detection Patterns
- **Structuring**: Detection of transactions split to avoid reporting thresholds
- **Rapid Layering**: Identification of high-velocity transaction chains
- **Round-Trip**: Detection of circular money flow patterns
- **Fan-Out**: Identification of one-to-many distribution schemes
- **Velocity Spike**: Detection of sudden activity increases
- **Smurfing**: Identification of coordinated small-amount transactions
- **Dormant Activation**: Detection of suddenly active dormant accounts

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Network Graphs**: vis-network
- **State Management**: Zustand
- **Authentication**: Supabase Auth

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Server**: Uvicorn
- **Validation**: Pydantic

### Database
- **Database**: PostgreSQL (Supabase)
- **ORM**: Supabase Client
- **Auth**: Supabase Auth with RLS

## Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # Dashboard pages
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── dashboard/          # Dashboard-specific components
│   ├── landing/            # Landing page components
│   └── ui/                 # Reusable UI components
├── lib/                     # Utility libraries
│   ├── supabase/           # Supabase client and queries
│   ├── api.ts              # API client
│   └── types.ts            # TypeScript types
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API application
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   └── test_main.py        # API tests
├── scripts/                 # Database migration scripts
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- Python 3.11+
- Supabase account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fintrace.git
cd fintrace
```

### 2. Setup Database (Supabase)

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL migration in `scripts/001_create_analysis_history.sql`
3. Copy your project URL and anon key

### 3. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The API will be available at `http://localhost:8000`

### 4. Setup Frontend

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## Testing

### Backend Tests

```bash
cd backend
pytest test_main.py -v
```

### Frontend Tests

```bash
pnpm test  # If tests are configured
```

### Manual API Testing

```bash
cd backend
python test_api.py
```

## Deployment

### 🚀 Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/62fpsgaming-hue/fintrace-frontend&root-directory=dashboard)

**Or follow these steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set root directory to `dashboard`
   - Add environment variables
   - Click Deploy

3. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=your_backend_url
   ```

**See detailed guides:**
- 📖 [Quick Start Guide](./DEPLOYMENT_QUICK_START.md)
- 📖 [Full Vercel Guide](./VERCEL_DEPLOYMENT.md)

### Alternative Deployment Options

1. **Database**: Deploy to Supabase (free tier available)
2. **Backend**: Deploy to Railway/Render/Fly.io
3. **Frontend**: Deploy to Vercel/Netlify/Cloudflare Pages

```bash
# Deploy frontend to Vercel
vercel

# Or use the deployment script
./deploy-vercel.sh
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Main Endpoints

#### `POST /analyze`
Analyze a CSV file of transactions

**Request:**
```bash
curl -X POST http://localhost:8000/analyze \
  -F "file=@transactions.csv"
```

**Response:**
```json
{
  "suspicious_accounts": [...],
  "fraud_rings": [...],
  "summary": {
    "total_accounts": 1000,
    "suspicious_accounts": 15,
    "fraud_rings_detected": 3,
    "processing_time": 2.34
  }
}
```

## CSV Format

Your transaction CSV should have these columns:

```csv
transaction_id,sender_id,receiver_id,amount,timestamp
TXN-001,ACC-100,ACC-200,5000,2024-01-01T10:00:00Z
TXN-002,ACC-200,ACC-300,4500,2024-01-01T10:05:00Z
```

## Environment Variables

### Frontend (.env.local)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_backend_url
```

### Backend

```bash
PORT=8000
CORS_ORIGINS=*  # Set to your frontend domain in production
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Backend powered by [FastAPI](https://fastapi.tiangolo.com/)
- Database and auth by [Supabase](https://supabase.com/)

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Review API documentation at `/docs`

## Roadmap

- [ ] Real-time analysis updates
- [ ] Advanced ML-based fraud detection
- [ ] Export reports to PDF
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Webhook notifications
- [ ] API rate limiting
- [ ] Batch processing support

---

Made with ❤️ for financial security
