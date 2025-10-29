import { Route, UserProgress, Video, Module } from "@/pages/Dashboard";

export const mockUserData = {
  id: "user-1",
  name: "John Smith",
  email: "john@example.com",
  avatar: "JS",
  progress: {
    completedVideos: 12,
    totalVideos: 18,
    studyTime: "3.2 hours",
    accuracy: 85,
    streak: 5,
    strengths: [
      "Personal Budgeting",
      "Basic Saving",
      "Investment Concepts",
      "Financial Planning"
    ],
    weaknesses: [
      "Compound Interest",
      "Rule of Three",
      "Risk Analysis"
    ]
  } as UserProgress
};

export const mockVideos: Video[] = [
  // Module 1: Fundamentals
  {
    id: "video-1",
    title: "What are Personal Finances?",
    channel: "Finance for Everyone",
    duration: "8:45",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: true,
    inProgress: false,
    needsReview: false,
    concepts: ["Personal Finance", "Budgeting", "Saving"],
    summary: [
      "Personal finance is the management of your money",
      "Includes budgeting, saving, investing and planning",
      "It's fundamental for economic stability"
    ],
    timestamps: [
      { time: "1:30", description: "Definition of personal finance" },
      { time: "3:45", description: "Main components" },
      { time: "6:20", description: "Benefits of good management" }
    ]
  },
  {
    id: "video-2",
    title: "How to Create Your First Budget",
    channel: "Financial Education",
    duration: "12:30",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: true,
    inProgress: false,
    needsReview: false,
    concepts: ["Budget", "Income", "Expenses", "50/30/20 Rule"],
    summary: [
      "A budget is a plan for your money",
      "The 50/30/20 rule: 50% needs, 30% wants, 20% savings",
      "You should review and adjust your budget regularly"
    ],
    timestamps: [
      { time: "2:15", description: "What is a budget" },
      { time: "5:30", description: "50/30/20 rule explained" },
      { time: "9:45", description: "Practical example" }
    ]
  },
  {
    id: "video-3",
    title: "Types of Savings and When to Use Each",
    channel: "Smart Saving",
    duration: "10:15",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: true,
    inProgress: false,
    needsReview: false,
    concepts: ["Savings", "Emergency Fund", "Short-term Savings", "Long-term Savings"],
    summary: [
      "There are different types of savings depending on the goal",
      "Emergency fund should cover 3-6 months of expenses",
      "Savings should be automatic and constant"
    ],
    timestamps: [
      { time: "1:45", description: "Types of savings" },
      { time: "4:20", description: "Emergency fund" },
      { time: "7:30", description: "Savings automation" }
    ]
  },
  {
    id: "video-4",
    title: "Introduction to Investments",
    channel: "Investment for Beginners",
    duration: "15:20",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: true,
    inProgress: false,
    needsReview: false,
    concepts: ["Investment", "Risk", "Return", "Diversification"],
    summary: [
      "Investing is making your money work for you",
      "Higher risk generally means higher potential return",
      "Diversification reduces risk"
    ],
    timestamps: [
      { time: "2:30", description: "What is investing" },
      { time: "6:15", description: "Risk-return relationship" },
      { time: "11:45", description: "Importance of diversification" }
    ]
  },
  {
    id: "video-5",
    title: "How to Calculate Compound Interest",
    channel: "Financial Mathematics",
    duration: "9:30",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: true,
    needsReview: false,
    concepts: ["Compound Interest", "Capitalization", "Financial Calculation"],
    summary: [
      "Compound interest is interest on interest",
      "It's the most powerful force for creating wealth",
      "Time is the most important factor"
    ],
    timestamps: [
      { time: "1:20", description: "Definition of compound interest" },
      { time: "3:45", description: "Basic formula" },
      { time: "6:30", description: "Practical example" }
    ]
  },

  // Module 2: Budgeting and Saving
  {
    id: "video-6",
    title: "Digital Tools for Budgeting",
    channel: "Fintech Solutions",
    duration: "11:45",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Financial Apps", "Automation", "Tracking"],
    summary: [
      "Apps can automate your budget",
      "Tracking is key to success",
      "Choose tools that adapt to your style"
    ],
    timestamps: [
      { time: "2:00", description: "Recommended apps" },
      { time: "5:30", description: "Initial setup" },
      { time: "8:45", description: "Tracking and adjustments" }
    ]
  },
  {
    id: "video-7",
    title: "How to Reduce Expenses Without Sacrificing Quality of Life",
    channel: "Minimalist Life",
    duration: "13:20",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Expense Reduction", "Optimization", "Quality of Life"],
    summary: [
      "Reducing expenses doesn't mean sacrificing happiness",
      "Identify unnecessary expenses",
      "Optimize necessary expenses"
    ],
    timestamps: [
      { time: "1:50", description: "Identify unnecessary expenses" },
      { time: "5:15", description: "Reduction strategies" },
      { time: "9:30", description: "Maintain quality of life" }
    ]
  },
  {
    id: "video-8",
    title: "Emergency Fund: How Much and Where to Keep It",
    channel: "Financial Security",
    duration: "8:15",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Emergency Fund", "Liquidity", "Security"],
    summary: [
      "Emergency fund should be liquid and secure",
      "Covers 3-6 months of essential expenses",
      "Should not be invested in risky instruments"
    ],
    timestamps: [
      { time: "1:30", description: "How much money you need" },
      { time: "4:00", description: "Where to keep it" },
      { time: "6:45", description: "When to use it" }
    ]
  },
  {
    id: "video-9",
    title: "Savings Goals: Short, Medium and Long Term",
    channel: "Financial Planning",
    duration: "10:30",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Financial Goals", "Timeframe", "Planning"],
    summary: [
      "Define clear and specific goals",
      "Different timeframes require different strategies",
      "Review and adjust your goals regularly"
    ],
    timestamps: [
      { time: "2:15", description: "Types of goals" },
      { time: "5:45", description: "Strategies by timeframe" },
      { time: "8:20", description: "Progress tracking" }
    ]
  },

  // Module 3: Basic Investment
  {
    id: "video-10",
    title: "Types of Investment for Beginners",
    channel: "Safe Investment",
    duration: "14:30",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Investment Types", "Risk", "Beginner"],
    summary: [
      "Start with low-risk investments",
      "Index funds are ideal for beginners",
      "Diversify from the beginning"
    ],
    timestamps: [
      { time: "2:30", description: "Conservative investments" },
      { time: "6:15", description: "Index funds" },
      { time: "10:45", description: "Basic diversification" }
    ]
  },
  {
    id: "video-11",
    title: "How to Choose Your Investor Profile",
    channel: "Financial Analysis",
    duration: "12:45",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Risk Profile", "Risk Tolerance", "Objectives"],
    summary: [
      "Your profile determines which investments are suitable",
      "Consider your age, income and objectives",
      "Review your profile periodically"
    ],
    timestamps: [
      { time: "1:45", description: "Profile factors" },
      { time: "5:20", description: "Tolerance test" },
      { time: "9:15", description: "Practical application" }
    ]
  },
  {
    id: "video-12",
    title: "Index Funds vs Active Funds",
    channel: "Investment Comparison",
    duration: "11:20",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Index Funds", "Active Funds", "Fees", "Performance"],
    summary: [
      "Index funds have lower fees",
      "Active funds seek to beat the market",
      "For most people, index funds are better"
    ],
    timestamps: [
      { time: "2:00", description: "Main differences" },
      { time: "5:30", description: "Cost comparison" },
      { time: "8:45", description: "Which to choose" }
    ]
  },
  {
    id: "video-13",
    title: "Diversification: Don't Put All Your Eggs in One Basket",
    channel: "Investment Strategy",
    duration: "9:45",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Diversification", "Risk", "Correlation"],
    summary: [
      "Diversification reduces risk",
      "Invest in different assets and sectors",
      "Not everything moves in the same direction"
    ],
    timestamps: [
      { time: "1:30", description: "What is diversification" },
      { time: "4:15", description: "Types of diversification" },
      { time: "7:30", description: "Practical example" }
    ]
  },

  // Module 4: Long-term Planning
  {
    id: "video-14",
    title: "Retirement Planning",
    channel: "Financial Future",
    duration: "16:30",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Retirement", "Pension", "Voluntary Savings", "401k"],
    summary: [
      "It's never too early to plan for retirement",
      "Compound interest is your best ally",
      "Diversify your income sources"
    ],
    timestamps: [
      { time: "2:45", description: "Why plan early" },
      { time: "7:20", description: "Available tools" },
      { time: "12:15", description: "Savings strategy" }
    ]
  },
  {
    id: "video-15",
    title: "Insurance: Essential Financial Protection",
    channel: "Financial Protection",
    duration: "13:15",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Insurance", "Protection", "Risk", "Premiums"],
    summary: [
      "Insurance protects your assets",
      "Evaluate what risks you need to cover",
      "Not all insurance is necessary"
    ],
    timestamps: [
      { time: "2:00", description: "Types of insurance" },
      { time: "6:30", description: "How to choose" },
      { time: "10:45", description: "Costs vs benefits" }
    ]
  },
  {
    id: "video-16",
    title: "Inheritance and Estate Planning",
    channel: "Financial Legacy",
    duration: "12:45",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    completed: false,
    inProgress: false,
    needsReview: false,
    concepts: ["Inheritance", "Will", "Estate Planning", "Taxes"],
    summary: [
      "Plan your financial legacy",
      "A will prevents family problems",
      "Consider tax aspects"
    ],
    timestamps: [
      { time: "1:45", description: "Importance of planning" },
      { time: "5:20", description: "Legal tools" },
      { time: "9:30", description: "Tax aspects" }
    ]
  }
];

export const mockModules: Module[] = [
  {
    id: "module-1",
    title: "Personal Finance Fundamentals",
    videos: mockVideos.slice(0, 5),
    completed: false,
    inProgress: true
  },
  {
    id: "module-2", 
    title: "Budgeting and Saving",
    videos: mockVideos.slice(5, 9),
    completed: false,
    inProgress: false
  },
  {
    id: "module-3",
    title: "Basic Investment",
    videos: mockVideos.slice(9, 13),
    completed: false,
    inProgress: false
  },
  {
    id: "module-4",
    title: "Long-term Planning",
    videos: mockVideos.slice(13, 16),
    completed: false,
    inProgress: false
  }
];

export const mockRouteData: Route = {
  id: "route-finances",
  title: "Personal Finance",
  description: "Learn to manage your money intelligently and build a solid financial future",
  modules: mockModules,
  totalVideos: 16,
  totalDuration: "3.5 hours",
  level: "Beginner",
  createdAt: "2025-01-15",
  progress: 68
};