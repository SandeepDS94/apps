-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Quizzes table
create table quizzes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  topic text not null,
  difficulty text not null, -- 'easy', 'medium', 'hard'
  score integer,
  total_questions integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions table (stored for history/review)
create table questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references quizzes(id) not null,
  question_text text not null,
  options jsonb not null, -- Array of strings
  correct_answer text not null,
  user_answer text,
  is_correct boolean,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Study Materials table
create table study_materials (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  topic text not null,
  content text not null, -- Markdown content
  type text not null, -- 'notes', 'summary', 'flashcards'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Analytics/Streaks (simplified)
create table user_stats (
  user_id uuid references profiles(id) primary key,
  total_quizzes integer default 0,
  average_score numeric default 0,
  streak_days integer default 0,
  last_active_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Basic)
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

alter table quizzes enable row level security;
create policy "Users can view own quizzes" on quizzes for select using (auth.uid() = user_id);
create policy "Users can insert own quizzes" on quizzes for insert with check (auth.uid() = user_id);

alter table questions enable row level security;
create policy "Users can view own questions" on questions for select using (auth.uid() = (select user_id from quizzes where id = quiz_id));
create policy "Users can insert own questions" on questions for insert with check (auth.uid() = (select user_id from quizzes where id = quiz_id));

alter table study_materials enable row level security;
create policy "Users can view own materials" on study_materials for select using (auth.uid() = user_id);
create policy "Users can insert own materials" on study_materials for insert with check (auth.uid() = user_id);

alter table user_stats enable row level security;
create policy "Users can view own stats" on user_stats for select using (auth.uid() = user_id);

-- Notes table
create table notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  topic text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table notes enable row level security;
create policy "Users can view own notes" on notes for select using (auth.uid() = user_id);
create policy "Users can insert own notes" on notes for insert with check (auth.uid() = user_id);
