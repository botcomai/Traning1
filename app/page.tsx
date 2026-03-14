import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const features = [
  {
    icon: '⚡',
    title: 'Fast Delivery',
    description: 'Get your services delivered quickly and efficiently by our expert team.',
  },
  {
    icon: '🛡️',
    title: 'Secure Payments',
    description: 'All transactions are secured with Paystack payment gateway.',
  },
  {
    icon: '⭐',
    title: 'Quality Guaranteed',
    description: 'We ensure the highest quality in every service we provide.',
  },
]

const categories = [
  { name: 'Web Development', icon: '💻', count: 12 },
  { name: 'Design', icon: '🎨', count: 8 },
  { name: 'Marketing', icon: '📣', count: 15 },
  { name: 'Consulting', icon: '💼', count: 6 },
  { name: 'Writing', icon: '✍️', count: 10 },
  { name: 'Data & Analytics', icon: '📊', count: 7 },
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Services <br />
            <span className="text-blue-200">At Your Fingertips</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover and book high-quality professional services. From web development to consulting, we have everything you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services"
              className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              Browse Services <FiArrowRight />
            </Link>
            <Link
              href="/auth/signup"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose ServiceHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="text-sm font-semibold text-gray-700">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.count} services</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of satisfied customers who trust ServiceHub for their professional service needs.
          </p>
          <Link
            href="/services"
            className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            Explore All Services <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}
