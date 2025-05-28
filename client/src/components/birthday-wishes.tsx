import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { motion } from 'framer-motion';

async function fetchMessages() {
  const res = await fetch('/api/messages');
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

async function postMessage({ content, author }: { content: string; author: string }) {
  console.log('📤 Sending message to server:', { content, author });
  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, author })
  });
  
  if (!res.ok) {
    const error = await res.json();
    console.error('❌ Failed to post message:', error);
    throw new Error(error.message || 'Failed to post message');
  }
  
  const data = await res.json();
  console.log('✅ Message posted successfully:', data);
  return data;
}

export default function BirthdayWishes() {
  const queryClient = useQueryClient();
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages
  });
  
  const mutation = useMutation({
    mutationFn: postMessage,
    onSuccess: (data) => {
      console.log('🎉 Message mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
    onError: (error) => {
      console.error('❌ Message mutation failed:', error);
    }
  });
  
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) {
      console.warn('⚠️ Form submission with empty fields');
      return;
    }
    console.log('📝 Submitting message:', { content, author });
    mutation.mutate({ content, author });
    setContent('');
    setAuthor('');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="font-playfair text-4xl md:text-5xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Birthday Wishes
          </motion.h2>
          <motion.p
            className="font-montserrat text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Special messages just for you
          </motion.p>
        </div>

        {/* Message Form */}
        <form onSubmit={handleSubmit} className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-center">
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="border rounded-lg px-4 py-2 font-montserrat text-base w-full md:w-1/4"
            required
          />
          <input
            type="text"
            placeholder="Your birthday wish..."
            value={content}
            onChange={e => setContent(e.target.value)}
            className="border rounded-lg px-4 py-2 font-montserrat text-base w-full md:w-1/2"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg font-montserrat font-semibold shadow-md hover:from-pink-600 hover:to-purple-700 transition-all"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Sending...' : 'Send Wish'}
          </button>
        </form>

        {/* Messages List */}
        <div className="space-y-8">
          {isLoading && <p>Loading wishes...</p>}
          {error && <p className="text-red-500">Failed to load wishes.</p>}
          {messages && messages.length === 0 && <p>No wishes yet. Be the first to send one!</p>}
          {messages && messages.map((wish: any, index: number) => (
            <motion.div
              key={wish.id}
              className="glass-effect rounded-2xl p-8 transform hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start gap-4">
                <div className={`bg-gradient-to-br from-pink-500 to-purple-600 rounded-full p-3 flex-shrink-0`}>
                  <span className="text-white h-6 w-6 text-2xl">🎉</span>
                </div>
                <div className="flex-1">
                  <p className="font-montserrat text-lg text-gray-700 leading-relaxed mb-3">
                    "{wish.content}"
                  </p>
                  <p className="font-montserrat text-sm text-purple-600 font-medium">
                    — {wish.author}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
