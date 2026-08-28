import React, { useState } from 'react';
import styles from '@src/styles/brandTools.module.scss';

function ToolFaq({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={styles.faqList}>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.q} className={styles.faqItem}>
            <button
              type="button"
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className={styles.faqAnswer}>
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ToolFaq;
