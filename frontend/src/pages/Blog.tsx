import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    title: "How AI is Revolutionizing Road Safety",
    excerpt: "Explore the latest advances in computer vision and machine learning that are making roads safer for everyone.",
    category: "Technology",
    date: "Jan 15, 2025",
    readTime: "5 min read",
    image: "gradient-from-primary-to-secondary"
  },
  {
    title: "Understanding Driver Drowsiness Detection",
    excerpt: "Deep dive into the science behind our drowsiness detection algorithms and how they keep drivers alert.",
    category: "Safety",
    date: "Jan 12, 2025",
    readTime: "7 min read",
    image: "gradient-from-secondary-to-accent"
  },
  {
    title: "The Power of Community-Driven Road Mapping",
    excerpt: "How crowdsourced hazard data creates a safer driving experience for entire communities.",
    category: "Community",
    date: "Jan 10, 2025",
    readTime: "4 min read",
    image: "gradient-from-accent-to-primary"
  },
  {
    title: "Fleet Safety: Reducing Accidents by 40%",
    excerpt: "Case study on how enterprise clients are using SafeRoad AI to dramatically improve fleet safety metrics.",
    category: "Case Study",
    date: "Jan 8, 2025",
    readTime: "6 min read",
    image: "gradient-from-primary-to-secondary"
  },
  {
    title: "Privacy in AI-Powered Safety Systems",
    excerpt: "Our commitment to user privacy while delivering life-saving safety features.",
    category: "Privacy",
    date: "Jan 5, 2025",
    readTime: "5 min read",
    image: "gradient-from-secondary-to-accent"
  },
  {
    title: "Road Hazard Detection: Behind the Scenes",
    excerpt: "Technical overview of how our AI identifies potholes, debris, and dangerous road conditions in real-time.",
    category: "Technology",
    date: "Jan 3, 2025",
    readTime: "8 min read",
    image: "gradient-from-accent-to-primary"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              SafeRoad AI Blog
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Latest insights on AI-powered road safety, technology updates, and community stories
            </p>
          </div>

          {/* Featured Post */}
          <Card className="mb-12 overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:shadow-xl transition-all">
            <div className="grid md:grid-cols-2">
              <div className={`h-64 md:h-auto bg-${posts[0].image}`} />
              <CardHeader className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <Badge>{posts[0].category}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {posts[0].date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {posts[0].readTime}
                  </div>
                </div>
                <CardTitle className="text-3xl mb-4">{posts[0].title}</CardTitle>
                <CardDescription className="text-lg mb-6">
                  {posts[0].excerpt}
                </CardDescription>
                <a href="#" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </a>
              </CardHeader>
            </div>
          </Card>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post, index) => (
              <Card
                key={index}
                className="group overflow-hidden bg-card/50 backdrop-blur border-border/50 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className={`h-48 bg-${post.image}`} />
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{post.excerpt}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <a href="#" className="inline-flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                      Read
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
