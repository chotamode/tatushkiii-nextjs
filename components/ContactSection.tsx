export function ContactSection() {
  const contacts = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Telegram',
      value: '@tattoo_master',
      href: 'https://t.me/tattoo_master',
      color: '#00A2E8',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Instagram',
      value: '@tattoo_master',
      href: 'https://instagram.com/tattoo_master',
      color: '#A349A4',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: 'Адрес',
      value: 'Москва, центр',
      href: null,
      color: '#22B14C',
    },
  ];

  return (
    <div className="py-12 px-6 mb-32">
      <div className="max-w-2xl mx-auto">
        <h2
          className="paint-title paint-green text-center mb-10"
          style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', transform: 'rotate(-1deg)' }}
        >
          где меня найти ♡
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {contacts.map((contact, index) => (
            <a
              key={index}
              href={contact.href || '#'}
              target={contact.href ? '_blank' : undefined}
              rel={contact.href ? 'noopener noreferrer' : undefined}
              className="paint-box p-5 flex items-center gap-4 cursor-pointer"
              style={{
                transform: `rotate(${index === 0 ? -1 : index === 1 ? 1 : -0.5}deg)`,
                minWidth: '200px',
              }}
            >
              <div
                className="contact-icon"
                style={{ borderColor: contact.color, color: contact.color }}
              >
                {contact.icon}
              </div>
              <div>
                <div className="paint-text text-sm opacity-60">{contact.label}</div>
                <div className="paint-title text-lg" style={{ color: contact.color }}>
                  {contact.value}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Hand-drawn decorative element */}
        <div className="flex justify-center mt-10">
          <svg width="150" height="40" viewBox="0 0 150 40" className="opacity-30">
            <path
              d="M10 20 Q40 5 75 20 Q110 35 140 20"
              stroke="#000"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="8 6"
            />
            <circle cx="75" cy="20" r="4" fill="#ED1C24" />
          </svg>
        </div>
      </div>
    </div>
  );
}
