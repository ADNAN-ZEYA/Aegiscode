import type { AnalyticsSnapshot } from '@/types/analytics';
import type { BlogPost, StudyMaterial } from '@/types/content';
import type { Category } from '@/types/common';
import type { Course } from '@/types/course';
import type { Quiz } from '@/types/quiz';
import type { UserProfile } from '@/types/user';

const now = new Date().toISOString();

export const demoCategories: Category[] = [
  {
    name: 'Web Architecture',
    description: 'Scalable frontend and backend systems.',
    color: '#059669',
    createdAt: now,
    updatedAt: now,
    createdBy: 'system',
    slug: 'web-architecture',
    status: 'published',
    tags: ['architecture'],
  },
  {
    name: 'Cyber Security',
    description: 'Security posture and practical workflows.',
    color: '#0f172a',
    createdAt: now,
    updatedAt: now,
    createdBy: 'system',
    slug: 'cyber-security',
    status: 'published',
    tags: ['security'],
  },
  {
    name: 'Interview Prep',
    description: 'Fast revision for interviews and exams.',
    color: '#d97706',
    createdAt: now,
    updatedAt: now,
    createdBy: 'system',
    slug: 'interview-prep',
    status: 'published',
    tags: ['prep'],
  },
];

const baseAuthor = {
  id: 'admin-seed',
  name: 'Aegis Editorial',
  username: 'aegis-editorial',
};

export const demoBlogs: BlogPost[] = [
  {
    type: 'blog',
    title: 'Designing low-cost Firebase content queries for reading-heavy platforms',
    excerpt: 'A pragmatic approach to pagination, denormalization, and view tracking without burning reads.',
    coverImage: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'web-architecture',
    readingTime: 9,
    featured: true,
    seo: {
      title: 'Low-cost Firebase query patterns',
      description: 'Build reading-heavy educational platforms without accidental Firestore cost spikes.',
    },
    author: baseAuthor,
    publishedAt: now,
    viewCount: 1280,
    markdown: `## Why reading products need different data patterns

Unlike chat apps or collaborative dashboards, educational content pages can favor cached fetches, route segment revalidation, and analytics writes that batch on the backend.

### Key rules

- Prefer server queries for public content.
- Use cursor pagination, not broad realtime subscriptions.
- Track view events through route handlers.
`,
    blocks: [
      {
        id: 'blog-callout',
        type: 'callout',
        title: 'Production note',
        tone: 'info',
        content: 'Use published collection queries for public pages and reserve realtime listeners for admin editing surfaces only.',
      },
    ],
    createdAt: now,
    updatedAt: now,
    createdBy: 'admin-seed',
    slug: 'firebase-query-patterns-for-educational-platforms',
    status: 'published',
    tags: ['firebase', 'architecture', 'seo'],
  },
  {
    type: 'blog',
    title: 'Writing study materials that feel like premium documentation',
    excerpt: 'Structure, typography, and interactive blocks that make long-form study content easier to finish.',
    categorySlug: 'interview-prep',
    readingTime: 7,
    seo: {
      title: 'Documentation-style study materials',
      description: 'Turn study notes into polished, mobile-friendly reading experiences.',
    },
    author: baseAuthor,
    publishedAt: now,
    viewCount: 845,
    markdown: `## The strongest study pages behave like docs

Readers need hierarchy, summaries, and reinforcement patterns. That means:

1. short intros
2. semantic headings
3. code and table support
4. inline quiz blocks`,
    blocks: [],
    createdAt: now,
    updatedAt: now,
    createdBy: 'admin-seed',
    slug: 'documentation-style-study-materials',
    status: 'published',
    tags: ['content-design', 'ux'],
  },
];

export const demoStudyMaterials: StudyMaterial[] = [
  {
    type: 'studyMaterial',
    title: 'System Design Revision Pack',
    excerpt: 'A structured online module for load balancing, caching, queues, and scaling tradeoffs.',
    categorySlug: 'web-architecture',
    readingTime: 16,
    difficulty: 'intermediate',
    estimatedCompletionMinutes: 30,
    seo: {
      title: 'System design revision pack',
      description: 'Read-first system design material with diagrams, code, and knowledge checks.',
    },
    author: baseAuthor,
    publishedAt: now,
    viewCount: 2034,
    markdown: `## Distributed systems essentials

### Caching

Use caching to reduce database pressure and improve perceived speed.

### Queues

Queues absorb spikes and improve resilience across asynchronous workflows.`,
    blocks: [
      {
        id: 'table-1',
        type: 'table',
        title: 'Scaling patterns',
        table: {
          headers: ['Problem', 'Pattern', 'Tradeoff'],
          rows: [
            ['Read surge', 'Caching', 'Stale data'],
            ['Write bursts', 'Queues', 'Eventual consistency'],
          ],
        },
      },
      {
        id: 'quiz-inline',
        type: 'quiz',
        title: 'Knowledge check',
        quizId: 'system-design-speed-check',
      },
    ],
    createdAt: now,
    updatedAt: now,
    createdBy: 'admin-seed',
    slug: 'system-design-revision-pack',
    status: 'published',
    tags: ['system-design', 'interview'],
  },
];

export const demoCourses: Course[] = [
  {
    title: 'System Design for Engineering Students',
    excerpt: 'A structured course that turns scattered PDF notes into guided, readable modules for revision and understanding.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'web-architecture',
    level: 'intermediate',
    estimatedHours: 12,
    enrolledCount: 186,
    featured: true,
    author: baseAuthor,
    seo: {
      title: 'System Design course for engineering students',
      description: 'A structured read-first course for distributed systems and system design fundamentals.',
    },
    modules: [
      {
        id: 'course-module-1',
        title: 'Foundations of scalable systems',
        slug: 'foundations-of-scalable-systems',
        summary: 'Core principles behind availability, latency, and scaling tradeoffs.',
        markdown: `## Why systems fail under load

Engineering students often get PDF notes that are hard to revise. This course turns those notes into clean learning modules.

### In this module

- latency vs throughput
- vertical vs horizontal scaling
- fault domains
`,
        order: 1,
        estimatedMinutes: 35,
        sourcePdfPath: 'courses/system-design-for-engineering-students/module-1-source.pdf',
      },
      {
        id: 'course-module-2',
        title: 'Caching and queues',
        slug: 'caching-and-queues',
        summary: 'How to reduce pressure, smooth spikes, and keep systems responsive.',
        markdown: `## Caching and asynchronous workflows

Caching speeds up read-heavy systems. Queues make bursty write workloads safer.
`,
        order: 2,
        estimatedMinutes: 30,
        sourcePdfPath: 'courses/system-design-for-engineering-students/module-2-source.pdf',
      },
    ],
    courseFolder: 'courses/system-design-for-engineering-students',
    sourcePdfPath: 'courses/system-design-for-engineering-students/master-source.pdf',
    isPremium: false,
    publishedAt: now,
    viewCount: 764,
    createdAt: now,
    updatedAt: now,
    createdBy: 'admin-seed',
    slug: 'system-design-for-engineering-students',
    status: 'published',
    tags: ['course', 'system-design', 'engineering'],
  },
];

export const demoQuizzes: Quiz[] = [
  {
    title: 'System design speed check',
    excerpt: 'Five quick questions to validate revision retention.',
    categorySlug: 'web-architecture',
    difficulty: 'intermediate',
    durationMinutes: 8,
    questionCount: 2,
    questions: [
      {
        id: 'q1',
        prompt: 'Which pattern helps absorb burst traffic asynchronously?',
        options: ['In-memory cache', 'Queue', 'CDN purge', 'Lazy hydration'],
        answerIndex: 1,
        explanation: 'Queues smooth bursts by decoupling request intake from processing.',
      },
      {
        id: 'q2',
        prompt: 'What is the tradeoff of aggressive caching?',
        options: ['Higher latency', 'Stale data', 'Worse SEO', 'Reduced compression'],
        answerIndex: 1,
        explanation: 'Caching improves speed but can serve slightly stale information.',
      },
    ],
    seo: {
      title: 'System design quiz',
      description: 'Quick self-assessment for system design revision.',
    },
    author: baseAuthor,
    publishedAt: now,
    viewCount: 512,
    createdAt: now,
    updatedAt: now,
    createdBy: 'admin-seed',
    slug: 'system-design-speed-check',
    status: 'published',
    tags: ['quiz', 'system-design'],
  },
];

export const demoUsers: UserProfile[] = [
  {
    uid: 'user-1',
    name: 'Priya Sharma',
    username: 'priya',
    email: 'priya@example.com',
    bio: 'Frontend engineer documenting revision workflows.',
    role: 'student',
    bookmarksCount: 12,
    createdAt: now,
    updatedAt: now,
    createdBy: 'system',
    slug: 'priya',
    status: 'published',
    tags: ['profile'],
  },
];

export const demoAnalytics: AnalyticsSnapshot = {
  viewsToday: 2840,
  weeklyReaders: 984,
  savedArticles: 194,
  completionRate: 63,
};
