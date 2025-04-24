import React from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper } from 'react-icons/fa';
import FooterPageTemplate from '../components/FooterPageTemplate';

const Blog = ({ darkMode, toggleDarkMode }) => {
  const blogPosts = [
    {
      id: 1,
      title: "Introducing PolyLingo: Breaking Language Barriers with AI",
      excerpt: "Learn about our mission to make communication seamless across languages and how our AI-powered platform is changing the way people connect globally.",
      author: "Sarah Chen",
      role: "CEO & Co-founder",
      date: "June 15, 2023",
      category: "Company News",
      imageUrl: "https://images.unsplash.com/photo-1546146830-2cca9512c68e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "The Technology Behind Real-Time Translation",
      excerpt: "Dive deep into the AI and machine learning technologies that power PolyLingo's real-time translation capabilities.",
      author: "Dr. Michael Rodriguez",
      role: "CTO",
      date: "July 3, 2023",
      category: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "5 Ways PolyLingo Can Transform Your Travel Experience",
      excerpt: "Discover how PolyLingo can help you navigate foreign countries, connect with locals, and enjoy a more authentic travel experience.",
      author: "Emma Wilson",
      role: "Travel Content Specialist",
      date: "August 12, 2023",
      category: "Travel",
      imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "How Businesses Are Using PolyLingo to Go Global",
      excerpt: "Case studies of businesses that have expanded their international reach using PolyLingo's translation services.",
      author: "James Park",
      role: "Business Development Manager",
      date: "September 5, 2023",
      category: "Business",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 5,
      title: "The Future of Language Learning with AI",
      excerpt: "How AI-powered tools like PolyLingo's Learning Hub are revolutionizing the way we learn new languages.",
      author: "Dr. Lisa Zhang",
      role: "Language Learning Expert",
      date: "October 18, 2023",
      category: "Education",
      imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 6,
      title: "PolyLingo 2.0: New Features and Improvements",
      excerpt: "Explore the exciting new features and improvements in the latest version of PolyLingo, including enhanced conversation mode and image translation.",
      author: "Alex Johnson",
      role: "Product Manager",
      date: "November 7, 2023",
      category: "Product Updates",
      imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const categories = ["All", "Company News", "Technology", "Travel", "Business", "Education", "Product Updates"];

  return (
    <FooterPageTemplate
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      title="Blog"
      subtitle="Insights, tips, and updates from the PolyLingo team"
      icon={<FaNewspaper size={24} />}
    >
      <div className="mb-8">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Explore the latest insights, tips, and updates from the PolyLingo team.
          Our blog covers everything from language learning strategies to the technology
          behind our translation platform.
        </p>
      </div>

      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                index === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      <motion.div
        className="mb-12 rounded-xl overflow-hidden shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-64 md:h-auto">
            <img
              src={blogPosts[0].imageUrl}
              alt={blogPosts[0].title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 flex flex-col justify-between">
            <div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {blogPosts[0].category}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {blogPosts[0].title}
              </h2>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                {blogPosts[0].excerpt}
              </p>
            </div>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {blogPosts[0].author.split(' ').map(name => name[0]).join('')}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {blogPosts[0].author}
                </p>
                <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <time dateTime="2020-03-16">{blogPosts[0].date}</time>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.slice(1).map((post, index) => (
          <motion.div
            key={post.id}
            className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
            <div className="p-6">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                {post.category}
              </span>
              <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                {post.title}
              </h3>
              <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {post.author.split(' ').map(name => name[0]).join('')}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.author}
                  </p>
                  <div className="flex space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime="2020-03-16">{post.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md bg-blue-600 text-white">
            1
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            2
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            3
          </button>
          <span className="px-3 py-1">...</span>
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            8
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            Next
          </button>
        </nav>
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
        <p className="mt-2 opacity-90">
          Get the latest PolyLingo news, articles, and resources, sent to your inbox weekly.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </FooterPageTemplate>
  );
};

export default Blog;
