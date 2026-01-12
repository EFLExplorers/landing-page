-- Simplified Seed Data for ESL Explorers
-- This version avoids ON CONFLICT and works reliably
-- Run AFTER content-schema.sql has been applied

-- ============================================
-- 0. Pages
-- ============================================
INSERT INTO public.pages (route, title, meta_description)
VALUES
  ('/', 'ESL Explorers - Home', 'Start your English learning journey with ESL Explorers'),
  ('/about', 'About ESL Explorers', 'Learn more about the ESL Explorers team, mission, and vision'),
  ('/contact', 'Contact ESL Explorers', 'Get in touch with ESL Explorers for course and platform information')
ON CONFLICT (route) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description;

-- ============================================
-- Page Sections for Home Page
-- ============================================
-- First get the home page ID
INSERT INTO public.page_sections (page_id, section_key, section_type, content, sort_order, active)
SELECT
  p.id,
  'hero',
  'hero',
  '{"title": "Welcome to ESL Explorers", "subtitle": "Start your English learning adventure today", "background_image": "/hero-bg.jpg"}',
  10,
  true
FROM public.pages p WHERE p.route = '/';

INSERT INTO public.page_sections (page_id, section_key, section_type, content, sort_order, active)
SELECT
  p.id,
  'tagline',
  'tagline',
  '{"text": "Empowering learners worldwide with innovative English education solutions"}',
  20,
  true
FROM public.pages p WHERE p.route = '/';

INSERT INTO public.page_sections (page_id, section_key, section_type, content, sort_order, active)
SELECT
  p.id,
  'register-cta',
  'cta',
  '{"title": "Ready to Start Learning?", "subtitle": "Join thousands of students already improving their English", "buttons": [{"text": "Get Started", "url": "/register", "primary": true}, {"text": "Learn More", "url": "/about", "primary": false}]}',
  100,
  true
FROM public.pages p WHERE p.route = '/';

-- ============================================
-- 1. Pricing Tiers (content_items table)
-- ============================================
INSERT INTO public.content_items (content_type, content, sort_order, active)
VALUES
  ('pricing', '{"name": "Free Access", "price": "Free", "period": "", "description": "Free access to basic features and content to help you get started."}', 10, true),
  ('pricing', '{"name": "Individual", "price": "$20", "period": "/MO", "description": "Access to all features and content, perfect for individual learners."}', 20, true),
  ('pricing', '{"name": "Teacher", "price": "$25", "period": "/MO", "description": "Complete access with additional teaching tools and resources."}', 30, true),
  ('pricing', '{"name": "School", "price": "$15", "period": "/MO", "description": "Bulk pricing for schools, includes all features and management tools."}', 40, true);

-- ============================================
-- 2. Services (content_items table)
-- ============================================
INSERT INTO public.content_items (content_type, content, sort_order, active)
VALUES
  ('service', '{"title": "Student Portal", "description": "Our lessons make learning feel like an exciting adventure, where young learners can explore and grow. Each lesson keeps students feeling they''re in class.", "icon": "🎓", "background_icons": ["📖","✏️","🎯"]}', 10, true),
  ('service', '{"title": "Teacher Resources", "description": "Access a comprehensive library of teaching materials, lesson plans, and interactive activities designed to make your ESL classes more engaging and effective.", "icon": "📚", "background_icons": ["📝","🎨","🔍"]}', 20, true),
  ('service', '{"title": "Interactive Learning", "description": "Engage students with our interactive games and exploration features that make learning English fun while building confidence.", "icon": "🎮", "background_icons": ["🎲","🏆","⭐"]}', 30, true),
  ('service', '{"title": "Progress Tracking", "description": "Monitor student progress with detailed analytics and personalized learning paths that adapt to each student''s needs.", "icon": "📊", "background_icons": ["📈","🎯","🏅"]}', 40, true),
  ('service', '{"title": "Assessment Tools", "description": "Comprehensive evaluation tools and quizzes that help measure learning outcomes and identify areas for improvement in real-time.", "icon": "✅", "background_icons": ["📋","🎯","📝"]}', 50, true),
  ('service', '{"title": "Communication Hub", "description": "Foster collaboration between students, teachers, and parents with our integrated messaging and feedback system.", "icon": "💬", "background_icons": ["📱","📧","👥"]}', 60, true);

-- ============================================
-- 3. Learning Tools (content_items table)
-- ============================================
INSERT INTO public.content_items (content_type, content, sort_order, active)
VALUES
  ('learning_tool', '{"title": "Interactive Games", "description": "Engage with our collection of fun, educational games that make learning English enjoyable and effective.", "icon": "🎮"}', 10, true),
  ('learning_tool', '{"title": "Digital Flashcards", "description": "Master vocabulary and grammar with our interactive flashcard system that adapts to your learning progress.", "icon": "🎴"}', 20, true),
  ('learning_tool', '{"title": "Progress Tracking", "description": "Monitor your learning journey with detailed analytics and personalized learning paths.", "icon": "📊"}', 30, true),
  ('learning_tool', '{"title": "Practice Exercises", "description": "Reinforce your learning with a variety of exercises designed to improve your English skills.", "icon": "✍️"}', 40, true),
  ('learning_tool', '{"title": "Audio Resources", "description": "Improve your pronunciation and listening skills with our comprehensive audio library.", "icon": "🎧"}', 50, true),
  ('learning_tool', '{"title": "Video Lessons", "description": "Learn through engaging video content that brings English to life in real-world contexts.", "icon": "🎥"}', 60, true);

-- ============================================
-- 4. FAQs
-- ============================================
INSERT INTO public.faqs (category, question, answer, sort_order, active)
VALUES
  ('contact', 'What types of English courses do you offer?', 'We offer a wide range of English courses including General English, Business English, IELTS Preparation, TOEFL Preparation, and Conversational English. Our courses cater to all proficiency levels from beginner to advanced.', 10, true),
  ('contact', 'How are the lessons structured?', 'Each lesson is 60 minutes long and includes interactive activities, real-world examples, and practical exercises. Our curriculum follows a communicative approach with focus on speaking, listening, reading, and writing skills.', 20, true),
  ('contact', 'What resources do teachers use?', 'Our teachers use a combination of modern textbooks, multimedia materials, authentic content, and our proprietary digital learning platform. All materials are regularly updated to ensure relevance and effectiveness.', 30, true),
  ('contact', 'How many lessons can I take per week?', 'You can choose from flexible scheduling options ranging from 1 to 5 lessons per week. We recommend at least 2-3 lessons per week for optimal learning progress.', 40, true),
  ('contact', 'What types of activities are included?', 'Our lessons include role-plays, discussions, pronunciation practice, grammar exercises, vocabulary building, and cultural exchange activities. We also incorporate games and multimedia content to make learning engaging.', 50, true),
  ('contact', 'Do you offer exam preparation courses?', 'Yes, we specialize in preparation courses for IELTS, TOEFL, Cambridge exams, and other international English proficiency tests. Our teachers are experienced in exam strategies and techniques.', 60, true),
  ('contact', 'How can I access the course content?', 'All course materials are available through our online learning platform. You can access them 24/7 from any device with an internet connection. We also provide downloadable resources for offline study.', 70, true),
  ('contact', 'How do I get started?', 'Simply fill out the contact form above or reach out to us through email or phone. We''ll schedule a free consultation to assess your level and discuss your learning goals.', 80, true);

-- ============================================
-- 5. Team Members
-- ============================================
INSERT INTO public.team_members (name, role, title, image_url, bio, expertise, sort_order, active)
VALUES
  ('Shinade Groves', 'Chief Executive Officer', 'CEO & Founder', '/assets/images/characters/Emma.png', 'Passionate about revolutionizing ESL education through innovative technology and engaging content.', ARRAY['Leadership', 'Education Strategy', 'Product Vision'], 10, true),
  ('Bobby Brown', 'Lead Developer', 'Technical Lead', '/assets/images/characters/Luke.png', 'Full-stack developer dedicated to creating seamless learning experiences through cutting-edge technology.', ARRAY['Full-Stack Development', 'UI/UX', 'System Architecture'], 20, true),
  ('Nathan Van Der Watt', 'Senior Designer', 'Creative Lead', '/assets/images/characters/Riley.png', 'Creative visionary focused on designing beautiful, intuitive interfaces that enhance the learning experience.', ARRAY['Visual Design', 'User Experience', 'Brand Identity'], 30, true);

-- ============================================
-- 6. About Stats
-- ============================================
INSERT INTO public.about_stats (number, label, sort_order, active)
VALUES
  ('10K+', 'Students Worldwide', 10, true),
  ('500+', 'Expert Teachers', 20, true),
  ('95%', 'Success Rate', 30, true),
  ('24/7', 'Learning Support', 40, true);

-- ============================================
-- 7. Core Values
-- ============================================
INSERT INTO public.core_values (icon, title, description, sort_order, active)
VALUES
  ('🎓', 'Excellence', 'We strive for the highest quality in everything we create', 10, true),
  ('🤝', 'Community', 'Building connections and fostering a supportive learning environment', 20, true),
  ('💡', 'Innovation', 'Continuously evolving and improving our learning methods', 30, true),
  ('🌍', 'Accessibility', 'Making quality education available to everyone, everywhere', 40, true);

-- ============================================
-- 8. Home Page Sections
-- ============================================

-- Hero section
INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, cta_label, cta_href, sort_order, active, data)
SELECT
  p.id,
  'hero',
  'hero',
  'Start your learning journey today!',
  'We''re so happy you''re here! However, you will need to register to get started.',
  NULL,
  NULL,
  NULL,
  10,
  true,
  '{"buttons": [{"label": "Register Student", "href": "/register/student"}, {"label": "Register Teacher", "href": "/register/teacher"}]}'::jsonb
FROM public.pages p WHERE p.route = '/';

-- Tagline section
INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'tagline',
  'text',
  'Explore the universe of language!',
  'We provide teachers with stellar ESL resources and guide students on an exciting journey to English mastery!',
  NULL,
  20,
  true,
  '{}'::jsonb
FROM public.pages p WHERE p.route = '/';

-- Register CTA section
INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, cta_label, cta_href, sort_order, active, data)
SELECT
  p.id,
  'register-cta',
  'cta',
  'Ready to Start Your English Learning Journey?',
  'Join our community of learners and get access to all our premium features.',
  NULL,
  'Create Your Account',
  '/Auth/register',
  90,
  true,
  '{}'::jsonb
FROM public.pages p WHERE p.route = '/';

-- ============================================
-- 9. About Page Sections
-- ============================================
INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'hero',
  'hero',
  'About ESL Explorers',
  'Pioneering the future of English language learning',
  NULL,
  10,
  true,
  '{}'::jsonb
FROM public.pages p WHERE p.route = '/about';

INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'description',
  'text',
  NULL,
  NULL,
  'We''re a passionate team of educators, developers, and designers committed to making English language learning an exciting adventure. Our mission is to break down language barriers and create a world where everyone can communicate confidently in English.',
  20,
  true,
  '{}'::jsonb
FROM public.pages p WHERE p.route = '/about';

INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'tagline',
  'text',
  NULL,
  NULL,
  'Adventure awaits - learn English with ESL Explorers',
  30,
  true,
  '{}'::jsonb
FROM public.pages p WHERE p.route = '/about';

INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'mission',
  'text',
  'Our Mission',
  NULL,
  'At ESL Explorers, we believe learning English should be an exciting journey, not a daunting task. Our mission is to transform language education through innovative technology, engaging content, and personalized learning experiences. We empower both teachers and students with tools that make learning effective, enjoyable, and accessible to everyone, regardless of their background or location.',
  40,
  true,
  '{"icon": "🎯", "points": ["Interactive Learning Experiences", "Global Community Building", "Comprehensive Curriculum"]}'::jsonb
FROM public.pages p WHERE p.route = '/about';

INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'vision',
  'text',
  'Our Vision',
  NULL,
  'We envision a world where language barriers dissolve and every individual can confidently communicate in English. Our platform will be the leading destination for ESL education, known for its innovative approach, engaging content, and proven results. We see a future where learning English is not just about grammar and vocabulary, but about connecting cultures and building bridges between people worldwide.',
  50,
  true,
  '{"icon": "🔮", "goals": ["Global Accessibility", "Innovation Leadership", "Cultural Exchange"]}'::jsonb
FROM public.pages p WHERE p.route = '/about';

INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'team-intro',
  'text',
  'Meet Our Team',
  NULL,
  'Our diverse team brings together expertise in education, technology, design, and content creation to deliver an exceptional learning experience.',
  60,
  true,
  '{"icon": "👥"}'::jsonb
FROM public.pages p WHERE p.route = '/about';

INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'values-header',
  'text',
  'Our Core Values',
  NULL,
  NULL,
  70,
  true,
  '{}'::jsonb
FROM public.pages p WHERE p.route = '/about';

-- ============================================
-- 10. Contact Page Sections
-- ============================================
INSERT INTO public.page_sections (page_id, section_key, section_type, heading, subheading, body, sort_order, active, data)
SELECT
  p.id,
  'hero',
  'hero',
  'Get in Touch',
  'Have questions about our English learning programs? We''re here to help!',
  'Reach out to us and let''s start your learning journey together.',
  10,
  true,
  '{"contact_info": [{"icon": "📍", "text": "123 Learning Street, Education City, EC 12345"}, {"icon": "📧", "text": "contact@eslexplorers.com", "href": "mailto:contact@eslexplorers.com"}, {"icon": "📞", "text": "+1 (234) 567-890", "href": "tel:+1234567890"}]}'::jsonb
FROM public.pages p WHERE p.route = '/contact';

-- ============================================
-- 11. Additional Content (Optional)
-- ============================================

-- Lesson Modules (for teacher platform)
INSERT INTO public.lesson_modules (name, color_token, recommended_students, description, lessons_summary, duration_summary, sort_order, active)
VALUES
  ('Beginner', 'var(--theme-muted)', '25-30', 'Perfect for students with little to no English experience', '120+ lessons', '6-8 months', 10, true),
  ('Elementary', 'var(--accent)', '20-25', 'Building foundational vocabulary and basic grammar skills', '150+ lessons', '8-10 months', 20, true);

-- Teacher Benefits
INSERT INTO public.teacher_benefits (title, description, sort_order, active)
VALUES
  ('Ready-Made Content', 'Access hundreds of pre-designed lesson plans, activities, and assessments that save you hours of preparation time.', 10, true),
  ('Student Progress Tracking', 'Monitor individual and class progress with detailed analytics and performance reports.', 20, true);

-- Testimonials
INSERT INTO public.testimonials (quote, author_name, author_role, sort_order, active)
VALUES
  ('ESL Explorers has transformed my learning experience! The interactive lessons are fantastic.', NULL, NULL, 10, true);