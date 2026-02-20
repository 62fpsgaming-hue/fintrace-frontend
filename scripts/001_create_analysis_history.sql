-- Create analysis_history table to store user transaction analyses
create table if not exists public.analysis_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- File metadata
  file_name text not null,
  file_size integer not null,

  -- Analysis summary data
  total_accounts integer not null default 0,
  suspicious_accounts integer not null default 0,
  fraud_rings_detected integer not null default 0,
  processing_time_ms integer not null default 0,

  -- Full analysis results (store the complete AnalysisResponse)
  analysis_data jsonb not null,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for faster queries
create index if not exists idx_analysis_history_user_id on public.analysis_history(user_id);
create index if not exists idx_analysis_history_created_at on public.analysis_history(created_at desc);

-- Enable RLS
alter table public.analysis_history enable row level security;

-- RLS Policies: Users can only access their own analysis history
create policy "Users can view their own analysis history"
  on public.analysis_history
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own analysis history"
  on public.analysis_history
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own analysis history"
  on public.analysis_history
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own analysis history"
  on public.analysis_history
  for delete
  using (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger to update updated_at on every update
drop trigger if exists set_updated_at on public.analysis_history;
create trigger set_updated_at
  before update on public.analysis_history
  for each row
  execute function public.handle_updated_at();
