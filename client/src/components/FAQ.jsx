import { useState } from 'react';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I create a ticket opening?',
      answer: 'You can create a ticket opening by clicking on the "Create Opening" button on the home page.',
    },
    {
      question: 'How do I browse available tickets?',
      answer: 'You can browse available tickets by clicking on the "Browse Openings" button on the home page.',
    },
    {
      question: 'How do I request a ticket?',
      answer: 'You can request a ticket by clicking on the "Request Ticket" button on the Browse Openings page.',
    },
  ];

  return (
    <div className="bg-gray-50 py-20" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-all max-w-3xl mx-auto cursor-pointer"
              onClick={() => toggleFAQ(index)} // Make the entire card clickable
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <span>{openIndex === index ? '-' : '+'}</span>
              </div>
              <div
                className={`mt-2 text-gray-600 transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
                style={{ 
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-color)',
                }}
              >
                {openIndex === index && <p>{faq.answer}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQ;