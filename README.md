# FarmLink

## About
FarmLink is an agricultural super app designed to connect farmers with information, experts, and communities. The platform aims to address key challenges in agriculture through knowledge sharing and networking.

## Problem Statement
- Limited access to agricultural information
- Fragmented supply chains
- Limited access to finance and insurance
- Low technology adoption
- Data privacy concerns

## Features
- User authentication (register, login)
- Profile management
- Agricultural blogs/posts browsing
- Community/expert following
- Content creation with image uploads
- Commenting and liking posts
- Direct messaging with experts and communities

## Tech Stack
- **Backend**: Python (Flask)
- **Database**: PostgreSQL
- **Frontend**: ReactJS with Redux Toolkit
- **Design**: Figma (mobile-friendly)
- **Testing**: Jest & Minitests

## Getting Started

### 🎨 Design
- **Figma** - Mobile-first wireframes & UI design


### Backend Setup
```bash
# Clone the repository
git clone git@github.com:Michellembogo/Farmlink-backend.git
cd Farmlink/backend

# Set up virtual environment
python -m venv venv
source venv/bin/activate  

# Install dependencies
pip install -r requirements.txt

# Set up database
flask db init
flask db migrate
flask db upgrade

# Run server
flask run
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Run development server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create a post
- `GET /api/posts/:id` - Get specific post

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

### Social
- `POST /api/follow` - Follow expert/community
- `GET /api/follow` - View followed entities
- `POST /api/posts/:id/comments` - Comment on post
- `POST /api/messages` - Send message

## License
MIT License

## Contact
Email: farmlink@gmail.com
|
## Contributors
Issa – Blog post functionality(frontend)

Prudence Canva – Messaging & following system(frontend)

Silvia Apadet –  Welcome, home, login/signup pages(Frontend)

Tasha Nduku - Backend

Michelle Mbogo - Backend

