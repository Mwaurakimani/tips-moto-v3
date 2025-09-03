import {
  Users,
  Target,
  Award,
  Shield,
  TrendingUp,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Star,
  Trophy,
  BarChart3,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { UserHeader } from './UserHeader';
import { UserFooter } from './UserFooter';

interface UserAboutPageProps {
  onBackToHome: () => void;
  onNavigateToTips?: () => void;
  onBackToAdmin?: () => void;
  onSignIn?: () => void;
  onGetStarted?: () => void;
}

export function UserAboutPage({ onBackToHome, onNavigateToTips, onBackToAdmin, onSignIn, onGetStarted }: UserAboutPageProps) {

  const achievements = [
    { icon: <Trophy className="w-6 h-6" />, title: '90%+ Accuracy', description: 'Proven track record of winning predictions' },
    { icon: <Users className="w-6 h-6" />, title: '10,000+ Users', description: 'Trusted by thousands of Kenyan bettors' },
    { icon: <Target className="w-6 h-6" />, title: '500+ Wins', description: 'Successful tips delivered monthly' },
    { icon: <Award className="w-6 h-6" />, title: 'Top Rated', description: 'Leading sports betting platform in Kenya' }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      title: 'Transparency',
      description: 'We believe in honest, transparent communication with our users. Every tip comes with detailed analysis and reasoning.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-500" />,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from our prediction algorithms to customer service.'
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: 'Community',
      description: 'Building a strong community of successful bettors who support and learn from each other.'
    }
  ];

  const features = [
    'Advanced statistical analysis',
    'Real-time match data integration',
    'Expert team insights',
    'M-Pesa payment integration',
    '24/7 customer support',
    'Mobile-optimized platform'
  ];

  return (
    <div className="min-h-screen bg-black">

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/20 rounded-2xl mb-6">
            <Trophy className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            About <span className="text-orange-500">Tips Moto</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Kenya's premier sports betting tips platform, dedicated to helping you make
            informed betting decisions with data-driven insights and expert analysis.
          </p>
        </section>

        {/* Our Story */}
        <section className="mb-16">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-orange-500">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Founded in 2024, Tips Moto was born from a passion for sports and a commitment to
                helping Kenyan bettors succeed. Our team of experienced analysts and sports experts
                combines traditional football knowledge with cutting-edge data analytics to deliver
                the most accurate predictions in the market.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                We understand the unique challenges of sports betting in Kenya, from local league
                insights to international tournament analysis. That's why we've built a platform
                that's not just accurate, but also accessible and affordable for every Kenyan bettor.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Achievements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-orange-500">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 text-center hover:bg-gray-900/70 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500">
                      {achievement.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{achievement.title}</h3>
                  <p className="text-gray-400">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-orange-500">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {value.icon}
                    <h3 className="text-xl font-bold ml-3 text-white">{value.title}</h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>



        {/* What We Offer */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-orange-500">What We Offer</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-500">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  Advanced Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-500">
                  <Zap className="w-6 h-6 mr-3" />
                  Why Choose Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Proven Accuracy</h4>
                    <p className="text-gray-400 text-sm">90%+ success rate backed by data</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Real-Time Updates</h4>
                    <p className="text-gray-400 text-sm">Live match analysis and updates</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-white">Secure Payments</h4>
                    <p className="text-gray-400 text-sm">Safe M-Pesa integration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-orange-500">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 text-center hover:bg-gray-900/70 transition-colors">
              <CardContent className="pt-6">
                <Phone className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2 text-white">Phone</h3>
                <p className="text-gray-400">+254 712 345 678</p>
                <p className="text-gray-400">+254 789 012 345</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 text-center hover:bg-gray-900/70 transition-colors">
              <CardContent className="pt-6">
                <Mail className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2 text-white">Email</h3>
                <p className="text-gray-400">info@tipsmoto.com</p>
                <p className="text-gray-400">support@tipsmoto.com</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 text-center hover:bg-gray-900/70 transition-colors">
              <CardContent className="pt-6">
                <MapPin className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                <h3 className="font-bold mb-2 text-white">Location</h3>
                <p className="text-gray-400">Nairobi, Kenya</p>
                <p className="text-gray-400">East Africa</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-16">
          <Card className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Ready to Start Winning?</h2>
              <p className="text-gray-300 mb-6">
                Join thousands of successful bettors who trust Tips Moto for their winning predictions.
              </p>
              <Button
                size="lg"
                onClick={onBackToHome}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg rounded-2xl"
              >
                Get Started Today
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
